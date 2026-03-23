import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';

export default function CryoStepProducto({ formData, onChange }) {
  return (
    <Box>
      <Box sx={{ mb: 3, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
        <Typography variant="h6" fontWeight={600} color="primary.dark">
          Producto y Paciente
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo de producto</InputLabel>
            <Select name="tipoProducto" value={formData.tipoProducto} onChange={onChange} label="Tipo de producto">
              <MenuItem value="CD34">CD34</MenuItem>
              <MenuItem value="CD3">CD3</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="volumenInicial"
            label="Volumen inicial de aféresis (ml)"
            type="number"
            value={formData.volumenInicial}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="concentracionCelulas"
            label={`Concentración de ${formData.tipoProducto} (células/μL)`}
            type="number"
            value={formData.concentracionCelulas}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="concentracionLeucocitos"
            label="Concentración de leucocitos (células/mm³)"
            type="number"
            value={formData.concentracionLeucocitos}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="pesoReceptor"
            label="Peso del receptor (kg)"
            type="number"
            value={formData.pesoReceptor}
            onChange={onChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
