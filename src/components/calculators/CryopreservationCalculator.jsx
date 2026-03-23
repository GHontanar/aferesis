import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useCalculator } from '../../context/CalculatorContext';
import {
  CONTENEDORES_DEFAULT,
  CRYO,
  calcularVolumenMinimo,
  calcularFactorConcentracion,
  calcularCriopreservante,
  calcularConcentracionFinal,
  calcularAlicuotasMultiples,
  calcularProgramacionCongelacion,
} from '../../utils/formulas/cryopreservationCalculations';
import { validarRango, validations } from '../../utils/validation';
import ResultDisplay from '../common/ResultDisplay';
import PrintReport from '../common/PrintReport';
import CryoStepProducto from './cryo/CryoStepProducto';
import CryoStepConcentracion from './cryo/CryoStepConcentracion';
import CryoStepDistribucion from './cryo/CryoStepDistribucion';

const STEPS = ['Producto y Paciente', 'Concentración', 'Distribución'];

const INITIAL_FORM_DATA = {
  tipoProducto: 'CD34',
  volumenInicial: '',
  concentracionCelulas: '',
  concentracionLeucocitos: '',
  pesoReceptor: '',
  concentrar: false,
  concentracionMaxima: String(CRYO.CONCENTRACION_MAXIMA_DEFAULT),
  volumenConcentrado: '',
  modoDistribucion: 'automatica',
};

