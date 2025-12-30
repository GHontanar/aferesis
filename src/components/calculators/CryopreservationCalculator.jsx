import { useState, useEffect } from 'react';
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
  Slider,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCalculator } from '../../context/CalculatorContext';
import { calcularProgramacionCongelacion, calcularVolumenMinimo } from '../../utils/formulas/cryopreservationCalculations';
import ResultDisplay from '../common/ResultDisplay';
import PrintReport from '../common/PrintReport';

const CONTENEDORES_DEFAULT = [
  { id: 1, nombre: 'Criotubo', volMin: 1, volMax: 1 },
  { id: 2, nombre: 'Bolsa pequeña', volMin: 15, volMax: 85 },
  { id: 3, nombre: 'Bolsa grande', volMin: 40, volMax: 160 }
];

export default function CryopreservationCalculator() {
  const { setResults, results } = useCalculator();

  const [formData, setFormData] = useState({
    tipoProducto: 'CD34',
    volumenInicial: '',
    concentracionCelulas: '',
    concentracionLeucocitos: '',
    pesoReceptor: '',
    concentracionMaxima: '250000',
    volumenConcentrado: '',
    usarDosisEspecifica: false,
    dosisPorKg: ''
  });

  const [tiposContenedores, setTiposContenedores] = useState(CONTENEDORES_DEFAULT);
  const [volumenMinimo, setVolumenMinimo] = useState(0);
  const [factorConcentracion, setFactorConcentracion] = useState(1);
  const [dmsoNecesario, setDmsoNecesario] = useState(0);
  const [plasmaNecesario, setPlasmaNecesario] = useState(0);
  const [criotubosMaximos, setCriotubosMaximos] = useState(0);
  const [celulasPorCriotubo, setCelulasPorCriotubo] = useState(0);
  const [errores, setErrores] = useState([]);
  const [nuevoContenedor, setNuevoContenedor] = useState({
    nombre: '',
    volMin: '',
    volMax: ''
  });

  // Calcular volumen mínimo cuando cambian los valores relevantes
  useEffect(() => {
    if (formData.volumenInicial && formData.concentracionLeucocitos && formData.concentracionMaxima) {
      const volMin = calcularVolumenMinimo(
        parseFloat(formData.volumenInicial),
        parseFloat(formData.concentracionLeucocitos),
        parseFloat(formData.concentracionMaxima)
      );
      setVolumenMinimo(volMin);

      // Actualizar volumen concentrado si está vacío o es menor al mínimo
      if (!formData.volumenConcentrado || parseFloat(formData.volumenConcentrado) < volMin) {
        setFormData(prev => ({
          ...prev,
          volumenConcentrado: volMin.toFixed(2)
        }));
      }
    }
  }, [formData.volumenInicial, formData.concentracionLeucocitos, formData.concentracionMaxima]);

  // Calcular factor de concentración y criopreservante en tiempo real
  useEffect(() => {
    if (formData.volumenInicial && formData.volumenConcentrado) {
      const factor = parseFloat(formData.volumenInicial) / parseFloat(formData.volumenConcentrado);
      setFactorConcentracion(factor);

      const dmso = parseFloat(formData.volumenConcentrado) * 0.2;
      const plasma = parseFloat(formData.volumenConcentrado) * 0.8;
      setDmsoNecesario(dmso);
      setPlasmaNecesario(plasma);
    }
  }, [formData.volumenInicial, formData.volumenConcentrado]);

  // Calcular criotubos máximos con dosis específica
  useEffect(() => {
    if (formData.usarDosisEspecifica && formData.dosisPorKg && formData.pesoReceptor &&
        formData.concentracionCelulas && formData.volumenInicial && formData.volumenConcentrado) {

      // Calcular concentración final después de criopreservación
      const volumenTotal = parseFloat(formData.volumenConcentrado) + dmsoNecesario + plasmaNecesario;
      const celulasTotal = parseFloat(formData.concentracionCelulas) * parseFloat(formData.volumenInicial);
      const concentracionFinal = celulasTotal / volumenTotal; // células/μL

      // Células por criotubo = dosis (millones/kg) × peso (kg)
      const celulas = parseFloat(formData.dosisPorKg) * parseFloat(formData.pesoReceptor); // millones
      setCelulasPorCriotubo(celulas);

      // Volumen por criotubo = células_requeridas / concentración_final
      // convertir: millones / (células/μL) = millones / (células/μL) × (1000 μL/ml) × (1/1000000)
      const volumenPorCriotubo = (celulas * 1000000) / (concentracionFinal * 1000); // ml

      // Volumen disponible = volumen total - 4ml controles
      const volumenDisponible = volumenTotal - 4;

      // Número máximo de criotubos
      const maxCriotubos = Math.floor(volumenDisponible / volumenPorCriotubo);
      setCriotubosMaximos(maxCriotubos >= 0 ? maxCriotubos : 0);
    } else {
      setCriotubosMaximos(0);
      setCelulasPorCriotubo(0);
    }
  }, [formData.usarDosisEspecifica, formData.dosisPorKg, formData.pesoReceptor,
      formData.concentracionCelulas, formData.volumenInicial, formData.volumenConcentrado,
      dmsoNecesario, plasmaNecesario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      volumenConcentrado: newValue.toString()
    }));
  };

  const handleAgregarContenedor = () => {
    if (!nuevoContenedor.nombre || !nuevoContenedor.volMin || !nuevoContenedor.volMax) {
      return;
    }

    if (parseFloat(nuevoContenedor.volMin) > parseFloat(nuevoContenedor.volMax)) {
      alert('El volumen mínimo no puede ser mayor que el máximo');
      return;
    }

    const id = Math.max(...tiposContenedores.map(c => c.id), 0) + 1;
    setTiposContenedores([
      ...tiposContenedores,
      {
        id,
        nombre: nuevoContenedor.nombre,
        volMin: parseFloat(nuevoContenedor.volMin),
        volMax: parseFloat(nuevoContenedor.volMax)
      }
    ]);

    setNuevoContenedor({ nombre: '', volMin: '', volMax: '' });
  };

  const handleEliminarContenedor = (id) => {
    setTiposContenedores(tiposContenedores.filter(c => c.id !== id));
  };

  const validarCampos = () => {
    const errores = [];

    if (tiposContenedores.length === 0) {
      errores.push('Agregue al menos un tipo de contenedor');
    }

    if (!formData.volumenInicial || parseFloat(formData.volumenInicial) <= 0) {
      errores.push('Volumen inicial debe ser mayor a 0');
    }

    if (!formData.concentracionCelulas || parseFloat(formData.concentracionCelulas) <= 0) {
      errores.push(`Concentración de ${formData.tipoProducto} debe ser mayor a 0`);
    }

    if (!formData.concentracionLeucocitos || parseFloat(formData.concentracionLeucocitos) <= 0) {
      errores.push('Concentración de leucocitos debe ser mayor a 0');
    }

    if (!formData.pesoReceptor || parseFloat(formData.pesoReceptor) <= 0) {
      errores.push('Peso del receptor debe ser mayor a 0');
    }

    if (!formData.concentracionMaxima || parseFloat(formData.concentracionMaxima) <= 0) {
      errores.push('Concentración máxima debe ser mayor a 0');
    }

    if (!formData.volumenConcentrado || parseFloat(formData.volumenConcentrado) < volumenMinimo) {
      errores.push(`Volumen concentrado debe ser al menos ${volumenMinimo.toFixed(2)} ml`);
    }

    if (formData.usarDosisEspecifica) {
      if (!formData.dosisPorKg || parseFloat(formData.dosisPorKg) <= 0) {
        errores.push('Dosis por kg debe ser mayor a 0');
      }
      if (criotubosMaximos === 0) {
        errores.push('No hay suficiente volumen para crear ni un criotubo con la dosis especificada');
      }
    }

    return errores;
  };

  const handleCalcular = () => {
    const erroresValidacion = validarCampos();

    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      setResults(null);
      return;
    }

    setErrores([]);

    const resultado = calcularProgramacionCongelacion({
      tipoProducto: formData.tipoProducto,
      volumenInicial: parseFloat(formData.volumenInicial),
      concentracionCelulas: parseFloat(formData.concentracionCelulas),
      concentracionLeucocitos: parseFloat(formData.concentracionLeucocitos),
      pesoReceptor: parseFloat(formData.pesoReceptor),
      concentracionMaxima: parseFloat(formData.concentracionMaxima),
      volumenConcentrado: parseFloat(formData.volumenConcentrado),
      usarDosisEspecifica: formData.usarDosisEspecifica,
      dosisPorKg: formData.usarDosisEspecifica ? parseFloat(formData.dosisPorKg) : 0,
      criotubosMaximos: formData.usarDosisEspecifica ? criotubosMaximos : 0,
      tiposContenedores: tiposContenedores
    });

    if (resultado.error) {
      setErrores([resultado.error]);
      setResults(null);
    } else {
      setResults(resultado);
    }
  };

  const handleReset = () => {
    setFormData({
      tipoProducto: 'CD34',
      volumenInicial: '',
      concentracionCelulas: '',
      concentracionLeucocitos: '',
      pesoReceptor: '',
      concentracionMaxima: '250000',
      volumenConcentrado: '',
      usarDosisEspecifica: false,
      dosisPorKg: ''
    });
    setTiposContenedores(CONTENEDORES_DEFAULT);
    setVolumenMinimo(0);
    setFactorConcentracion(1);
    setDmsoNecesario(0);
    setPlasmaNecesario(0);
    setCriotubosMaximos(0);
    setCelulasPorCriotubo(0);
    setErrores([]);
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
            Programación de Congelaciones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Calcula la distribución óptima de productos de aféresis en contenedores para criopreservación
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
          {/* Tipo de producto */}
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
              Tipo de Producto
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de producto</InputLabel>
                <Select
                  name="tipoProducto"
                  value={formData.tipoProducto}
                  onChange={handleChange}
                  label="Tipo de producto"
                >
                  <MenuItem value="CD34">CD34</MenuItem>
                  <MenuItem value="CD3">CD3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Parámetros iniciales */}
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
              Parámetros Iniciales
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="volumenInicial"
                label="Volumen inicial de aféresis (ml)"
                type="number"
                value={formData.volumenInicial}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="concentracionCelulas"
                label={`Concentración de ${formData.tipoProducto} (células/μL)`}
                type="number"
                value={formData.concentracionCelulas}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="concentracionLeucocitos"
                label="Concentración de leucocitos (células/mm³)"
                type="number"
                value={formData.concentracionLeucocitos}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="pesoReceptor"
                label="Peso del receptor (kg)"
                type="number"
                value={formData.pesoReceptor}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="concentracionMaxima"
                label="Concentración máxima permitida (células/mm³)"
                type="number"
                value={formData.concentracionMaxima}
                onChange={handleChange}
              />
            </Grid>

          </Grid>

          {/* Sección de criotubos con dosis específica */}
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.usarDosisEspecifica}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    usarDosisEspecifica: e.target.checked
                  }))}
                  color="primary"
                />
              }
              label="Crear criotubos con dosis específica"
            />

            {formData.usarDosisEspecifica && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="dosisPorKg"
                      label={`${formData.tipoProducto} por kg del receptor por criotubo (×10⁶/kg)`}
                      type="number"
                      value={formData.dosisPorKg}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>

                {formData.dosisPorKg && criotubosMaximos > 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Se pueden crear <strong>{criotubosMaximos} criotubos</strong> con{' '}
                    <strong>{celulasPorCriotubo.toFixed(2)} ×10⁶ células</strong> cada uno
                    (<strong>{formData.dosisPorKg} ×10⁶ células/kg</strong>)
                  </Alert>
                )}

                {formData.dosisPorKg && criotubosMaximos === 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    No hay suficiente volumen para crear ni un criotubo con la dosis especificada
                  </Alert>
                )}
              </Box>
            )}
          </Box>

          {/* Slider de concentración */}
          {volumenMinimo > 0 && formData.volumenInicial && (
            <Box sx={{ mt: 4 }}>
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
                  Volumen de Concentración
                </Typography>
              </Box>
              <Box sx={{ px: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Volumen mínimo: {volumenMinimo.toFixed(2)} ml |
                  Volumen actual: {formData.volumenConcentrado} ml |
                  Factor de concentración: {factorConcentracion.toFixed(2)}x
                </Typography>
                <Slider
                  value={parseFloat(formData.volumenConcentrado) || volumenMinimo}
                  min={volumenMinimo}
                  max={parseFloat(formData.volumenInicial)}
                  step={0.1}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: volumenMinimo, label: `Min: ${volumenMinimo.toFixed(0)}ml` },
                    { value: parseFloat(formData.volumenInicial), label: `Max: ${formData.volumenInicial}ml` }
                  ]}
                />
              </Box>

              {/* Mostrar DMSO y Plasma necesarios */}
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Solución criopreservante:</strong><br/>
                  DMSO necesario (20%): {dmsoNecesario.toFixed(2)} ml<br/>
                  Plasma necesario (80%): {plasmaNecesario.toFixed(2)} ml<br/>
                  Volumen total final: {(parseFloat(formData.volumenConcentrado) + dmsoNecesario + plasmaNecesario).toFixed(2)} ml
                </Typography>
              </Alert>
            </Box>
          )}

          {/* Gestión de contenedores */}
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
                onDelete={() => handleEliminarContenedor(contenedor.id)}
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
                onChange={(e) => setNuevoContenedor({ ...nuevoContenedor, nombre: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                label="Vol. mínimo (ml)"
                type="number"
                value={nuevoContenedor.volMin}
                onChange={(e) => setNuevoContenedor({ ...nuevoContenedor, volMin: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                label="Vol. máximo (ml)"
                type="number"
                value={nuevoContenedor.volMax}
                onChange={(e) => setNuevoContenedor({ ...nuevoContenedor, volMax: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAgregarContenedor}
                fullWidth
              >
                Agregar
              </Button>
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
              Calcular Distribución
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

      <ResultDisplay result={results} tipo="cryopreservation" formData={formData} />
      {results && <PrintReport data={formData} result={results} tipo="cryopreservation" />}

      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Referencias
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Lecchi L, Giovanelli S, Gagliardi B, Pezzali I, Ratti I, Marconi M. An update on methods for cryopreservation and thawing of hemopoietic stem cells. Transfus Apher Sci. 2016 Jun;54(3):324-36. doi: 10.1016/j.transci.2016.05.009. 
        </Typography>
        <p><Typography variant="caption" color="text.secondary">
          Hornberger K, Yu G, McKenna D, Hubel A. Cryopreservation of Hematopoietic Stem Cells: Emerging Assays, Cryoprotectant Agents, and Technology to Improve Outcomes. Transfus Med Hemother. 2019 Jun;46(3):188-196. doi: 10.1159/000496068. 
        </Typography></p>
      </Paper>
    </Box>
  );
}
