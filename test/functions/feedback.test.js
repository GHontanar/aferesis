// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { crearHandler } from '../../functions/api/feedback.js';
import { crearRateLimiter } from '../../src/utils/feedback.js';

const URL_API = 'https://aferesis.example/api/feedback';
const valido = { tipo: 'error', mensaje: 'El cálculo de volemia falla con 0 kg', pagina: '/tpe' };

function peticion(body, { origin = 'https://aferesis.example', ip = '1.2.3.4' } = {}) {
  const headers = { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip };
  if (origin) headers.Origin = origin;
  return new Request(URL_API, {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const env = { RESEND_API_KEY: 're_test' };

describe('POST /api/feedback', () => {
  let fetchImpl;
  let handler;

  beforeEach(() => {
    fetchImpl = vi.fn().mockResolvedValue(new Response('{"id":"x"}', { status: 200 }));
    handler = crearHandler({ fetchImpl, rateLimiter: crearRateLimiter({ max: 100 }) });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('envía el email a Resend y responde 200', async () => {
    const res = await handler({ request: peticion({ ...valido, email: 'a@b.es' }), env });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer re_test');
    const payload = JSON.parse(init.body);
    expect(payload.to).toEqual(['privacidad@ghontanar.com']);
    expect(payload.from).toContain('avisos@ghontanar.com');
    expect(payload.reply_to).toBe('a@b.es');
    expect(payload.text).toContain('El cálculo de volemia falla');
  });

  it('usa charset=utf-8 en todas las respuestas', async () => {
    const ok = await handler({ request: peticion(valido), env });
    const ko = await handler({ request: peticion('{mal'), env });
    for (const r of [ok, ko]) {
      expect(r.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
    }
  });

  it('rechaza peticiones de otro origen', async () => {
    const res = await handler({ request: peticion(valido, { origin: 'https://evil.example' }), env });
    expect(res.status).toBe(403);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('rechaza peticiones sin Origin o con Origin inválido', async () => {
    expect((await handler({ request: peticion(valido, { origin: null }), env })).status).toBe(403);
    expect((await handler({ request: peticion(valido, { origin: 'no-url' }), env })).status).toBe(403);
  });

  it('devuelve 400 con JSON mal formado', async () => {
    const res = await handler({ request: peticion('{mal'), env });
    expect(res.status).toBe(400);
  });

  it('devuelve 400 con errores de validación', async () => {
    const res = await handler({ request: peticion({ tipo: 'x', mensaje: 'a' }), env });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.errores).toHaveProperty('tipo');
    expect(body.errores).toHaveProperty('mensaje');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('devuelve 413 si el cuerpo es demasiado grande', async () => {
    const res = await handler({ request: peticion({ ...valido, mensaje: 'x'.repeat(20000) }), env });
    expect(res.status).toBe(413);
  });

  it('descarta en silencio el spam del honeypot', async () => {
    const res = await handler({ request: peticion({ ...valido, website: 'spam' }), env });
    expect(res.status).toBe(200);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('aplica rate limiting por IP', async () => {
    handler = crearHandler({ fetchImpl, rateLimiter: crearRateLimiter({ max: 1 }) });
    expect((await handler({ request: peticion(valido), env })).status).toBe(200);
    expect((await handler({ request: peticion(valido), env })).status).toBe(429);
    expect((await handler({ request: peticion(valido, { ip: '5.6.7.8' }), env })).status).toBe(200);
  });

  it('devuelve 500 si falta RESEND_API_KEY', async () => {
    const res = await handler({ request: peticion(valido), env: {} });
    expect(res.status).toBe(500);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('devuelve 502 si Resend responde con error', async () => {
    fetchImpl.mockResolvedValue(new Response('{"message":"invalid"}', { status: 422 }));
    const res = await handler({ request: peticion(valido), env });
    expect(res.status).toBe(502);
  });

  it('devuelve 502 si falla la red', async () => {
    fetchImpl.mockRejectedValue(new Error('ECONNRESET'));
    const res = await handler({ request: peticion(valido), env });
    expect(res.status).toBe(502);
  });
});
