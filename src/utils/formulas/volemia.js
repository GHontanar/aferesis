import { calcularVolemiaNadler } from './nadler.js';
import { FRANJAS_VOLEMIA_PEDIATRICA, ID_FRANJA_ADULTO } from '../data/volemiaPediatrica.js';

/**
 * Calcula la volemia por peso según una franja pediátrica.
 * Usa el valor medio del rango de mL/kg de la franja.
 * @param {number} peso - Peso en kg
 * @param {string} franjaId - Id de la franja (FRANJAS_VOLEMIA_PEDIATRICA)
 * @returns {Object|null} { volemia (L), mlKg, rangoMlKg, franja } o null si la franja no existe
 */
export function calcularVolemiaPediatrica(peso, franjaId) {
  const franja = FRANJAS_VOLEMIA_PEDIATRICA.find(f => f.id === franjaId);
  if (!franja) return null;

  const mlKg = (franja.mlKgMin + franja.mlKgMax) / 2;
  const rangoMlKg = franja.mlKgMin === franja.mlKgMax
    ? `${franja.mlKgMin}`
    : `${franja.mlKgMin}–${franja.mlKgMax}`;

  return {
    volemia: (peso * mlKg) / 1000,
    mlKg,
    rangoMlKg,
    franja
  };
}

/**
 * Calcula la volemia del paciente o donante:
 * - Franja pediátrica seleccionada → estimación por peso (mL/kg, valor medio del rango)
 * - Adulto o sin franja → fórmula de Nadler
 * @param {Object} params
 * @param {number} params.peso - Peso en kg
 * @param {number} [params.altura] - Altura en cm (necesaria en modo adulto)
 * @param {string} [params.sexo] - 'M' o 'F' (necesario en modo adulto)
 * @param {string} [params.franjaVolemia] - Id de franja pediátrica o 'adulto'
 * @returns {Object} { volemia (L), metodo, mlKg?, rangoMlKg?, franjaLabel? }
 * @throws {Error} Si la franja indicada no existe
 */
export function calcularVolemia(params) {
  const { peso, altura, sexo, franjaVolemia } = params;

  if (franjaVolemia && franjaVolemia !== ID_FRANJA_ADULTO) {
    const ped = calcularVolemiaPediatrica(peso, franjaVolemia);
    if (!ped) {
      throw new Error(`Franja de volemia desconocida: ${franjaVolemia}`);
    }
    return {
      volemia: ped.volemia,
      metodo: 'pediatrico',
      mlKg: ped.mlKg,
      rangoMlKg: ped.rangoMlKg,
      franjaLabel: ped.franja.label
    };
  }

  return {
    volemia: calcularVolemiaNadler(peso, altura, sexo),
    metodo: 'nadler'
  };
}
