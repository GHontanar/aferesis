/**
 * Validaciones para los campos de las calculadoras
 */

export const validations = {
  peso: {
    min: 1,
    max: 200,
    mensaje: 'El peso debe estar entre 1 y 200 kg'
  },
  altura: {
    min: 50,
    max: 250,
    mensaje: 'La altura debe estar entre 50 y 250 cm'
  },
  cd34: {
    min: 0,
    advertencia: 10,
    mensajeAdvertencia: 'Valor de CD34 bajo (<10/μL). Verifique el dato.'
  }
};

/**
 * Valida si un valor numérico está dentro de un rango
 */
export function validarRango(valor, min, max) {
  const num = parseFloat(valor);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
}

/**
 * Valida todos los campos requeridos para el cálculo de CD34
 */
export function validarCamposCD34(datos) {
  const errores = [];

  if (!datos.pesoDonante || !validarRango(datos.pesoDonante, validations.peso.min, validations.peso.max)) {
    errores.push('Peso del donante: ' + validations.peso.mensaje);
  }

  if (!datos.alturaDonante || !validarRango(datos.alturaDonante, validations.altura.min, validations.altura.max)) {
    errores.push('Altura del donante: ' + validations.altura.mensaje);
  }

  if (!datos.sexoDonante) {
    errores.push('Debe seleccionar el sexo del donante');
  }

  if (!datos.pesoReceptor || !validarRango(datos.pesoReceptor, validations.peso.min, validations.peso.max)) {
    errores.push('Peso del receptor: ' + validations.peso.mensaje);
  }

  if (!datos.objetivoCD34 || parseFloat(datos.objetivoCD34) <= 0) {
    errores.push('Objetivo de recolección debe ser mayor a 0');
  }

  if (!datos.concentracionCD34 || parseFloat(datos.concentracionCD34) <= 0) {
    errores.push('Concentración CD34 debe ser mayor a 0');
  }

  if (!datos.eficiencia || parseFloat(datos.eficiencia) <= 0 || parseFloat(datos.eficiencia) > 1) {
    errores.push('Eficiencia debe estar entre 0 y 1');
  }

  return errores;
}
