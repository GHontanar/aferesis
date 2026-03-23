import {
  Box,
  Typography,
  Slider,
  Alert,
  FormControlLabel,
  Switch,
  TextField,
  Grid,
} from '@mui/material';

export default function CryoStepConcentracion({
  formData,
  onChange,
  volumenMinimo,
  factorConcentracion,
  criopreservante,
  onToggleConcentrar,
  onSliderChange,
}) {
  const volEfectivo = formData.concentrar
    ? parseFloat(formData.volumenConcentrado) || 0
    : parseFloat(formData.volumenInicial) || 0;

  return (
    <Box>
      <Box sx={{ mb: 3, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
        <Typography variant="h6" fontWeight={600} color="primary.dark">
          Concentración del Producto
        </Typography>
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={formData.concentrar}
            onChange={onToggleConcentrar}
            color="primary"
          />
        }
        label="Concentrar el producto antes de criopreservar"
        sx={{ mb: 2, display: 'block' }}
      />

      {formData.concentrar && (
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 3 }}>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="concentracionMaxima"
                label="Concentración máxima permitida (células/mm³)"
                type="number"
                value={formData.concentracionMaxima}
                onChange={onChange}
              />
            </Grid>
          </Grid>

          {volumenMinimo > 0 && parseFloat(formData.volumenInicial) > 0 && (
            <Box sx={{ px: 2 }}>
              <Typography variant="body2" gutterBottom>
                Volumen mínimo: <strong>{volumenMinimo.toFixed(2)} ml</strong> |{' '}
                Volumen actual: <strong>{formData.volumenConcentrado} ml</strong> |{' '}
                Factor de concentración: <strong>{factorConcentracion.toFixed(2)}x</strong>
              </Typography>
              <Slider
                value={parseFloat(formData.volumenConcentrado) || volumenMinimo}
                min={volumenMinimo}
                max={parseFloat(formData.volumenInicial)}
                step={0.1}
                onChange={onSliderChange}
                valueLabelDisplay="auto"
                marks={[
                  { value: volumenMinimo, label: `Min: ${volumenMinimo.toFixed(0)}ml` },
                  { value: parseFloat(formData.volumenInicial), label: `Max: ${formData.volumenInicial}ml` },
                ]}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Resumen criopreservante - siempre visible */}
      {volEfectivo > 0 && (
        <Alert severity="info" icon={false} sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Solución criopreservante
          </Typography>
          <Typography variant="body2">
            Volumen base: <strong>{volEfectivo.toFixed(2)} ml</strong>
            {formData.concentrar && (
              <> (concentrado {factorConcentracion.toFixed(2)}x)</>
            )}
            <br />
            DMSO (20%): <strong>{criopreservante.dmso} ml</strong><br />
            Plasma (80%): <strong>{criopreservante.plasma} ml</strong><br />
            Volumen total final: <strong>{criopreservante.volumenTotal} ml</strong><br />
            Concentración DMSO final: <strong>{criopreservante.concentracionDMSO}%</strong>
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
