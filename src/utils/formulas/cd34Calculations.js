import { calcularVolemia } from './volemia.js';

/**
 * Calcula el número de volemias a procesar para alcanzar el objetivo de CD34
 * @param {Object} params - Parámetros del cálculo
 * @param {number} params.pesoDonante - Peso del donante en kg
 * @param {number} params.alturaDonante - Altura del donante en cm
 * @param {string} params.sexoDonante - Sexo del donante ('M' o 'F')
 * @param {string} [params.franjaVolemia] - Grupo de edad del donante para estimar volemia por peso (opcional; 'adulto' o id de FRANJAS_VOLEMIA_PEDIATRICA)
 * @param {number} params.pesoReceptor - Peso del receptor en kg
 * @param {number} params.objetivoCD34 - Objetivo de recolección (millones CD34/kg receptor)
 * @param {number} params.concentracionCD34 - Concentración CD34 pre-aféresis (CD34/μL)
 * @param {number} params.eficiencia - Eficiencia del proceso (CE2), por defecto 0.4
 * @returns {Object} Resultado del cálculo
 */
export function calcularVolemiasCD34(params) {
  const {
    pesoDonante,
    alturaDonante,
    sexoDonante,
    franjaVolemia,
    pesoReceptor,
    objetivoCD34,
    concentracionCD34,
    eficiencia = 0.4
  } = params;

  // 1. Calcular volemia del donante
  const infoVolemia = calcularVolemia({ peso: pesoDonante, altura: alturaDonante, sexo: sexoDonante, franjaVolemia });
  const volemiaDonante = infoVolemia.volemia;

  // 2. Calcular CD34 totales requeridas (en millones)
  const cd34Totales = objetivoCD34 * pesoReceptor;

  // 3. Calcular volumen a procesar en litros
  // Convertir CD34/μL a CD34/litro: multiplicar por 10^6
  // cd34Totales está en millones, concentracionCD34 en células/μL
  const volumenProcesar = (cd34Totales * 1000000) / (concentracionCD34 * 1000000 * eficiencia);

  // 4. Calcular número de volemias
  const volemias = volumenProcesar / volemiaDonante;

  return {
    volemiaDonante: volemiaDonante.toFixed(2),
    metodoVolemia: infoVolemia.metodo,
    ...(infoVolemia.metodo === 'pediatrico' && {
      franjaVolemia: infoVolemia.franjaLabel,
      volemiaMlKg: infoVolemia.mlKg,
      volemiaRangoMlKg: infoVolemia.rangoMlKg
    }),
    cd34Totales: cd34Totales.toFixed(2),
    volumenProcesar: volumenProcesar.toFixed(2),
    volemias: volemias.toFixed(2),
    advertencia: parseFloat(volemias) >= 4
  };
}
