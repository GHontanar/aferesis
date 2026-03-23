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
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useCalculator } from '../../context/CalculatorContext';
import { calcularRCE } from '../../utils/formulas/rceCalculations';
import { validarCamposRCE } from '../../utils/validation';
import { RCE } from '../../utils/constants';
import ResultDisplay from '../common/ResultDisplay';
import PrintReport from '../common/PrintReport';

export default function RCECalculator() {
  const { setResults, getResults } = useCalculator();
  const results = getResults('rce');

  const [formData, setFormData] = useState({
    peso: '',
    altura: '',
    sexo: 'M',
    hctInicial: '',
    hbSInicial: '',
    hbSObjetivo: '30',
    hctCH: RCE.DEFAULT_HCT_CH.toString(),
    volumenPorUnidad: RCE.VOL_UNIDAD_CH.toString()
  });

  const [errores, setErrores] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalcular = () => {
    const erroresValidacion = validarCamposRCE(formData);
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      setResults('rce', null);
      return;
    }
    setErrores([]);

    const resultado = calcularRCE({
      peso: parseFloat(formData.peso),
      altura: parseFloat(formData.altura),
      sexo: formData.sexo,
      hctInicial: parseFloat(formData.hctInicial),
      hbSInicial: parseFloat(formData.hbSInicial),
      hbSObjetivo: parseFloat(formData.hbSObjetivo),
      hctCH: parseFloat(formData.hctCH),
      volumenPorUnidad: parseFloat(formData.volumenPorUnidad)
    });

    setResults('rce', resultado);
  };

  const handleReset = () => {
    setFormData({
      peso: '',
      altura: '',
      sexo: 'M',
      hctInicial: '',
      hbSInicial: '',
      hbSObjetivo: '30',
      hctCH: RCE.DEFAULT_HCT_CH.toString(),
      volumenPorUnidad: RCE.VOL_UNIDAD_CH.toString()
    });
    setErrores([]);
    setResults('rce', null);
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
            Eritrocitaféresis (RCE)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Calcula el volumen de intercambio eritrocitario y unidades de CH necesarias
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
              Datos del Paciente
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField name="peso" label="Peso (kg)" type="number" value={formData.peso} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Peso del paciente"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField name="altura" label="Altura (cm)" type="number" value={formData.altura} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Altura en centímetros"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Sexo</InputLabel>
                <Select name="sexo" value={formData.sexo} onChange={handleChange} label="Sexo">
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mb: 3, mt: 4, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
            <Typography variant="h6" fontWeight={600} color="primary.dark">
              Parámetros Hematológicos
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField name="hctInicial" label="Hematocrito inicial (%)" type="number" value={formData.hctInicial} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Hematocrito del paciente antes del procedimiento"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="hbSInicial" label="HbS inicial (%)" type="number" value={formData.hbSInicial} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Porcentaje de hemoglobina S (drepanocítica) inicial"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="hbSObjetivo" label="HbS objetivo (%)" type="number" value={formData.hbSObjetivo} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Porcentaje de HbS deseado post-procedimiento (típico <30%)"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 3, mt: 4, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
            <Typography variant="h6" fontWeight={600} color="primary.dark">
              Concentrado de Hematíes (Reposición)
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField name="hctCH" label="Hematocrito de los CH (%)" type="number" value={formData.hctCH} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Hematocrito del concentrado de hematíes de reposición (típico 55-65%)"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="volumenPorUnidad" label="Volumen por unidad CH (mL)" type="number" value={formData.volumenPorUnidad} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Volumen medio de cada unidad de CH (típico 250-300 mL)"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
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

      <ResultDisplay result={results} tipo="rce" />
      {results && <PrintReport data={formData} result={results} tipo="rce" />}

      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Referencias
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Schwartz J, et al. Guidelines on the Use of Therapeutic Apheresis in Clinical Practice. J Clin Apher. 2016;31(3):149-338.
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          Davis BA, et al. Guidelines on red cell transfusion in sickle cell disease. Br J Haematol. 2017;176(2):192-209.
        </Typography>
      </Paper>
    </Box>
  );
}
