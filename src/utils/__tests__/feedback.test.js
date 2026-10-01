import { describe, it, expect } from 'vitest';
import { validarFeedback, esSpam, construirEmail, crearRateLimiter } from '../feedback';
import { FEEDBACK } from '../constants';

const valido = {
  tipo: 'sugerencia',
  mensaje: 'Añadir la calculadora de citrato, por favor',
  email: '',
  pagina: '/tpe',
};

describe('validarFeedback', () => {
  it('acepta datos válidos y los normaliza', () => {
    const r = validarFeedback({ ...valido, mensaje: '  ' + valido.mensaje + '  ' });
    expect(r.valido).toBe(true);
    expect(r.errores).toEqual({});
    expect(r.datos.mensaje).toBe(valido.mensaje);
  });

  it('acepta email válido', () => {
    expect(validarFeedback({ ...valido, email: 'a@b.es' }).valido).toBe(true);
  });

  it('rechaza tipo inexistente', () => {
    const r = validarFeedback({ ...valido, tipo: 'hack' });
    expect(r.valido).toBe(false);
    expect(r.errores.tipo).toBeDefined();
  });

  it('rechaza mensaje demasiado corto', () => {
    expect(validarFeedback({ ...valido, mensaje: 'corto' }).errores.mensaje).toMatch(/al menos/);
  });

  it('rechaza mensaje demasiado largo', () => {
    const r = validarFeedback({ ...valido, mensaje: 'x'.repeat(FEEDBACK.MENSAJE_MAX + 1) });
    expect(r.errores.mensaje).toMatch(/superar/);
  });

  it('acepta mensaje en el límite exacto', () => {
    expect(validarFeedback({ ...valido, mensaje: 'x'.repeat(FEEDBACK.MENSAJE_MAX) }).valido).toBe(true);
  });

  it('rechaza email mal formado', () => {
    expect(validarFeedback({ ...valido, email: 'no-es-email' }).errores.email).toBeDefined();
    expect(validarFeedback({ ...valido, email: 'a b@c.es' }).errores.email).toBeDefined();
  });

  it('rechaza email demasiado largo', () => {
    const email = 'a'.repeat(FEEDBACK.EMAIL_MAX) + '@b.es';
    expect(validarFeedback({ ...valido, email }).errores.email).toBeDefined();
  });

  it('tolera entradas no objeto o con tipos raros', () => {
    expect(validarFeedback(null).valido).toBe(false);
    expect(validarFeedback('texto').valido).toBe(false);
    const r = validarFeedback({ tipo: 1, mensaje: ['x'], email: {} });
    expect(r.valido).toBe(false);
    expect(r.datos.email).toBe('');
  });

  it('trunca la página al máximo permitido', () => {
    const r = validarFeedback({ ...valido, pagina: '/' + 'p'.repeat(500) });
    expect(r.datos.pagina).toHaveLength(FEEDBACK.PAGINA_MAX);
  });
});

describe('esSpam', () => {
  it('detecta el honeypot relleno', () => {
    expect(esSpam({ website: 'http://spam' })).toBe(true);
  });
  it('no marca envíos legítimos', () => {
    expect(esSpam({ website: '' })).toBe(false);
    expect(esSpam({})).toBe(false);
    expect(esSpam(null)).toBe(false);
  });
});

describe('construirEmail', () => {
  const fecha = new Date('2026-10-01T10:00:00Z');

  it('construye el payload de Resend con remitente y destinatario fijos', () => {
    const e = construirEmail(validarFeedback(valido).datos, { fecha });
    expect(e.from).toBe(FEEDBACK.FROM);
    expect(e.to).toEqual([FEEDBACK.TO]);
    expect(e.subject).toBe('[Aféresis] Sugerencia: Añadir la calculadora de citrato, por favor');
    expect(e.text).toContain('Página: /tpe');
    expect(e.text).toContain('Email de contacto: (no indicado)');
    expect(e.text).toContain('2026-10-01T10:00:00.000Z');
    expect(e).not.toHaveProperty('reply_to');
  });

  it('añade reply_to cuando hay email', () => {
    const e = construirEmail({ ...valido, email: 'a@b.es' }, { fecha });
    expect(e.reply_to).toBe('a@b.es');
  });

  it('elimina saltos de línea del asunto y lo recorta', () => {
    const e = construirEmail({ ...valido, mensaje: 'línea1\r\nBcc: x@y.z\n' + 'z'.repeat(100) });
    expect(e.subject).not.toMatch(/[\r\n]/);
    expect(e.subject.length).toBeLessThanOrEqual('[Aféresis] Sugerencia: '.length + 60);
  });

  it('indica página desconocida si no viene', () => {
    expect(construirEmail({ ...valido, pagina: '' }).text).toContain('(desconocida)');
  });
});

describe('crearRateLimiter', () => {
  it('permite hasta el máximo y bloquea después', () => {
    const permitido = crearRateLimiter({ max: 2, windowMs: 1000 });
    expect(permitido('ip', 0)).toBe(true);
    expect(permitido('ip', 10)).toBe(true);
    expect(permitido('ip', 20)).toBe(false);
  });

  it('separa contadores por clave', () => {
    const permitido = crearRateLimiter({ max: 1, windowMs: 1000 });
    expect(permitido('a', 0)).toBe(true);
    expect(permitido('b', 0)).toBe(true);
    expect(permitido('a', 1)).toBe(false);
  });

  it('libera tras la ventana', () => {
    const permitido = crearRateLimiter({ max: 1, windowMs: 1000 });
    expect(permitido('ip', 0)).toBe(true);
    expect(permitido('ip', 999)).toBe(false);
    expect(permitido('ip', 1000)).toBe(true);
  });
});
