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
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);

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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Feedback y Sugerencias
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" paragraph>
              Gracias por tu interés en proporcionar feedback sobre esta aplicación.
            </Typography>

            <Typography variant="body1" paragraph>
              Este es un proyecto personal en desarrollo. El sistema de contacto estará disponible
              próximamente.
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Por el momento, puedes anotar tus sugerencias y reportar errores que encuentres. El
              método de contacto se habilitará en una próxima actualización.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
