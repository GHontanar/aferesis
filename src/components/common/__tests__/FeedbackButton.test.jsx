import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeedbackButton from '../FeedbackButton';

const MENSAJE = 'La calculadora de TPE no acepta decimales';

function abrir() {
  render(<FeedbackButton />);
  fireEvent.click(screen.getByLabelText('feedback'));
}

function escribirMensaje(texto = MENSAJE) {
  fireEvent.change(screen.getByLabelText(/Mensaje/), { target: { value: texto } });
}

function responder(status, body) {
  return Promise.resolve(new Response(JSON.stringify(body), { status }));
}

describe('FeedbackButton', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('abre el formulario con el aviso de datos de pacientes', () => {
    abrir();
    expect(screen.getByText('Feedback y Sugerencias')).toBeInTheDocument();
    expect(screen.getByText(/No incluyas datos de pacientes/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email \(opcional\)/)).toBeInTheDocument();
  });

  it('envía el formulario y muestra confirmación', async () => {
    fetch.mockReturnValue(responder(200, { ok: true }));
    abrir();
    escribirMensaje();
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'a@b.es' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(await screen.findByText(/se ha enviado correctamente/)).toBeInTheDocument();
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('/api/feedback');
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({ tipo: 'sugerencia', mensaje: MENSAJE, email: 'a@b.es', pagina: '/' });
  });

  it('valida en cliente y no envía si el mensaje es corto', async () => {
    abrir();
    escribirMensaje('corto');
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(await screen.findByText(/al menos 10 caracteres/)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('valida el email en cliente', async () => {
    abrir();
    escribirMensaje();
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'malo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(await screen.findByText('El email no es válido')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('muestra el error del servidor (rate limit)', async () => {
    fetch.mockReturnValue(responder(429, { error: 'Demasiados envíos. Inténtalo de nuevo más tarde.' }));
    abrir();
    escribirMensaje();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(await screen.findByText(/Demasiados envíos/)).toBeInTheDocument();
  });

  it('muestra error de conexión si fetch falla', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'));
    abrir();
    escribirMensaje();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(await screen.findByText(/Sin conexión/)).toBeInTheDocument();
  });

  it('limpia el formulario al cerrar tras un envío correcto', async () => {
    fetch.mockReturnValue(responder(200, { ok: true }));
    abrir();
    escribirMensaje();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    await screen.findByText(/se ha enviado correctamente/);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));

    fireEvent.click(screen.getByLabelText('feedback'));
    await waitFor(() => expect(screen.getByLabelText(/Mensaje/)).toHaveValue(''));
  });
});
