import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Tooltip,
  Alert,
  IconButton,
  FormControlLabel,
  Checkbox,
  Slider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useCalculator } from '../../context/CalculatorContext';
import { calcularCitrato } from '../../utils/formulas/citrateCalculations';
import { validarCamposCitrato } from '../../utils/validation';
import { CITRATE } from '../../utils/constants';
import ResultDisplay from '../common/ResultDisplay';
import PrintReport from '../common/PrintReport';

export default function CitrateCalculator() {
  const { setResults, getResults } = useCalculator();
  const results = getResults('citrate');

  const [formData, setFormData] = useState({
    peso: '',
    flujoEntrada: '',
    ratioACD: CITRATE.DEFAULT_RATIO.toString(),
    duracion: '120',
    hepatopatia: false,
    pediatrico: false
  });

  const [errores, setErrores] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalcular = () => {
    const erroresValidacion = validarCamposCitrato(formData);
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      setResults('citrate', null);
      return;
    }
    setErrores([]);

    const resultado = calcularCitrato({
      peso: parseFloat(formData.peso),
      flujoEntrada: parseFloat(formData.flujoEntrada),
      ratioACD: parseFloat(formData.ratioACD),
      duracion: parseFloat(formData.duracion),
      hepatopatia: formData.hepatopatia,
      pediatrico: formData.pediatrico
    });

    setResults('citrate', resultado);
  };

  const handleReset = () => {
    setFormData({
      peso: '',
      flujoEntrada: '',
      ratioACD: CITRATE.DEFAULT_RATIO.toString(),
      duracion: '120',
      hepatopatia: false,
      pediatrico: false
    });
    setErrores([]);
    setResults('citrate', null);
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
            Citrato / Anticoagulante
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Calcula la tasa de citrato y estratifica el riesgo de toxicidad durante procedimientos de aféresis
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
            <Grid item xs={12} sm={6}>
              <TextField name="peso" label="Peso (kg)" type="number" value={formData.peso} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Peso del paciente"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 3, mt: 4, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
            <Typography variant="h6" fontWeight={600} color="primary.dark">
              Parámetros del Procedimiento
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField name="flujoEntrada" label="Flujo de entrada (mL/min)" type="number" value={formData.flujoEntrada} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Flujo de sangre de entrada al separador"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Ratio ACD-A: <strong>1:{formData.ratioACD}</strong>
                </Typography>
                <Slider
                  value={parseInt(formData.ratioACD) || CITRATE.DEFAULT_RATIO}
                  min={CITRATE.MIN_RATIO}
                  max={CITRATE.MAX_RATIO}
                  step={1}
                  onChange={(e, val) => setFormData(prev => ({ ...prev, ratioACD: val.toString() }))}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: CITRATE.MIN_RATIO, label: `1:${CITRATE.MIN_RATIO}` },
                    { value: CITRATE.DEFAULT_RATIO, label: `1:${CITRATE.DEFAULT_RATIO}` },
                    { value: CITRATE.MAX_RATIO, label: `1:${CITRATE.MAX_RATIO}` }
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="duracion" label="Duración del procedimiento (min)" type="number" value={formData.duracion} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Duración estimada en minutos"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 3, mt: 4, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
            <Typography variant="h6" fontWeight={600} color="primary.dark">
              Factores de Riesgo
            </Typography>
          </Box>
          <Box>
            <FormControlLabel
              control={<Checkbox checked={formData.hepatopatia} onChange={(e) => setFormData(prev => ({ ...prev, hepatopatia: e.target.checked }))} />}
              label="Hepatopatía (metabolismo de citrato reducido)"
            />
            <FormControlLabel
              control={<Checkbox checked={formData.pediatrico} onChange={(e) => setFormData(prev => ({ ...prev, pediatrico: e.target.checked }))} />}
              label="Paciente pediátrico"
            />
          </Box>

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

      <ResultDisplay result={results} tipo="citrate" />
      {results && <PrintReport data={formData} result={results} tipo="citrate" />}

      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Referencias
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Weinstein R. Prevention of citrate reactions during therapeutic plasma exchange by constant infusion of calcium gluconate with the return fluid. J Clin Apher. 1996;11(4):195-7.
        </Typography>
      </Paper>
    </Box>
  );
}