export default function CryopreservationCalculator() {
  const { setResults, getResults } = useCalculator();
  const results = getResults('cryopreservation');

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [tiposContenedores, setTiposContenedores] = useState(CONTENEDORES_DEFAULT);
  const [nuevoContenedor, setNuevoContenedor] = useState({ nombre: '', volMin: '', volMax: '' });
  const [tiposAlicuotas, setTiposAlicuotas] = useState([]);
  const [nuevaAlicuota, setNuevaAlicuota] = useState({ cantidad: '', dosisPorKg: '' });
  const [errores, setErrores] = useState([]);

  // --- Valores derivados ---

  const volumenMinimo = useMemo(() => {
    const vol = parseFloat(formData.volumenInicial);
    const leucos = parseFloat(formData.concentracionLeucocitos);
    const maxConc = parseFloat(formData.concentracionMaxima);
    if (vol > 0 && leucos > 0 && maxConc > 0) {
      return calcularVolumenMinimo(vol, leucos, maxConc);
    }
    return 0;
  }, [formData.volumenInicial, formData.concentracionLeucocitos, formData.concentracionMaxima]);

  const volEfectivo = useMemo(() => {
    if (!formData.concentrar) return parseFloat(formData.volumenInicial) || 0;
    return parseFloat(formData.volumenConcentrado) || 0;
  }, [formData.concentrar, formData.volumenInicial, formData.volumenConcentrado]);

  const factorConcentracion = useMemo(() => {
    const vol = parseFloat(formData.volumenInicial);
    if (vol > 0 && volEfectivo > 0) {
      return calcularFactorConcentracion(vol, volEfectivo);
    }
    return 1;
  }, [formData.volumenInicial, volEfectivo]);

  const criopreservante = useMemo(() => {
    if (volEfectivo > 0) {
      return calcularCriopreservante(volEfectivo);
    }
    return { dmso: 0, plasma: 0, volumenTotal: 0, concentracionDMSO: CRYO.DMSO_FINAL_PCT };
  }, [volEfectivo]);

  const concentracionFinal = useMemo(() => {
    const vol = parseFloat(formData.volumenInicial);
    const conc = parseFloat(formData.concentracionCelulas);
    if (vol > 0 && conc > 0 && criopreservante.volumenTotal > 0) {
      return calcularConcentracionFinal(conc, vol, criopreservante.volumenTotal);
    }
    return 0;
  }, [formData.volumenInicial, formData.concentracionCelulas, criopreservante.volumenTotal]);

  const alicuotasInfo = useMemo(() => {
    const peso = parseFloat(formData.pesoReceptor);
    if (tiposAlicuotas.length > 0 && peso > 0 && concentracionFinal > 0 && criopreservante.volumenTotal > 0) {
      return calcularAlicuotasMultiples(tiposAlicuotas, peso, concentracionFinal, criopreservante.volumenTotal);
    }
    return null;
  }, [tiposAlicuotas, formData.pesoReceptor, concentracionFinal, criopreservante.volumenTotal]);

  // --- Handlers ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleConcentrar = (e) => {
    const concentrar = e.target.checked;
    setFormData(prev => ({
      ...prev,
      concentrar,
      volumenConcentrado: concentrar ? (prev.volumenConcentrado || '') : '',
    }));
  };

  const handleSliderChange = (_event, newValue) => {
    setFormData(prev => ({ ...prev, volumenConcentrado: newValue.toString() }));
  };

  const handleAgregarContenedor = () => {
    if (!nuevoContenedor.nombre || !nuevoContenedor.volMin || !nuevoContenedor.volMax) return;
    if (parseFloat(nuevoContenedor.volMin) > parseFloat(nuevoContenedor.volMax)) {
      return;
    }
    const id = Math.max(...tiposContenedores.map(c => c.id), 0) + 1;
    setTiposContenedores(prev => [
      ...prev,
      {
        id,
        nombre: nuevoContenedor.nombre,
        volMin: parseFloat(nuevoContenedor.volMin),
        volMax: parseFloat(nuevoContenedor.volMax),
        esCriotubo: false,
      },
    ]);
    setNuevoContenedor({ nombre: '', volMin: '', volMax: '' });
  };

  const handleEliminarContenedor = (id) => {
    setTiposContenedores(prev => prev.filter(c => c.id !== id));
  };

  const handleAgregarAlicuota = () => {
    const cantidad = parseInt(nuevaAlicuota.cantidad);
    const dosis = parseFloat(nuevaAlicuota.dosisPorKg);
    if (!cantidad || cantidad <= 0 || !dosis || dosis <= 0) return;
    const id = tiposAlicuotas.length > 0
      ? Math.max(...tiposAlicuotas.map(a => a.id)) + 1
      : 1;
    setTiposAlicuotas(prev => [...prev, { id, cantidad, dosisPorKg: dosis }]);
    setNuevaAlicuota({ cantidad: '', dosisPorKg: '' });
  };

  const handleEliminarAlicuota = (id) => {
    setTiposAlicuotas(prev => prev.filter(a => a.id !== id));
  };

  // --- Validación por paso ---

  const validarPaso1 = () => {
    const errs = [];
    if (!formData.volumenInicial || parseFloat(formData.volumenInicial) <= 0) {
      errs.push('Volumen inicial debe ser mayor a 0');
    }
    if (!formData.concentracionCelulas || parseFloat(formData.concentracionCelulas) <= 0) {
      errs.push(`Concentración de ${formData.tipoProducto} debe ser mayor a 0`);
    }
    if (!formData.concentracionLeucocitos || parseFloat(formData.concentracionLeucocitos) <= 0) {
      errs.push('Concentración de leucocitos debe ser mayor a 0');
    }
    if (!formData.pesoReceptor || !validarRango(formData.pesoReceptor, validations.peso.min, validations.peso.max)) {
      errs.push('Peso del receptor: ' + validations.peso.mensaje);
    }
    return errs;
  };

  const validarPaso2 = () => {
    const errs = [];
    if (formData.concentrar) {
      if (!formData.concentracionMaxima || parseFloat(formData.concentracionMaxima) <= 0) {
        errs.push('Concentración máxima debe ser mayor a 0');
      }
      const volConc = parseFloat(formData.volumenConcentrado);
      if (!volConc || volConc < volumenMinimo) {
        errs.push(`Volumen concentrado debe ser al menos ${volumenMinimo.toFixed(2)} ml`);
      }
    }
    return errs;
  };

  const validarPaso3 = () => {
    const errs = [];
    if (tiposContenedores.length === 0) {
      errs.push('Agregue al menos un tipo de contenedor');
    }
    if (formData.modoDistribucion === 'alicuotas') {
      if (tiposAlicuotas.length === 0) {
        errs.push('Agregue al menos un tipo de alícuota');
      }
      if (alicuotasInfo && !alicuotasInfo.cabe) {
        errs.push('Las alícuotas exceden el volumen disponible');
      }
    }
    return errs;
  };

  // --- Navegación ---

  const handleNext = () => {
    const validadores = [validarPaso1, validarPaso2];
    const errs = validadores[activeStep]();
    if (errs.length > 0) {
      setErrores(errs);
      return;
    }
    setErrores([]);

    // Al pasar del paso 1 al 2, inicializar volumen concentrado si concentrar está activo
    if (activeStep === 0 && formData.concentrar && !formData.volumenConcentrado) {
      setFormData(prev => ({
        ...prev,
        volumenConcentrado: volumenMinimo > 0 ? volumenMinimo.toFixed(2) : prev.volumenInicial,
      }));
    }

    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrores([]);
    setActiveStep(prev => prev - 1);
  };

  const handleStepClick = (step) => {
    // Solo permitir ir a pasos completados o al actual
    if (step < activeStep) {
      setErrores([]);
      setActiveStep(step);
    }
  };

  const handleCalcular = () => {
    const errs = validarPaso3();
    if (errs.length > 0) {
      setErrores(errs);
      setResults('cryopreservation', null);
      return;
    }
    setErrores([]);

    const resultado = calcularProgramacionCongelacion({
      tipoProducto: formData.tipoProducto,
      volumenInicial: parseFloat(formData.volumenInicial),
      concentracionCelulas: parseFloat(formData.concentracionCelulas),
      concentracionLeucocitos: parseFloat(formData.concentracionLeucocitos),
      pesoReceptor: parseFloat(formData.pesoReceptor),
      concentrar: formData.concentrar,
      concentracionMaxima: parseFloat(formData.concentracionMaxima),
      volumenConcentrado: parseFloat(formData.volumenConcentrado),
      modoDistribucion: formData.modoDistribucion,
      tiposAlicuotas: formData.modoDistribucion === 'alicuotas' ? tiposAlicuotas : [],
      tiposContenedores,
    });

    if (resultado.error) {
      setErrores([resultado.error]);
      setResults('cryopreservation', null);
    } else {
      setResults('cryopreservation', resultado);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setTiposContenedores(CONTENEDORES_DEFAULT);
    setNuevoContenedor({ nombre: '', volMin: '', volMax: '' });
    setTiposAlicuotas([]);
    setNuevaAlicuota({ cantidad: '', dosisPorKg: '' });
    setErrores([]);
    setActiveStep(0);
    setResults('cryopreservation', null);
  };

  // --- Render ---

  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          p: 4, mb: 3,
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #F9FAFB 100%)',
          border: '1px solid', borderColor: 'grey.200',
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
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

        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Paso 1: Producto y Paciente */}
          <Step>
            <StepLabel
              onClick={() => handleStepClick(0)}
              sx={{ cursor: activeStep > 0 ? 'pointer' : 'default' }}
            >
              {STEPS[0]}
            </StepLabel>
            <StepContent>
              <CryoStepProducto formData={formData} onChange={handleChange} />
              {errores.length > 0 && activeStep === 0 && (
                <Box sx={{ mt: 2, color: 'error.main' }}>
                  {errores.map((e, i) => <Typography key={i} variant="body2">{e}</Typography>)}
                </Box>
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  endIcon={<NavigateNextIcon />}
                  onClick={handleNext}
                >
                  Siguiente
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Paso 2: Concentración */}
          <Step>
            <StepLabel
              onClick={() => handleStepClick(1)}
              sx={{ cursor: activeStep > 1 ? 'pointer' : 'default' }}
            >
              {STEPS[1]}
            </StepLabel>
            <StepContent>
              <CryoStepConcentracion
                formData={formData}
                onChange={handleChange}
                volumenMinimo={volumenMinimo}
                factorConcentracion={factorConcentracion}
                criopreservante={criopreservante}
                onToggleConcentrar={handleToggleConcentrar}
                onSliderChange={handleSliderChange}
              />
              {errores.length > 0 && activeStep === 1 && (
                <Box sx={{ mt: 2, color: 'error.main' }}>
                  {errores.map((e, i) => <Typography key={i} variant="body2">{e}</Typography>)}
                </Box>
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  startIcon={<NavigateBeforeIcon />}
                  onClick={handleBack}
                >
                  Atrás
                </Button>
                <Button
                  variant="contained"
                  endIcon={<NavigateNextIcon />}
                  onClick={handleNext}
                >
                  Siguiente
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Paso 3: Distribución */}
          <Step>
            <StepLabel
              onClick={() => handleStepClick(2)}
              sx={{ cursor: activeStep > 2 ? 'pointer' : 'default' }}
            >
              {STEPS[2]}
            </StepLabel>
            <StepContent>
              <CryoStepDistribucion
                formData={formData}
                onChange={handleChange}
                tiposContenedores={tiposContenedores}
                nuevoContenedor={nuevoContenedor}
                onChangeNuevo={setNuevoContenedor}
                onAgregarContenedor={handleAgregarContenedor}
                onEliminarContenedor={handleEliminarContenedor}
                tiposAlicuotas={tiposAlicuotas}
                nuevaAlicuota={nuevaAlicuota}
                onChangeNuevaAlicuota={setNuevaAlicuota}
                onAgregarAlicuota={handleAgregarAlicuota}
                onEliminarAlicuota={handleEliminarAlicuota}
                alicuotasInfo={alicuotasInfo}
                onCalcular={handleCalcular}
                errores={errores.length > 0 && activeStep === 2 ? errores : []}
              />
              <Box sx={{ mt: 2 }}>
                <Button
                  startIcon={<NavigateBeforeIcon />}
                  onClick={handleBack}
                >
                  Atrás
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>

        {/* Botón reset global */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
          >
            Reiniciar todo
          </Button>
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
