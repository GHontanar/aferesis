import { calcularVolemiaNadler } from './nadler.js';

/**
 * Calcula el número de volemias a procesar para alcanzar el objetivo de CD3 (Linfoaféresis)
 * @param {Object} params - Parámetros del cálculo
 * @param {number} params.pesoDonante - Peso del donante en kg
 * @param {number} params.alturaDonante - Altura del donante en cm
 * @param {string} params.sexoDonante - Sexo del donante ('M' o 'F')
 * @param {number} params.pesoReceptor - Peso del receptor en kg
 * @param {number} params.objetivoCD3 - Objetivo de recolección (millones CD3/kg receptor)
 * @param {number} params.concentracionCD3 - Concentración CD3 pre-aféresis (CD3/μL)
 * @param {number} params.eficiencia - Eficiencia del proceso (CE2), por defecto 0.4
 * @returns {Object} Resultado del cálculo
 */
export function calcularVolemiasCD3(params) {
  const {
    pesoDonante,
    alturaDonante,
    sexoDonante,
    pesoReceptor,
    objetivoCD3,
    concentracionCD3,
    eficiencia = 0.4
  } = params;

  // 1. Calcular volemia del donante
  const volemiaDonante = calcularVolemiaNadler(pesoDonante, alturaDonante, sexoDonante);

  // 2. Calcular CD3 totales requeridas (en millones)
  const cd3Totales = objetivoCD3 * pesoReceptor;

  // 3. Calcular volumen a procesar en litros
  // Convertir CD3/μL a CD3/litro: multiplicar por 10^6
  // cd3Totales está en millones, concentracionCD3 en células/μL
  const volumenProcesar = (cd3Totales * 1000000) / (concentracionCD3 * 1000000 * eficiencia);

  // 4. Calcular número de volemias
  const volemias = volumenProcesar / volemiaDonante;

  return {
    volemiaDonante: volemiaDonante.toFixed(2),
    cd3Totales: cd3Totales.toFixed(2),
    volumenProcesar: volumenProcesar.toFixed(2),
    volemias: volemias.toFixed(2),
    advertencia: parseFloat(volemias) >= 4
  };
}
