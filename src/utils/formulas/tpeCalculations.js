import { calcularVolemiaNadler } from './nadler.js';

/**
 * Calcula el volumen plasmático a partir de la volemia y el hematocrito
 * @param {number} volemia - Volemia en litros
 * @param {number} hematocrito - Hematocrito en % (0-100)
 * @returns {number} Volumen plasmático en litros
 */
export function calcularVolumenPlasmatico(volemia, hematocrito) {
  return volemia * (1 - hematocrito / 100);
}

/**
 * Calcula la IgG residual tras N sesiones de TPE
 * Modelo exponencial: IgG_residual = IgG_inicial × e^(-n)
 * donde n = volemias plasmáticas intercambiadas acumuladas
 * @param {number} igGInicial - IgG inicial (g/L o cualquier unidad)
 * @param {number} volemiasIntercambio - Volemias plasmáticas por sesión
 * @param {number} numSesiones - Número de sesiones
 * @returns {Object} IgG residual y porcentaje de eliminación
 */
export function calcularIgGResidual(igGInicial, volemiasIntercambio, numSesiones) {
  const volemiasAcumuladas = volemiasIntercambio * numSesiones;
  const igGResidual = igGInicial * Math.exp(-volemiasAcumuladas);
  const porcentajeEliminacion = ((igGInicial - igGResidual) / igGInicial) * 100;

  return {
    igGResidual,
    porcentajeEliminacion,
    volemiasAcumuladas
  };
}

/**
 * Calcula los volúmenes de reposición para TPE
 * @param {number} volumenIntercambio - Volumen a intercambiar en mL
 * @param {string} tipoReposicion - 'albumina5', 'pfc' o 'combinacion'
 * @param {number} [porcentajeAlbumina=70] - % de albúmina en combinación (si aplica)
 * @returns {Object} Volúmenes de cada líquido de reposición
 */
export function calcularReposicion(volumenIntercambio, tipoReposicion, porcentajeAlbumina = 70) {
  switch (tipoReposicion) {
    case 'albumina5':
      return {
        albumina5: volumenIntercambio,
        pfc: 0,
        total: volumenIntercambio
      };
    case 'pfc':
      return {
        albumina5: 0,
        pfc: volumenIntercambio,
        total: volumenIntercambio
      };
    case 'combinacion': {
      const volAlbumina = volumenIntercambio * (porcentajeAlbumina / 100);
      const volPFC = volumenIntercambio - volAlbumina;
      return {
        albumina5: Math.round(volAlbumina),
        pfc: Math.round(volPFC),
        total: volumenIntercambio
      };
    }
    default:
      return { albumina5: volumenIntercambio, pfc: 0, total: volumenIntercambio };
  }
}

/**
 * Calcula los parámetros completos de un recambio plasmático terapéutico
 * @param {Object} params
 * @param {number} params.peso - Peso del paciente en kg
 * @param {number} params.altura - Altura en cm
 * @param {string} params.sexo - 'M' o 'F'
 * @param {number} params.hematocrito - Hematocrito en %
 * @param {number} params.volemiasIntercambio - Nº de volemias plasmáticas a intercambiar por sesión
 * @param {string} params.tipoReposicion - Tipo de líquido de reposición
 * @param {number} [params.porcentajeAlbumina=70] - % de albúmina en combinación
 * @param {number} params.numSesiones - Nº de sesiones previstas
 * @param {number} [params.igGInicial] - IgG inicial (g/L), opcional
 * @returns {Object} Resultados del cálculo
 */
export function calcularTPE(params) {
  const {
    peso,
    altura,
    sexo,
    hematocrito,
    volemiasIntercambio,
    tipoReposicion,
    porcentajeAlbumina = 70,
    numSesiones,
    igGInicial
  } = params;

  const volemia = calcularVolemiaNadler(peso, altura, sexo);
  const volumenPlasmatico = calcularVolumenPlasmatico(volemia, hematocrito);
  const volumenIntercambio = volumenPlasmatico * volemiasIntercambio * 1000; // en mL
  const reposicion = calcularReposicion(Math.round(volumenIntercambio), tipoReposicion, porcentajeAlbumina);

  const resultado = {
    volemia: volemia.toFixed(2),
    volumenPlasmatico: (volumenPlasmatico * 1000).toFixed(0), // en mL
    volumenIntercambio: Math.round(volumenIntercambio),
    reposicion,
    numSesiones,
    volemiasIntercambio,
    tipoReposicion,
    volumenTotalSerie: Math.round(volumenIntercambio * numSesiones)
  };

  if (igGInicial && igGInicial > 0) {
    const igG = calcularIgGResidual(igGInicial, volemiasIntercambio, numSesiones);
    resultado.igGInicial = igGInicial;
    resultado.igGResidual = igG.igGResidual.toFixed(2);
    resultado.porcentajeEliminacionIgG = igG.porcentajeEliminacion.toFixed(1);
    resultado.volemiasAcumuladas = igG.volemiasAcumuladas.toFixed(1);
  }

  return resultado;
}
