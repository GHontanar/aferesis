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
  Slider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useCalculator } from '../../context/CalculatorContext';
import { calcularTPE } from '../../utils/formulas/tpeCalculations';
import { validarCamposTPE } from '../../utils/validation';
import { TPE } from '../../utils/constants';
import ResultDisplay from '../common/ResultDisplay';
import PrintReport from '../common/PrintReport';

export default function TPECalculator() {
  const { setResults, getResults } = useCalculator();
  const results = getResults('tpe');

  const [formData, setFormData] = useState({
    peso: '',
    altura: '',
    sexo: 'M',
    hematocrito: '',
    volemiasIntercambio: TPE.DEFAULT_VOLEMIAS.toString(),
    tipoReposicion: 'albumina5',
    porcentajeAlbumina: '70',
    numSesiones: TPE.DEFAULT_SESIONES.toString(),
    igGInicial: ''
  });

  const [errores, setErrores] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalcular = () => {
    const erroresValidacion = validarCamposTPE(formData);
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      setResults('tpe', null);
      return;
    }
    setErrores([]);

    const resultado = calcularTPE({
      peso: parseFloat(formData.peso),
      altura: parseFloat(formData.altura),
      sexo: formData.sexo,
      hematocrito: parseFloat(formData.hematocrito),
      volemiasIntercambio: parseFloat(formData.volemiasIntercambio),
      tipoReposicion: formData.tipoReposicion,
      porcentajeAlbumina: parseFloat(formData.porcentajeAlbumina),
      numSesiones: parseInt(formData.numSesiones),
      igGInicial: formData.igGInicial ? parseFloat(formData.igGInicial) : undefined
    });

    setResults('tpe', resultado);
  };

  const handleReset = () => {
    setFormData({
      peso: '',
      altura: '',
      sexo: 'M',
      hematocrito: '',
      volemiasIntercambio: TPE.DEFAULT_VOLEMIAS.toString(),
      tipoReposicion: 'albumina5',
      porcentajeAlbumina: '70',
      numSesiones: TPE.DEFAULT_SESIONES.toString(),
      igGInicial: ''
    });
    setErrores([]);
    setResults('tpe', null);
  };

  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          p: 4,
          mb: 3,
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #F9FAFB 100%)',
          border: '1px solid',
          borderColor: 'grey.200',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
            Recambio Plasmático Terapéutico (TPE)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Calcula volúmenes de intercambio y reposición para plasmaféresis terapéutica
          </Typography>
        </Box>

        {errores.length > 0 && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {errores.map((error, idx) => (
              <div key={idx}>{error}</div>
            ))}
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
                InputProps={{ endAdornment: <Tooltip title="Peso del paciente en kg"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
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
            <Grid item xs={12} sm={4}>
              <TextField name="hematocrito" label="Hematocrito (%)" type="number" value={formData.hematocrito} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Hematocrito del paciente (10-70%)"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
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
              <Box>
                <Typography variant="body2" gutterBottom>
                  Volemias plasmáticas a intercambiar: <strong>{formData.volemiasIntercambio}</strong>
                </Typography>
                <Slider
                  value={parseFloat(formData.volemiasIntercambio) || TPE.DEFAULT_VOLEMIAS}
                  min={TPE.MIN_VOLEMIAS}
                  max={TPE.MAX_VOLEMIAS}
                  step={0.1}
                  onChange={(e, val) => setFormData(prev => ({ ...prev, volemiasIntercambio: val.toString() }))}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: TPE.MIN_VOLEMIAS, label: `${TPE.MIN_VOLEMIAS}` },
                    { value: 1.0, label: '1.0' },
                    { value: 1.5, label: '1.5' },
                    { value: TPE.MAX_VOLEMIAS, label: `${TPE.MAX_VOLEMIAS}` }
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Líquido de reposición</InputLabel>
                <Select name="tipoReposicion" value={formData.tipoReposicion} onChange={handleChange} label="Líquido de reposición">
                  <MenuItem value="albumina5">Albúmina 5%</MenuItem>
                  <MenuItem value="pfc">Plasma Fresco Congelado (PFC)</MenuItem>
                  <MenuItem value="combinacion">Combinación (Albúmina + PFC)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.tipoReposicion === 'combinacion' && (
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Porcentaje de Albúmina 5%: <strong>{formData.porcentajeAlbumina}%</strong>
                  </Typography>
                  <Slider
                    value={parseInt(formData.porcentajeAlbumina)}
                    min={10}
                    max={90}
                    step={5}
                    onChange={(e, val) => setFormData(prev => ({ ...prev, porcentajeAlbumina: val.toString() }))}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField name="numSesiones" label="Número de sesiones previstas" type="number" value={formData.numSesiones} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="Número total de sesiones de la serie (1-20)"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="igGInicial" label="IgG inicial (g/L) — opcional" type="number" value={formData.igGInicial} onChange={handleChange}
                InputProps={{ endAdornment: <Tooltip title="IgG basal para estimar la eliminación tras las sesiones"><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip> }}
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

      <ResultDisplay result={results} tipo="tpe" />
      {results && <PrintReport data={formData} result={results} tipo="tpe" />}

      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Referencias
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Schwartz J, et al. Guidelines on the Use of Therapeutic Apheresis in Clinical Practice. J Clin Apher. 2016;31(3):149-338.
        </Typography>
      </Paper>
    </Box>
  );
}
