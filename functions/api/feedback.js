/**
 * Cloudflare Pages Function: POST /api/feedback
 * Recibe el formulario de feedback y lo envía por email mediante Resend.
 * Requiere el secret RESEND_API_KEY configurado en Cloudflare Pages.
 */
import { validarFeedback, esSpam, construirEmail, crearRateLimiter } from '../../src/utils/feedback.js';

const RESEND_URL = 'https://api.resend.com/emails';
const MAX_BODY_BYTES = 10 * 1024;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

// Solo aceptamos peticiones desde la propia web (mismo origen)
function origenPermitido(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function crearHandler({ fetchImpl = (...args) => fetch(...args), rateLimiter = crearRateLimiter() } = {}) {
  return async function onRequestPost({ request, env }) {
    if (!origenPermitido(request)) {
      return json(403, { error: 'Origen no permitido' });
    }

    const ip = request.headers.get('CF-Connecting-IP') ?? 'desconocida';
    if (!rateLimiter(ip)) {
      return json(429, { error: 'Demasiados envíos. Inténtalo de nuevo más tarde.' });
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json(413, { error: 'Mensaje demasiado grande' });
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(400, { error: 'Formato de petición no válido' });
    }

    // Al bot se le responde como si todo fuera bien, para no darle pistas
    if (esSpam(body)) {
      return json(200, { ok: true });
    }

    const { valido, errores, datos } = validarFeedback(body);
    if (!valido) {
      return json(400, { error: 'Datos no válidos', errores });
    }

    if (!env?.RESEND_API_KEY) {
      console.error('[feedback] Falta el secret RESEND_API_KEY');
      return json(500, { error: 'El servicio de feedback no está configurado' });
    }

    try {
      const res = await fetchImpl(RESEND_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(construirEmail(datos)),
      });
      if (!res.ok) {
        console.error('[feedback] Resend respondió', res.status, await res.text());
        return json(502, { error: 'No se pudo enviar el mensaje' });
      }
    } catch (err) {
      console.error('[feedback] Error de red con Resend', err);
      return json(502, { error: 'No se pudo enviar el mensaje' });
    }

    return json(200, { ok: true });
  };
}

export const onRequestPost = crearHandler();
