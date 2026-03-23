import { calcularVolemiaNadler } from './nadler.js';

/**
 * Estima CD3/μL desde linfocitos totales y un porcentaje de CD3
 * @param {number} linfocitosPorUL - Linfocitos totales por μL (hemograma)
 * @param {number} porcentajeCD3 - Porcentaje estimado de CD3 (0-100)
 * @returns {number} CD3 estimados por μL
 */
export function estimarCD3DesdeLinfocitos(linfocitosPorUL, porcentajeCD3 = 70) {
  return linfocitosPorUL * (porcentajeCD3 / 100);
}

/**
 * Calcula el número de volemias a procesar para alcanzar el objetivo de CD3 (Linfoaféresis)
 * @param {Object} params - Parámetros del cálculo
 * @param {number} params.pesoDonante - Peso del donante en kg
 * @param {number} params.alturaDonante - Altura del donante en cm
 * @param {string} params.sexoDonante - Sexo del donante ('M' o 'F')
 * @param {number} [params.pesoReceptor] - Peso del receptor en kg (requerido en modo 'porKg')
 * @param {number} params.objetivoCD3 - Objetivo de recolección (millones CD3/kg o millones totales según modo)
 * @param {number} params.concentracionCD3 - Concentración CD3 pre-aféresis (CD3/μL)
 * @param {number} params.eficiencia - Eficiencia del proceso (CE2), por defecto 0.4
 * @param {string} params.modoObjetivo - 'porKg' (default) o 'totalProducto' (CAR-T)
 * @param {string} [params.fuenteCD3] - 'directo' o 'estimacion'
 * @param {number} [params.linfocitosTotales] - Linfocitos/μL (si fuenteCD3 === 'estimacion')
 * @param {number} [params.porcentajeCD3] - % CD3 estimado (si fuenteCD3 === 'estimacion')
 * @returns {Object} Resultado del cálculo
 */
export function calcularVolemiasCD3(params) {
  const {
    pesoDonante,
    alturaDonante,
    sexoDonante,
    pesoReceptor,
    objetivoCD3,
    concentracionCD3: concentracionCD3Directa,
    eficiencia = 0.4,
    modoObjetivo = 'porKg',
    fuenteCD3 = 'directo',
    linfocitosTotales,
    porcentajeCD3 = 70
  } = params;

  // 1. Calcular volemia del donante
  const volemiaDonante = calcularVolemiaNadler(pesoDonante, alturaDonante, sexoDonante);

  // 2. Determinar concentración CD3 (directa o estimada)
  let concentracionCD3;
  let cd3Estimado = false;
  if (fuenteCD3 === 'estimacion' && linfocitosTotales) {
    concentracionCD3 = estimarCD3DesdeLinfocitos(linfocitosTotales, porcentajeCD3);
    cd3Estimado = true;
  } else {
    concentracionCD3 = concentracionCD3Directa;
  }

  // 3. Calcular CD3 totales requeridas (en millones)
  const cd3Totales = modoObjetivo === 'totalProducto'
    ? objetivoCD3
    : objetivoCD3 * pesoReceptor;

  // 4. Calcular volumen a procesar en litros
  const volumenProcesar = (cd3Totales * 1000000) / (concentracionCD3 * 1000000 * eficiencia);

  // 5. Calcular número de volemias
  const volemias = volumenProcesar / volemiaDonante;

  return {
    volemiaDonante: volemiaDonante.toFixed(2),
    cd3Totales: cd3Totales.toFixed(2),
    volumenProcesar: volumenProcesar.toFixed(2),
    volemias: volemias.toFixed(2),
    advertencia: parseFloat(volemias.toFixed(2)) >= 4,
    modoObjetivo,
    concentracionCD3Usada: concentracionCD3.toFixed(1),
    cd3Estimado,
    ...(cd3Estimado && {
      linfocitosTotales,
      porcentajeCD3
    })
  };
}
