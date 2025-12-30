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
import { calcularVolemiasCD34 } from '../../utils/formulas/cd34Calculations';
import { validarCamposCD34, validations } from '../../utils/validation';
import ResultDisplay from '../common/ResultDisplay';
import PrintReport from '../common/PrintReport';

export default function CD34Calculator() {
  const { setResults, results } = useCalculator();

  const [formData, setFormData] = useState({
    pesoDonante: '',
    alturaDonante: '',
    sexoDonante: 'M',
    pesoReceptor: '',
    objetivoCD34: '',
    concentracionCD34: '',
    eficiencia: '0.4'
  });

  const [errores, setErrores] = useState([]);
  const [advertenciaCD34, setAdvertenciaCD34] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Verificar advertencia de CD34 bajo
    if (name === 'concentracionCD34') {
      const val = parseFloat(value);
      setAdvertenciaCD34(val > 0 && val < validations.cd34.advertencia);
    }
  };

  const handleCalcular = () => {
    // Validar campos
    const erroresValidacion = validarCamposCD34(formData);

    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      setResults(null);
      return;
    }

    setErrores([]);

    // Realizar cálculo
    const resultado = calcularVolemiasCD34({
      pesoDonante: parseFloat(formData.pesoDonante),
      alturaDonante: parseFloat(formData.alturaDonante),
      sexoDonante: formData.sexoDonante,
      pesoReceptor: parseFloat(formData.pesoReceptor),
      objetivoCD34: parseFloat(formData.objetivoCD34),
      concentracionCD34: parseFloat(formData.concentracionCD34),
      eficiencia: parseFloat(formData.eficiencia)
    });

    setResults(resultado);
  };

  const handleReset = () => {
    setFormData({
      pesoDonante: '',
      alturaDonante: '',
      sexoDonante: 'M',
      pesoReceptor: '',
      objetivoCD34: '',
      concentracionCD34: '',
      eficiencia: '0.4'
    });
    setErrores([]);
    setAdvertenciaCD34(false);
    setResults(null);
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
            Cálculo de Volemias para CD34
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Calcula el número de volemias a procesar basado en la fórmula de Nadler
          </Typography>
        </Box>

        {errores.length > 0 && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {errores.map((error, idx) => (
              <div key={idx}>{error}</div>
            ))}
          </Alert>
        )}

        {advertenciaCD34 && (
          <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
            {validations.cd34.mensajeAdvertencia}
          </Alert>
        )}

        <Box component="form" sx={{ mt: 3 }}>
          <Box
            sx={{
              mb: 3,
              pb: 1,
              borderBottom: 2,
              borderColor: 'primary.main',
              display: 'inline-block'
            }}
          >
            <Typography variant="h6" fontWeight={600} color="primary.dark">
              Datos del Donante
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                name="pesoDonante"
                label="Peso (kg)"
                type="number"
                value={formData.pesoDonante}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Peso del donante entre 1 y 200 kg">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                name="alturaDonante"
                label="Altura (cm)"
                type="number"
                value={formData.alturaDonante}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Altura del donante en centímetros">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Sexo</InputLabel>
                <Select
                  name="sexoDonante"
                  value={formData.sexoDonante}
                  onChange={handleChange}
                  label="Sexo"
                >
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box
            sx={{
              mb: 3,
              mt: 4,
              pb: 1,
              borderBottom: 2,
              borderColor: 'primary.main',
              display: 'inline-block'
            }}
          >
            <Typography variant="h6" fontWeight={600} color="primary.dark">
              Parámetros del Procedimiento
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="pesoReceptor"
                label="Peso del receptor (kg)"
                type="number"
                value={formData.pesoReceptor}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Peso del receptor entre 1 y 200 kg">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="objetivoCD34"
                label="Objetivo (millones CD34/kg receptor)"
                type="number"
                value={formData.objetivoCD34}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Objetivo de recolección en millones de CD34 por kilogramo de receptor">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="concentracionCD34"
                label="Concentración CD34 pre-aféresis (CD34/μL)"
                type="number"
                value={formData.concentracionCD34}
                onChange={handleChange}
                error={advertenciaCD34}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Concentración de CD34 en sangre periférica antes del procedimiento">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="eficiencia"
                label="Eficiencia del proceso (CE2)"
                type="number"
                value={formData.eficiencia}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Eficiencia de la recolección (por defecto 0.4)">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                }}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              pt: 3,
              display: 'flex',
              gap: 2,
              borderTop: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleCalcular}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              Calcular
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              size="large"
              sx={{
                px: 3,
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              Limpiar
            </Button>
          </Box>
        </Box>
      </Paper>

      <ResultDisplay result={results} tipo="cd34" />
      {results && <PrintReport data={formData} result={results} tipo="cd34" />}

      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Referencias
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Nadler SB, Hidalgo JH, Bloch T. Prediction of blood volume in normal human adults. Surgery. 1962 Feb;51(2):224-32.
        </Typography>
      </Paper>
    </Box>
  );
}
