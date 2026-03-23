import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Grid,
  Alert,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import CryoContainerManager from './CryoContainerManager';
import { CRYO } from '../../../utils/formulas/cryopreservationCalculations';

export default function CryoStepDistribucion({
  formData,
  onChange,
  tiposContenedores,
  nuevoContenedor,
  onChangeNuevo,
  onAgregarContenedor,
  onEliminarContenedor,
  tiposAlicuotas,
  nuevaAlicuota,
  onChangeNuevaAlicuota,
  onAgregarAlicuota,
  onEliminarAlicuota,
  alicuotasInfo,
  onCalcular,
  errores,
}) {
  return (
    <Box>
      <Box sx={{ mb: 3, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
        <Typography variant="h6" fontWeight={600} color="primary.dark">
          Distribución en Contenedores
        </Typography>
      </Box>

      {/* Gestión de contenedores */}
      <CryoContainerManager
        tiposContenedores={tiposContenedores}
        nuevoContenedor={nuevoContenedor}
        onChangeNuevo={onChangeNuevo}
        onAgregar={onAgregarContenedor}
        onEliminar={onEliminarContenedor}
      />

      {/* Selector de modo */}
      <Box sx={{ mt: 4, mb: 3, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
        <Typography variant="h6" fontWeight={600} color="primary.dark">
          Modo de Distribución
        </Typography>
      </Box>

      <ToggleButtonGroup
        value={formData.modoDistribucion}
        exclusive
        onChange={(e, value) => {
          if (value !== null) {
            onChange({ target: { name: 'modoDistribucion', value } });
          }
        }}
        sx={{ mb: 3, display: 'flex' }}
      >
        <ToggleButton value="automatica" sx={{ flex: 1, textTransform: 'none' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" fontWeight={600}>Automática</Typography>
            <Typography variant="caption" color="text.secondary">
              Mínimo número de contenedores
            </Typography>
          </Box>
        </ToggleButton>
        <ToggleButton value="alicuotas" sx={{ flex: 1, textTransform: 'none' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" fontWeight={600}>Alícuotas por dosis/kg</Typography>
            <Typography variant="caption" color="text.secondary">
              Criotubos con dosis específicas
            </Typography>
          </Box>
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Gestión de alícuotas múltiples */}
      {formData.modoDistribucion === 'alicuotas' && (
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Tipos de alícuotas
          </Typography>

          {tiposAlicuotas.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Agregue los tipos de criotubos que necesita con sus dosis por kg
            </Alert>
          )}

          {/* Chips de alícuotas existentes */}
          {tiposAlicuotas.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {tiposAlicuotas.map((alicuota) => (
                <Chip
                  key={alicuota.id}
                  label={`${alicuota.cantidad}× ${alicuota.dosisPorKg} ×10⁶/kg`}
                  onDelete={() => onEliminarAlicuota(alicuota.id)}
                  sx={{ m: 0.5 }}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          {/* Formulario para agregar */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                size="small"
                label="Cantidad de criotubos"
                type="number"
                value={nuevaAlicuota.cantidad}
                onChange={(e) => onChangeNuevaAlicuota({ ...nuevaAlicuota, cantidad: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                size="small"
                label={`Dosis ${formData.tipoProducto} (×10⁶/kg)`}
                type="number"
                value={nuevaAlicuota.dosisPorKg}
                onChange={(e) => onChangeNuevaAlicuota({ ...nuevaAlicuota, dosisPorKg: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={onAgregarAlicuota} fullWidth>
                Agregar
              </Button>
            </Grid>
          </Grid>

          {/* Resumen en tiempo real */}
          {alicuotasInfo && alicuotasInfo.tiers.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Criotubos</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Dosis/kg</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Células/criotubo</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>ml/criotubo</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Volumen total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alicuotasInfo.tiers.map((tier, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{tier.cantidad}</TableCell>
                        <TableCell align="center">{tier.dosisPorKg} ×10⁶/kg</TableCell>
                        <TableCell align="center">{tier.celulasPorCriotubo.toFixed(2)} ×10⁶</TableCell>
                        <TableCell align="center">{tier.volumenPorCriotubo.toFixed(2)} ml</TableCell>
                        <TableCell align="center">{tier.volumenTier.toFixed(2)} ml</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {alicuotasInfo.cabe ? (
                <Alert severity="success" sx={{ mt: 1 }}>
                  Volumen total alícuotas: <strong>{alicuotasInfo.volumenTotalAlicuotas.toFixed(2)} ml</strong> de{' '}
                  {alicuotasInfo.volumenDisponible.toFixed(2)} ml disponibles
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Las alícuotas necesitan <strong>{alicuotasInfo.volumenTotalAlicuotas.toFixed(2)} ml</strong> pero solo hay{' '}
                  {alicuotasInfo.volumenDisponible.toFixed(2)} ml disponibles. Reduzca cantidades o dosis.
                </Alert>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* Info de controles reservados */}
      <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Se reservan automáticamente: <strong>{CRYO.CONTROLES_CANTIDAD} criotubos de control</strong> ({CRYO.CONTROLES_VOL_UNITARIO} ml c/u)
          + <strong>{CRYO.HEMOCULTIVOS_VOL} ml para hemocultivos</strong> = {CRYO.VOLUMEN_RESERVADO} ml totales
        </Typography>
      </Alert>

      {/* Errores */}
      {errores.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errores.map((error, idx) => <div key={idx}>{error}</div>)}
        </Alert>
      )}

      {/* Botón calcular */}
      <Button
        variant="contained"
        color="primary"
        onClick={onCalcular}
        size="large"
        startIcon={<CalculateIcon />}
        sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
      >
        Calcular Distribución
      </Button>
    </Box>
  );
}
