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
  ToggleButtonGroup,
  ToggleButton,
  Slider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useCalculator } from '../../context/CalculatorContext';
import { calcularVolemiasCD3, estimarCD3DesdeLinfocitos } from '../../utils/formulas/cd3Calculations';
import { validarCamposCD3, validations } from '../../utils/validation';
import { CD3_ESTIMATION } from '../../utils/constants';
import ResultDisplay from '../common/ResultDisplay';
import PrintReport from '../common/PrintReport';

export default function LinfoaferesisCalculator() {
  const { setResults, getResults } = useCalculator();
  const results = getResults('linfoaferesis');

  const [formData, setFormData] = useState({
    pesoDonante: '',
    alturaDonante: '',
    sexoDonante: 'M',
    pesoReceptor: '',
    objetivoCD3: '',
    concentracionCD3: '',
    eficiencia: '0.4',
    modoObjetivo: 'porKg',
    fuenteCD3: 'directo',
    linfocitosTotales: '',
    porcentajeCD3: CD3_ESTIMATION.DEFAULT_PERCENTAGE
  });

  const [errores, setErrores] = useState([]);
  const [advertenciaCD3, setAdvertenciaCD3] = useState(false);

  const cd3Estimado = formData.fuenteCD3 === 'estimacion' && formData.linfocitosTotales
    ? estimarCD3DesdeLinfocitos(parseFloat(formData.linfocitosTotales), formData.porcentajeCD3)
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'concentracionCD3') {
      const val = parseFloat(value);
      setAdvertenciaCD3(val > 0 && val < validations.cd34.advertencia);
    }
  };

  const handleCalcular = () => {
    const datosParaValidar = {
      ...formData,
      concentracionCD3: formData.fuenteCD3 === 'estimacion' ? cd3Estimado : formData.concentracionCD3
    };
    const erroresValidacion = validarCamposCD3(datosParaValidar);

    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      setResults('linfoaferesis', null);
      return;
    }

    setErrores([]);

    const concentracionFinal = formData.fuenteCD3 === 'estimacion'
      ? cd3Estimado
      : parseFloat(formData.concentracionCD3);

    const resultado = calcularVolemiasCD3({
      pesoDonante: parseFloat(formData.pesoDonante),
      alturaDonante: parseFloat(formData.alturaDonante),
      sexoDonante: formData.sexoDonante,
      pesoReceptor: formData.modoObjetivo === 'totalProducto' ? undefined : parseFloat(formData.pesoReceptor),
      objetivoCD3: parseFloat(formData.objetivoCD3),
      concentracionCD3: concentracionFinal,
      eficiencia: parseFloat(formData.eficiencia),
      modoObjetivo: formData.modoObjetivo,
      fuenteCD3: formData.fuenteCD3,
      linfocitosTotales: formData.fuenteCD3 === 'estimacion' ? parseFloat(formData.linfocitosTotales) : undefined,
      porcentajeCD3: formData.porcentajeCD3
    });

    setResults('linfoaferesis', resultado);
  };

  const handleReset = () => {
    setFormData({
      pesoDonante: '',
      alturaDonante: '',
      sexoDonante: 'M',
      pesoReceptor: '',
      objetivoCD3: '',
      concentracionCD3: '',
      eficiencia: '0.4',
      modoObjetivo: 'porKg',
      fuenteCD3: 'directo',
      linfocitosTotales: '',
      porcentajeCD3: CD3_ESTIMATION.DEFAULT_PERCENTAGE
    });
    setErrores([]);
    setAdvertenciaCD3(false);
    setResults('linfoaferesis', null);
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

        {advertenciaCD3 && formData.fuenteCD3 === 'directo' && (
          <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
            Valor de CD3 bajo (&lt;10/μL). Verifique el dato.
          </Alert>
        )}

        <Box component="form" sx={{ mt: 3 }}>
          {/* Modo de objetivo */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600} color="text.secondary">
              Modo de dosificación
            </Typography>
            <ToggleButtonGroup
              value={formData.modoObjetivo}
              exclusive
              onChange={(e, val) => val && setFormData(prev => ({ ...prev, modoObjetivo: val }))}
              size="small"
              fullWidth
            >
              <ToggleButton value="porKg">
                Por kg de receptor
              </ToggleButton>
              <ToggleButton value="totalProducto">
                Producto total (CAR-T)
              </ToggleButton>
            </ToggleButtonGroup>
            {formData.modoObjetivo === 'totalProducto' && (
              <Alert severity="info" sx={{ mt: 1 }} variant="outlined">
                Modo CAR-T: el objetivo se expresa en millones de CD3 totales del producto.
                Rangos típicos: 50-200 millones CD3 totales.
              </Alert>
            )}
          </Box>

          {/* Datos del Donante */}
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

          {/* Parámetros del Procedimiento */}
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
            {formData.modoObjetivo !== 'totalProducto' && (
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
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                name="objetivoCD3"
                label={formData.modoObjetivo === 'totalProducto'
                  ? 'Objetivo total (millones CD3)'
                  : 'Objetivo (millones CD3/kg receptor)'}
                type="number"
                value={formData.objetivoCD3}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Tooltip title={formData.modoObjetivo === 'totalProducto'
                      ? 'Objetivo total de CD3 en millones (CAR-T: típico 50-200M)'
                      : 'Objetivo en millones de CD3 por kg de receptor'}>
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                }}
              />
            </Grid>

            {/* Fuente de CD3 */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600} color="text.secondary">
                Origen del dato de CD3
              </Typography>
              <ToggleButtonGroup
                value={formData.fuenteCD3}
                exclusive
                onChange={(e, val) => val && setFormData(prev => ({ ...prev, fuenteCD3: val }))}
                size="small"
              >
                <ToggleButton value="directo">
                  CD3 directo (citometría)
                </ToggleButton>
                <ToggleButton value="estimacion">
                  Estimar desde linfocitos (hemograma)
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            {formData.fuenteCD3 === 'directo' ? (
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
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="linfocitosTotales"
                    label="Linfocitos totales (células/μL)"
                    type="number"
                    value={formData.linfocitosTotales}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Linfocitos totales del hemograma en células/μL">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Porcentaje CD3 estimado: <strong>{formData.porcentajeCD3}%</strong>
                    </Typography>
                    <Slider
                      value={formData.porcentajeCD3}
                      min={CD3_ESTIMATION.MIN_PERCENTAGE}
                      max={CD3_ESTIMATION.MAX_PERCENTAGE}
                      step={1}
                      onChange={(e, val) => setFormData(prev => ({ ...prev, porcentajeCD3: val }))}
                      valueLabelDisplay="auto"
                      marks={[
                        { value: CD3_ESTIMATION.MIN_PERCENTAGE, label: `${CD3_ESTIMATION.MIN_PERCENTAGE}%` },
                        { value: CD3_ESTIMATION.DEFAULT_PERCENTAGE, label: `${CD3_ESTIMATION.DEFAULT_PERCENTAGE}%` },
                        { value: CD3_ESTIMATION.MAX_PERCENTAGE, label: `${CD3_ESTIMATION.MAX_PERCENTAGE}%` }
                      ]}
                    />
                  </Box>
                </Grid>
                {cd3Estimado !== null && (
                  <Grid item xs={12}>
                    <Alert severity="info" variant="outlined">
                      CD3 estimados: <strong>{cd3Estimado.toFixed(1)} /μL</strong>
                    </Alert>
                  </Grid>
                )}
                {(formData.porcentajeCD3 < CD3_ESTIMATION.WARNING_LOW || formData.porcentajeCD3 > CD3_ESTIMATION.WARNING_HIGH) && (
                  <Grid item xs={12}>
                    <Alert severity="warning" variant="outlined">
                      El porcentaje de CD3 seleccionado ({formData.porcentajeCD3}%) está fuera del rango habitual (50-85%).
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Alert severity="info">
                    Estimación basada en hemograma. Se recomienda confirmar con citometría de flujo.
                  </Alert>
                </Grid>
              </>
            )}

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
