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
import { FUENTE_LIMITE_DMSO } from '../../../utils/formulas/cryopreservationCalculations';

export default function CryoStepConcentracion({
  formData,
  onChange,
  volumenMinimo,
  factorConcentracion,
  criopreservante,
  diluir,
  volumenDilucion,
  volEfectivo,
  dosisDMSOEstimada,
  onToggleConcentrar,
  onSliderChange,
}) {
  const volumenInicial = parseFloat(formData.volumenInicial) || 0;
  const concentrar = formData.concentrar && !diluir;

  return (
    <Box>
      <Box sx={{ mb: 3, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
        <Typography variant="h6" fontWeight={600} color="primary.dark">
          Concentración del Producto
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="concentracionMaxima"
            label="Concentración máxima permitida (células/mm³)"
            helperText="Leucocitos en el producto antes de la mezcla crioprotectora"
            type="number"
            value={formData.concentracionMaxima}
            onChange={onChange}
          />
        </Grid>
      </Grid>

      {diluir ? (
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            El producto ({formData.concentracionLeucocitos} leucocitos/mm³) supera la concentración
            máxima. Hay que diluirlo antes de añadir la mezcla crioprotectora.
          </Alert>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="volumenDiluido"
                label="Volumen tras dilución (ml)"
                type="number"
                value={formData.volumenDiluido}
                onChange={onChange}
                inputProps={{ min: volumenMinimo, step: 0.1 }}
                helperText={`Mínimo: ${volumenMinimo.toFixed(2)} ml`}
              />
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Medio de dilución a añadir:{' '}
            <strong>{volumenDilucion.toFixed(2)} ml</strong> |{' '}
            Factor de dilución: <strong>{volumenInicial > 0 ? (volEfectivo / volumenInicial).toFixed(2) : '-'}x</strong>
          </Typography>
        </Box>
      ) : (
        <>
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

          {concentrar && volumenMinimo > 0 && volumenInicial > 0 && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 3 }}>
              <Box sx={{ px: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Volumen mínimo: <strong>{volumenMinimo.toFixed(2)} ml</strong> |{' '}
                  Volumen actual: <strong>{formData.volumenConcentrado} ml</strong> |{' '}
                  Factor de concentración: <strong>{factorConcentracion.toFixed(2)}x</strong>
                </Typography>
                <Slider
                  value={parseFloat(formData.volumenConcentrado) || volumenMinimo}
                  min={volumenMinimo}
                  max={volumenInicial}
                  step={0.1}
                  onChange={onSliderChange}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: volumenMinimo, label: `Min: ${volumenMinimo.toFixed(0)}ml` },
                    { value: volumenInicial, label: `Max: ${formData.volumenInicial}ml` },
                  ]}
                />
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Resumen criopreservante - siempre visible */}
      {volEfectivo > 0 && (
        <Alert severity="info" icon={false} sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Solución criopreservante
          </Typography>
          <Typography variant="body2">
            Volumen base: <strong>{volEfectivo.toFixed(2)} ml</strong>
            {concentrar && (
              <> (concentrado {factorConcentracion.toFixed(2)}x)</>
            )}
            {diluir && (
              <> (producto {volumenInicial} ml + medio de dilución {volumenDilucion.toFixed(2)} ml)</>
            )}
            <br />
            DMSO (20%): <strong>{criopreservante.dmso} ml</strong><br />
            Medio (80%): <strong>{criopreservante.plasma} ml</strong><br />
            Volumen total final: <strong>{criopreservante.volumenTotal} ml</strong><br />
            Concentración DMSO final: <strong>{criopreservante.concentracionDMSO}%</strong>
          </Typography>
        </Alert>
      )}

      {dosisDMSOEstimada && (
        <Alert severity={dosisDMSOEstimada.superaLimite ? 'warning' : 'success'} sx={{ mt: 2 }}>
          DMSO estimado para el receptor: <strong>{dosisDMSOEstimada.dmsoMl} ml</strong>{' '}
          (<strong>{dosisDMSOEstimada.mlPorKg} ml/kg</strong>).{' '}
          {dosisDMSOEstimada.superaLimite
            ? `Supera el límite de ${dosisDMSOEstimada.limiteMlKgDia} ml/kg/día si se infunde todo el mismo día.`
            : `Dentro del límite de ${dosisDMSOEstimada.limiteMlKgDia} ml/kg/día.`}
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            Fuente: {FUENTE_LIMITE_DMSO}
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
