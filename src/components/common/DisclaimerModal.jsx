import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CloseIcon from '@mui/icons-material/Close';
import TermsOfUse from '../../pages/legal/TermsOfUse';

export default function DisclaimerModal({ open, onAccept }) {
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
        BackdropProps={{ sx: { bgcolor: 'rgba(0, 0, 0, 0.6)' } }}
      >
        <DialogContent sx={{ pt: 5, pb: 2, px: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: '50%', bgcolor: '#EDE9FE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 3,
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'grey.900' }}>
            Calculadora de Aféresis
          </Typography>

          <Typography variant="body2" sx={{ color: 'grey.600', lineHeight: 1.7, mb: 3 }}>
            Esta herramienta es para <strong>fines informativos y educativos</strong>.
            Los resultados no constituyen consejo médico y su uso debe realizarse
            bajo supervisión de personal sanitario cualificado.
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'grey.600' }}>
                Acepto los{' '}
                <Box
                  component="span"
                  onClick={() => setShowTerms(true)}
                  sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  términos de uso
                </Box>
              </Typography>
            }
            sx={{ mb: 1 }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 4, justifyContent: 'center' }}>
          <Button
            onClick={onAccept}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={!accepted}
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de términos */}
      <Dialog
        open={showTerms}
        onClose={() => setShowTerms(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>Términos de uso</Typography>
          <IconButton onClick={() => setShowTerms(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <TermsOfUse />
        </DialogContent>
      </Dialog>
    </>
  );
}
