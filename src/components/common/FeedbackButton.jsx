import { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { FEEDBACK } from '../../utils/constants';
import { validarFeedback } from '../../utils/feedback';
import { enviarFeedback } from '../../api/feedback.api';

const FORM_INICIAL = { tipo: FEEDBACK.TIPOS.SUGERENCIA, mensaje: '', email: '', website: '' };

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState('idle'); // idle | enviando | enviado | error
  const [errorEnvio, setErrorEnvio] = useState('');

  const cerrar = () => {
    if (estado === 'enviando') return;
    setOpen(false);
    if (estado === 'enviado') {
      setForm(FORM_INICIAL);
      setEstado('idle');
    }
  };

  const cambiar = (campo) => (e) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    const payload = { ...form, pagina: window.location.pathname };
    const { valido, errores: erroresValidacion } = validarFeedback(payload);
    if (!valido) {
      setErrores(erroresValidacion);
      return;
    }

    setEstado('enviando');
    const resultado = await enviarFeedback(payload);
    if (resultado.ok) {
      setEstado('enviado');
    } else {
      setErrores(resultado.errores ?? {});
      setErrorEnvio(resultado.error);
      setEstado('error');
    }
  };

  const enviando = estado === 'enviando';

  return (
    <>
      <Fab
        color="primary"
        aria-label="feedback"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <FeedbackIcon />
      </Fab>

      <Dialog open={open} onClose={cerrar} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography component="span" variant="h6" fontWeight={600}>
            Feedback y Sugerencias
          </Typography>
        </DialogTitle>

        {estado === 'enviado' ? (
          <>
            <DialogContent>
              <Alert severity="success">¡Gracias! Tu mensaje se ha enviado correctamente.</Alert>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={cerrar} variant="contained">
                Cerrar
              </Button>
            </DialogActions>
          </>
        ) : (
          <Box component="form" onSubmit={enviar} noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="warning">
                No incluyas datos de pacientes ni ninguna información que permita identificarlos.
              </Alert>

              <TextField
                select
                label="Tipo"
                value={form.tipo}
                onChange={cambiar('tipo')}
                error={Boolean(errores.tipo)}
                helperText={errores.tipo}
                disabled={enviando}
              >
                {Object.values(FEEDBACK.TIPOS).map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {FEEDBACK.TIPO_LABELS[tipo]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Mensaje"
                required
                multiline
                minRows={4}
                value={form.mensaje}
                onChange={cambiar('mensaje')}
                error={Boolean(errores.mensaje)}
                helperText={errores.mensaje ?? `${form.mensaje.length}/${FEEDBACK.MENSAJE_MAX}`}
                inputProps={{ maxLength: FEEDBACK.MENSAJE_MAX }}
                disabled={enviando}
              />

              <TextField
                label="Email (opcional)"
                type="email"
                value={form.email}
                onChange={cambiar('email')}
                error={Boolean(errores.email)}
                helperText={
                  errores.email ??
                  'Solo si quieres respuesta. Se usará únicamente para contestarte; ver Política de privacidad.'
                }
                disabled={enviando}
              />

              {/* Honeypot anti-spam: invisible para personas */}
              <Box sx={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <label>
                  Web
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={cambiar('website')}
                  />
                </label>
              </Box>

              {estado === 'error' && <Alert severity="error">{errorEnvio}</Alert>}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={cerrar} disabled={enviando}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={enviando}
                startIcon={enviando ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {enviando ? 'Enviando…' : 'Enviar'}
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>
    </>
  );
}
