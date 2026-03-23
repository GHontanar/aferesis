import { CITRATE } from '../constants.js';

/**
 * Calcula el flujo de ACD-A
 * @param {number} flujoEntrada - Flujo de entrada en mL/min
 * @param {number} ratioACD - Ratio ACD-A (ej: 12 para 1:12)
 * @returns {number} Flujo de ACD-A en mL/min
 */
export function calcularFlujoACD(flujoEntrada, ratioACD) {
  return flujoEntrada / ratioACD;
}

/**
 * Calcula la tasa de citrato (mg/kg/min)
 * ACD-A contiene 22.0 g/L de citrato sódico
 * citrate (mg/min) = flujoACD (mL/min) × 22.0 (g/L) / 1000 (mL/L) × 1000 (mg/g) = flujoACD × 22.0
 * tasa (mg/kg/min) = citrate (mg/min) / peso (kg)
 * @param {number} flujoACD - Flujo de ACD-A en mL/min
 * @param {number} peso - Peso del paciente en kg
 * @returns {number} Tasa de citrato en mg/kg/min
 */
export function calcularTasaCitrato(flujoACD, peso) {
  return (flujoACD * CITRATE.ACD_A_CITRATO_CONCENTRACION) / peso;
}

/**
 * Clasifica el riesgo de toxicidad por citrato
 * @param {number} tasaCitrato - Tasa en mg/kg/min
 * @returns {Object} Categoría de riesgo y recomendaciones
 */
export function clasificarRiesgoCitrato(tasaCitrato) {
  if (tasaCitrato < CITRATE.RIESGO_BAJO_MAX) {
    return {
      nivel: 'bajo',
      color: 'success',
      label: 'Riesgo bajo',
      recomendacionCalcio: 'Profilaxis estándar: Gluconato cálcico 10% IV a 10 mL/h o suplemento oral.',
      descripcion: 'Tasa de citrato dentro de rangos seguros.'
    };
  }

  if (tasaCitrato < CITRATE.RIESGO_MODERADO_MAX) {
    return {
      nivel: 'moderado',
      color: 'warning',
      label: 'Riesgo moderado',
      recomendacionCalcio: 'Gluconato cálcico 10% IV continuo a 20-30 mL/h. Monitorizar calcio iónico cada 30 min.',
      descripcion: 'Vigilar síntomas: parestesias, calambres, náuseas.'
    };
  }

  return {
    nivel: 'alto',
    color: 'error',
    label: 'Riesgo alto',
    recomendacionCalcio: 'Gluconato cálcico 10% IV continuo a 30-50 mL/h. Monitorizar calcio iónico cada 15-20 min. Considerar reducir ratio ACD o flujo de entrada.',
    descripcion: 'Alto riesgo de hipocalcemia sintomática. Considerar ajustar parámetros del procedimiento.'
  };
}

/**
 * Calcula el volumen total de ACD-A para el procedimiento
 * @param {number} flujoACD - Flujo de ACD-A en mL/min
 * @param {number} duracion - Duración del procedimiento en minutos
 * @returns {number} Volumen total de ACD-A en mL
 */
export function calcularVolumenTotalACD(flujoACD, duracion) {
  return flujoACD * duracion;
}

/**
 * Calcula todos los parámetros de citrato/anticoagulante
 * @param {Object} params
 * @param {number} params.peso - Peso del paciente en kg
 * @param {number} params.flujoEntrada - Flujo de entrada en mL/min
 * @param {number} params.ratioACD - Ratio ACD-A (ej: 12)
 * @param {number} params.duracion - Duración en minutos
 * @param {boolean} [params.hepatopatia=false] - Factor de riesgo: hepatopatía
 * @param {boolean} [params.pediatrico=false] - Factor de riesgo: paciente pediátrico
 * @returns {Object} Resultados del cálculo
 */
export function calcularCitrato(params) {
  const {
    peso,
    flujoEntrada,
    ratioACD,
    duracion,
    hepatopatia = false,
    pediatrico = false
  } = params;

  const flujoACD = calcularFlujoACD(flujoEntrada, ratioACD);
  const tasaCitrato = calcularTasaCitrato(flujoACD, peso);
  const riesgo = clasificarRiesgoCitrato(tasaCitrato);
  const volumenTotalACD = calcularVolumenTotalACD(flujoACD, duracion);

  const factoresRiesgo = [];
  if (hepatopatia) factoresRiesgo.push('Hepatopatía (metabolismo de citrato reducido)');
  if (pediatrico) factoresRiesgo.push('Paciente pediátrico (mayor susceptibilidad)');

  // Subir nivel de riesgo si hay factores agravantes
  let riesgoAjustado = { ...riesgo };
  if (factoresRiesgo.length > 0 && riesgo.nivel !== 'alto') {
    if (riesgo.nivel === 'bajo') {
      riesgoAjustado = clasificarRiesgoCitrato(CITRATE.RIESGO_BAJO_MAX + 0.01);
    } else if (riesgo.nivel === 'moderado') {
      riesgoAjustado = clasificarRiesgoCitrato(CITRATE.RIESGO_MODERADO_MAX + 0.01);
    }
    riesgoAjustado.ajustadoPorFactores = true;
  }

  return {
    flujoACD: flujoACD.toFixed(1),
    tasaCitrato: tasaCitrato.toFixed(2),
    riesgo: riesgoAjustado,
    volumenTotalACD: Math.round(volumenTotalACD),
    duracion,
    factoresRiesgo,
    ratioACD
  };
}
