import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useCalculator } from '../../context/CalculatorContext';
import { calcularDLI, formatearDosis } from '../../utils/formulas/dliCalculations';
import { validarCamposDLI } from '../../utils/validation';
import { DLI } from '../../utils/constants';
import ResultDisplay from '../common/ResultDisplay';
import PrintReport from '../common/PrintReport';

export default function DLICalculator() {
  const { setResults, getResults } = useCalculator();
  const results = getResults('dli');

  const [formData, setFormData] = useState({
    volumenProducto: '',
    concentracionCD3: '',
    pesoReceptor: '',
    dosisInicial: '1000000',
    esquemaSeleccionado: 'estandar',
    numDosis: '5'
  });

  const [errores, setErrores] = useState([]);

  const esquemas = DLI.ESCALAS_PREDEFINIDAS;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalcular = () => {
    const erroresValidacion = validarCamposDLI(formData);
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      setResults('dli', null);
      return;
    }
    setErrores([]);

    const esquema = esquemas.find(e => e.nombre.toLowerCase() === formData.esquemaSeleccionado);
    const esquemaEscalada = esquema ? esquema.dosis : null;

    const resultado = calcularDLI({
      volumenProducto: parseFloat(formData.volumenProducto),
      concentracionCD3: parseFloat(formData.concentracionCD3),
      pesoReceptor: parseFloat(formData.pesoReceptor),
      dosisInicial: parseFloat(formData.dosisInicial),
      esquemaEscalada: esquemaEscalada,
      numDosis: parseInt(formData.numDosis)
    });

    setResults('dli', resultado);
  };

  const handleReset = () => {
    setFormData({
      volumenProducto: '',
      concentracionCD3: '',
      pesoReceptor: '',
      dosisInicial: '1000000',
      esquemaSeleccionado: 'estandar',
      numDosis: '5'
    });
    setErrores([]);
    setResults('dli', null);
  };

  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          p: 4, mb: 3,
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #F9FAFB 100%)',
          border: '1px solid', borderColor: 'grey.200',
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
            DLI - Infusión de Linfocitos del Donante
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Planifica dosis de escalada y volúmenes a descongelar para DLI
          </Typography>
        </Box>

        {errores.length > 0 && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {errores.map((error, idx) => <div key={idx}>{error}</div>)}
          </Alert>
        )}

        <Box component="form" sx={{ mt: 3 }}>
          <Box sx={{ mb: 3, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
            <Typography variant="h6" fontWeight={600} color="primary.dark">
              Producto Criopreservado
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField name="volumenProducto" label="Volumen del producto (mL)" type="number" value={formData.volumenProducto} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Volumen total del producto almacenado en mL"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="concentracionCD3" label="Concentración CD3+ (células/μL)" type="number" value={formData.concentracionCD3} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Concentración de CD3+ en el producto criopreservado"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 3, mt: 4, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
            <Typography variant="h6" fontWeight={600} color="primary.dark">
              Receptor y Dosificación
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField name="pesoReceptor" label="Peso del receptor (kg)" type="number" value={formData.pesoReceptor} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Peso del receptor en kg"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Esquema de escalada</InputLabel>
                <Select name="esquemaSeleccionado" value={formData.esquemaSeleccionado} onChange={handleChange} label="Esquema de escalada">
                  {esquemas.map(e => (
                    <MenuItem key={e.nombre} value={e.nombre.toLowerCase()}>
                      {e.nombre} ({e.dosis.map(d => formatearDosis(d)).join(' → ')})
                    </MenuItem>
                  ))}
                  <MenuItem value="personalizado">Personalizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.esquemaSeleccionado === 'personalizado' && (
              <Grid item xs={12} sm={6}>
                <TextField name="dosisInicial" label="Dosis inicial (CD3+/kg)" type="number" value={formData.dosisInicial} onChange={handleChange}
                  InputProps={{ endAdornment: <Tooltip title="Primera dosis del esquema de escalada en CD3+/kg"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField name="numDosis" label="Número de dosis previstas" type="number" value={formData.numDosis} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Cuántas dosis se planifican en total"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, pt: 3, display: 'flex', gap: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
            <Button variant="contained" color="primary" onClick={handleCalcular} size="large"
              sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600 }}>
              Calcular
            </Button>
            <Button variant="outlined" color="primary" startIcon={<RestartAltIcon />} onClick={handleReset} size="large"
              sx={{ px: 3, py: 1.5, fontSize: '1rem' }}>
              Limpiar
            </Button>
          </Box>
        </Box>
      </Paper>

      <ResultDisplay result={results} tipo="dli" />
      {results && <PrintReport data={formData} result={results} tipo="dli" />}

      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Referencias
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Kolb HJ, et al. Donor leukocyte transfusions for treatment of recurrent chronic myelogenous leukemia in marrow transplant patients. Blood. 1990;76(12):2462-5.
        </Typography>
      </Paper>
    </Box>
  );
}
