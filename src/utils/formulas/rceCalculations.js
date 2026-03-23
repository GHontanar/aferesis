import { calcularVolemiaNadler } from './nadler.js';

/**
 * Calcula la fracción de células restantes (FCR)
 * @param {number} hbSObjetivo - HbS% objetivo
 * @param {number} hbSInicial - HbS% inicial
 * @returns {number} FCR (0-1)
 */
export function calcularFCR(hbSObjetivo, hbSInicial) {
  return hbSObjetivo / hbSInicial;
}

/**
 * Calcula el volumen de intercambio para eritrocitaféresis isovolémica
 * V_exchange = BV × Hct × ln(1/FCR)
 * @param {number} volemia - Volemia en litros
 * @param {number} hctInicial - Hematocrito inicial en % (0-100)
 * @param {number} fcr - Fracción de células restantes
 * @returns {number} Volumen de intercambio en mL
 */
export function calcularVolumenIntercambioRCE(volemia, hctInicial, fcr) {
  return volemia * (hctInicial / 100) * Math.log(1 / fcr) * 1000; // en mL
}

/**
 * Calcula las unidades de concentrado de hematíes necesarias
 * @param {number} volumenIntercambio - Volumen de intercambio en mL
 * @param {number} volumenPorUnidad - Volumen por unidad de CH en mL (típico 250-300)
 * @returns {number} Número de unidades (redondeado hacia arriba)
 */
export function calcularUnidadesCH(volumenIntercambio, volumenPorUnidad = 280) {
  return Math.ceil(volumenIntercambio / volumenPorUnidad);
}

/**
 * Estima el hematocrito post-procedimiento
 * En eritrocitaféresis isovolémica, el Hct final depende del Hct de reposición
 * Hct_final ≈ Hct_inicial (isovolémico con CH de reposición)
 * Más preciso: Hct_final = Hct_inicial × (1-FCR) + Hct_CH × FCR... simplificación
 * En la práctica: Hct_post ≈ Hct_inicial (se mantiene por reposición isovolémica)
 * @param {number} hctInicial - Hct inicial %
 * @param {number} hctCH - Hct de los CH de reposición %
 * @returns {number} Hct final estimado %
 */
export function estimarHctFinal(hctInicial, hctCH) {
  // En eritrocitaféresis isovolémica con reposición de CH,
  // el Hct se mantiene aproximadamente estable
  // Ligera variación según diferencia entre Hct paciente y Hct CH
  const diferencia = hctCH - hctInicial;
  // Ajuste mínimo: el Hct tiende hacia el del CH de reposición
  return hctInicial + (diferencia * 0.1);
}

/**
 * Calcula los parámetros completos de una eritrocitaféresis
 * @param {Object} params
 * @param {number} params.peso - Peso en kg
 * @param {number} params.altura - Altura en cm
 * @param {string} params.sexo - 'M' o 'F'
 * @param {number} params.hctInicial - Hematocrito inicial %
 * @param {number} params.hbSInicial - HbS inicial %
 * @param {number} params.hbSObjetivo - HbS objetivo %
 * @param {number} params.hctCH - Hematocrito de los CH de reposición %
 * @param {number} [params.volumenPorUnidad=280] - Volumen por unidad de CH en mL
 * @returns {Object} Resultados del cálculo
 */
export function calcularRCE(params) {
  const {
    peso,
    altura,
    sexo,
    hctInicial,
    hbSInicial,
    hbSObjetivo,
    hctCH,
    volumenPorUnidad = 280
  } = params;

  const volemia = calcularVolemiaNadler(peso, altura, sexo);
  const fcr = calcularFCR(hbSObjetivo, hbSInicial);
  const volumenIntercambio = calcularVolumenIntercambioRCE(volemia, hctInicial, fcr);
  const unidadesCH = calcularUnidadesCH(volumenIntercambio, volumenPorUnidad);
  const hctFinal = estimarHctFinal(hctInicial, hctCH);

  return {
    volemia: volemia.toFixed(2),
    fcr: fcr.toFixed(3),
    volumenIntercambio: Math.round(volumenIntercambio),
    unidadesCH,
    hctFinal: hctFinal.toFixed(1),
    hbSFinal: hbSObjetivo.toFixed(1),
    volumenPorUnidad
  };
}
