import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';

export default function DisclaimerModal({ open, onAccept }) {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 24
        }
      }}
      BackdropProps={{
        sx: {
          bgcolor: 'rgba(0, 0, 0, 0.7)'
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: 'warning.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon />
        <Typography variant="h6" component="span" fontWeight="bold">
          AVISO IMPORTANTE
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            Lea atentamente antes de continuar
          </Typography>
        </Alert>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" paragraph>
            Esta herramienta está diseñada exclusivamente con{' '}
            <strong>fines informativos y educativos</strong>. Los resultados{' '}
            <strong>no constituyen consejo médico, diagnóstico o recomendaciones terapéuticas</strong>.
          </Typography>

          <Typography variant="body1" paragraph>
            El uso debe realizarse bajo{' '}
            <strong>supervisión de personal sanitario cualificado</strong>. Las decisiones clínicas{' '}
            deben basarse en el juicio profesional.
          </Typography>

          <Typography variant="body1" paragraph>
            Este es un <strong>proyecto personal sin garantías ni soporte</strong>.
          </Typography>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                He leído y acepto los{' '}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/terms')}
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                >
                  términos de uso
                </Button>
              </Typography>
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Button
          onClick={onAccept}
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={!accepted}
          sx={{ py: 1.5 }}
        >
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
