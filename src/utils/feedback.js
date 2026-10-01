/**
 * Lógica pura del formulario de feedback.
 * Se usa tanto en el cliente (FeedbackButton) como en la Pages Function
 * (functions/api/feedback.js), así la validación es idéntica en ambos lados.
 */
import { FEEDBACK } from './constants.js';

const TIPOS_VALIDOS = Object.values(FEEDBACK.TIPOS);
// Suficiente para detectar errores de tecleo; la validez real la da el reply.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const asString = (valor) => (typeof valor === 'string' ? valor.trim() : '');

/**
 * Valida y normaliza los datos del formulario.
 * @returns {{ valido: boolean, errores: Object<string,string>, datos: Object }}
 */
export function validarFeedback(input) {
  const entrada = input && typeof input === 'object' ? input : {};
  const datos = {
    tipo: asString(entrada.tipo),
    mensaje: asString(entrada.mensaje),
    email: asString(entrada.email),
    pagina: asString(entrada.pagina).slice(0, FEEDBACK.PAGINA_MAX),
  };
  const errores = {};

  if (!TIPOS_VALIDOS.includes(datos.tipo)) {
    errores.tipo = 'Selecciona un tipo de feedback';
  }

  if (datos.mensaje.length < FEEDBACK.MENSAJE_MIN) {
    errores.mensaje = `El mensaje debe tener al menos ${FEEDBACK.MENSAJE_MIN} caracteres`;
  } else if (datos.mensaje.length > FEEDBACK.MENSAJE_MAX) {
    errores.mensaje = `El mensaje no puede superar ${FEEDBACK.MENSAJE_MAX} caracteres`;
  }

  if (datos.email) {
    if (datos.email.length > FEEDBACK.EMAIL_MAX || !EMAIL_REGEX.test(datos.email)) {
      errores.email = 'El email no es válido';
    }
  }

  return { valido: Object.keys(errores).length === 0, errores, datos };
}

/**
 * Honeypot: campo oculto que una persona nunca rellena.
 */
export function esSpam(input) {
  return Boolean(input && asString(input.website));
}

/**
 * Construye el payload para la API de Resend a partir de datos ya validados.
 * Solo se envía texto plano: no hay riesgo de inyección HTML en el correo.
 */
export function construirEmail(datos, { fecha = new Date() } = {}) {
  const tipoLabel = FEEDBACK.TIPO_LABELS[datos.tipo] ?? datos.tipo;
  // Sin saltos de línea en el asunto para evitar inyección de cabeceras
  const resumen = datos.mensaje.replace(/\s+/g, ' ').slice(0, 60);

  const lineas = [
    `Tipo: ${tipoLabel}`,
    `Página: ${datos.pagina || '(desconocida)'}`,
    `Email de contacto: ${datos.email || '(no indicado)'}`,
    `Fecha: ${fecha.toISOString()}`,
    '',
    'Mensaje:',
    datos.mensaje,
  ];

  const email = {
    from: FEEDBACK.FROM,
    to: [FEEDBACK.TO],
    subject: `[Aféresis] ${tipoLabel}: ${resumen}`,
    text: lineas.join('\n'),
  };
  if (datos.email) email.reply_to = datos.email;
  return email;
}

/**
 * Rate limiter en memoria por clave (IP). Best-effort: en Cloudflare cada
 * isolate tiene su propia memoria, así que frena ráfagas pero no es global.
 */
export function crearRateLimiter({
  max = FEEDBACK.RATE_LIMIT_MAX,
  windowMs = FEEDBACK.RATE_LIMIT_WINDOW_MS,
} = {}) {
  const hits = new Map();

  return function permitido(clave, ahora = Date.now()) {
    const recientes = (hits.get(clave) ?? []).filter((t) => ahora - t < windowMs);
    if (recientes.length >= max) {
      hits.set(clave, recientes);
      return false;
    }
    recientes.push(ahora);
    hits.set(clave, recientes);
    return true;
  };
}
