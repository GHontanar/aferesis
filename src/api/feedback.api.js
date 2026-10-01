import { FEEDBACK } from '../utils/constants';

/**
 * Envía el feedback a la Pages Function.
 * @returns {Promise<{ ok: true } | { ok: false, error: string, errores?: Object }>}
 */
export async function enviarFeedback(datos) {
  try {
    const res = await fetch(FEEDBACK.ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(datos),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: body.error ?? 'No se pudo enviar el mensaje',
        errores: body.errores,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Sin conexión. Inténtalo de nuevo más tarde.' };
  }
}
