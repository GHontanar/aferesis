/**
 * Calcula la volemia (volumen sanguíneo) usando la fórmula de Nadler
 * @param {number} peso - Peso en kg
 * @param {number} altura - Altura en cm
 * @param {string} sexo - 'M' para masculino, 'F' para femenino
 * @returns {number} Volemia en litros
 */
export function calcularVolemiaNadler(peso, altura, sexo) {
  // Convertir altura de cm a metros
  const alturaMetros = altura / 100;

  let volemia;

  if (sexo === 'M') {
    // Fórmula para hombres
    volemia = 0.3669 * Math.pow(alturaMetros, 3) + 0.03219 * peso + 0.6041;
  } else {
    // Fórmula para mujeres
    volemia = 0.3561 * Math.pow(alturaMetros, 3) + 0.03308 * peso + 0.1833;
  }

  return volemia;
}
