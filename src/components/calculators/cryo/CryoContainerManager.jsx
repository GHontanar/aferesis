import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Chip,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function CryoContainerManager({
  tiposContenedores,
  nuevoContenedor,
  onChangeNuevo,
  onAgregar,
  onEliminar
}) {
  return (
    <>
      <Box sx={{ mb: 3, mt: 4, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
        <Typography variant="h6" fontWeight={600} color="primary.dark">
          Tipos de Contenedores
        </Typography>
      </Box>

      {tiposContenedores.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Agregue al menos un tipo de contenedor
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        {tiposContenedores.map((contenedor) => (
          <Chip
            key={contenedor.id}
            label={`${contenedor.nombre} (${contenedor.volMin}-${contenedor.volMax}ml)`}
            onDelete={() => onEliminar(contenedor.id)}
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            size="small"
            label="Nombre"
            value={nuevoContenedor.nombre}
            onChange={(e) => onChangeNuevo({ ...nuevoContenedor, nombre: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            size="small"
            label="Vol. mínimo (ml)"
            type="number"
            value={nuevoContenedor.volMin}
            onChange={(e) => onChangeNuevo({ ...nuevoContenedor, volMin: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            size="small"
            label="Vol. máximo (ml)"
            type="number"
            value={nuevoContenedor.volMax}
            onChange={(e) => onChangeNuevo({ ...nuevoContenedor, volMax: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={onAgregar} fullWidth>
            Agregar
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
