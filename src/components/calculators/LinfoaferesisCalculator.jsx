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
import { calcularVolemiasCD3 } from '../../utils/formulas/cd3Calculations';
import { validations } from '../../utils/validation';
import ResultDisplay from '../common/ResultDisplay';
import PrintReport from '../common/PrintReport';

export default function LinfoaferesisCalculator() {
  const { setResults, results } = useCalculator();

  const [formData, setFormData] = useState({
    pesoDonante: '',
    alturaDonante: '',
    sexoDonante: 'M',
    pesoReceptor: '',
    objetivoCD3: '',
    concentracionCD3: '',
    eficiencia: '0.4'
  });

  const [errores, setErrores] = useState([]);
  const [advertenciaCD3, setAdvertenciaCD3] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Verificar advertencia de CD3 bajo
    if (name === 'concentracionCD3') {
      const val = parseFloat(value);
      setAdvertenciaCD3(val > 0 && val < validations.cd34.advertencia);
    }
  };

  const validarCamposCD3 = (datos) => {
    const errores = [];

    if (!datos.pesoDonante || parseFloat(datos.pesoDonante) < validations.peso.min || parseFloat(datos.pesoDonante) > validations.peso.max) {
      errores.push('Peso del donante: ' + validations.peso.mensaje);
    }

    if (!datos.alturaDonante || parseFloat(datos.alturaDonante) < validations.altura.min || parseFloat(datos.alturaDonante) > validations.altura.max) {
      errores.push('Altura del donante: ' + validations.altura.mensaje);
    }

    if (!datos.sexoDonante) {
      errores.push('Debe seleccionar el sexo del donante');
    }

    if (!datos.pesoReceptor || parseFloat(datos.pesoReceptor) < validations.peso.min || parseFloat(datos.pesoReceptor) > validations.peso.max) {
      errores.push('Peso del receptor: ' + validations.peso.mensaje);
    }

    if (!datos.objetivoCD3 || parseFloat(datos.objetivoCD3) <= 0) {
      errores.push('Objetivo de recolección debe ser mayor a 0');
    }

    if (!datos.concentracionCD3 || parseFloat(datos.concentracionCD3) <= 0) {
      errores.push('Concentración CD3 debe ser mayor a 0');
    }

    if (!datos.eficiencia || parseFloat(datos.eficiencia) <= 0 || parseFloat(datos.eficiencia) > 1) {
      errores.push('Eficiencia debe estar entre 0 y 1');
    }

    return errores;
  };

  const handleCalcular = () => {
    // Validar campos
    const erroresValidacion = validarCamposCD3(formData);

    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      setResults(null);
      return;
    }

    setErrores([]);

    // Realizar cálculo
    const resultado = calcularVolemiasCD3({
      pesoDonante: parseFloat(formData.pesoDonante),
      alturaDonante: parseFloat(formData.alturaDonante),
      sexoDonante: formData.sexoDonante,
      pesoReceptor: parseFloat(formData.pesoReceptor),
      objetivoCD3: parseFloat(formData.objetivoCD3),
      concentracionCD3: parseFloat(formData.concentracionCD3),
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
      objetivoCD3: '',
      concentracionCD3: '',
      eficiencia: '0.4'
    });
    setErrores([]);
    setAdvertenciaCD3(false);
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
            Cálculo de Linfoaféresis (CD3)
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

        {advertenciaCD3 && (
          <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
            Valor de CD3 bajo (&lt;10/μL). Verifique el dato.
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
                name="objetivoCD3"
                label="Objetivo (millones CD3/kg receptor)"
                type="number"
                value={formData.objetivoCD3}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Objetivo de recolección en millones de CD3 por kilogramo de receptor">
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
                name="concentracionCD3"
                label="Concentración CD3 pre-aféresis (CD3/μL)"
                type="number"
                value={formData.concentracionCD3}
                onChange={handleChange}
                error={advertenciaCD3}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Concentración de CD3 en sangre periférica antes del procedimiento">
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

      <ResultDisplay result={results} tipo="linfoaferesis" />
      {results && <PrintReport data={formData} result={results} tipo="linfoaferesis" />}

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
