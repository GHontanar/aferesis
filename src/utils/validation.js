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
  },
  hematocrito: {
    min: 10,
    max: 70,
    mensaje: 'El hematocrito debe estar entre 10% y 70%'
  },
  hbS: {
    min: 0,
    max: 100,
    mensaje: 'El porcentaje de HbS debe estar entre 0% y 100%'
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

/**
 * Valida todos los campos requeridos para el cálculo de CD3 (Linfoaféresis)
 */
export function validarCamposCD3(datos) {
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

  // pesoReceptor solo requerido en modo por kg
  if (datos.modoObjetivo !== 'totalProducto') {
    if (!datos.pesoReceptor || !validarRango(datos.pesoReceptor, validations.peso.min, validations.peso.max)) {
      errores.push('Peso del receptor: ' + validations.peso.mensaje);
    }
  }

  if (!datos.objetivoCD3 || parseFloat(datos.objetivoCD3) <= 0) {
    errores.push('Objetivo de recolección debe ser mayor a 0');
  }

  // Validar concentración CD3 según fuente
  if (datos.fuenteCD3 === 'estimacion') {
    if (!datos.linfocitosTotales || parseFloat(datos.linfocitosTotales) <= 0) {
      errores.push('Linfocitos totales debe ser mayor a 0');
    }
  } else {
    if (!datos.concentracionCD3 || parseFloat(datos.concentracionCD3) <= 0) {
      errores.push('Concentración CD3 debe ser mayor a 0');
    }
  }

  if (!datos.eficiencia || parseFloat(datos.eficiencia) <= 0 || parseFloat(datos.eficiencia) > 1) {
    errores.push('Eficiencia debe estar entre 0 y 1');
  }

  return errores;
}

/**
 * Valida campos para TPE
 */
export function validarCamposTPE(datos) {
  const errores = [];

  if (!datos.peso || !validarRango(datos.peso, validations.peso.min, validations.peso.max)) {
    errores.push('Peso del paciente: ' + validations.peso.mensaje);
  }

  if (!datos.altura || !validarRango(datos.altura, validations.altura.min, validations.altura.max)) {
    errores.push('Altura del paciente: ' + validations.altura.mensaje);
  }

  if (!datos.sexo) {
    errores.push('Debe seleccionar el sexo del paciente');
  }

  if (!datos.hematocrito || !validarRango(datos.hematocrito, validations.hematocrito.min, validations.hematocrito.max)) {
    errores.push('Hematocrito: ' + validations.hematocrito.mensaje);
  }

  if (!datos.volemiasIntercambio || parseFloat(datos.volemiasIntercambio) <= 0) {
    errores.push('Volemias a intercambiar debe ser mayor a 0');
  }

  if (!datos.tipoReposicion) {
    errores.push('Debe seleccionar el tipo de líquido de reposición');
  }

  if (!datos.numSesiones || parseInt(datos.numSesiones) < 1) {
    errores.push('Número de sesiones debe ser al menos 1');
  }

  return errores;
}

/**
 * Valida campos para Eritrocitaféresis
 */
export function validarCamposRCE(datos) {
  const errores = [];

  if (!datos.peso || !validarRango(datos.peso, validations.peso.min, validations.peso.max)) {
    errores.push('Peso del paciente: ' + validations.peso.mensaje);
  }

  if (!datos.altura || !validarRango(datos.altura, validations.altura.min, validations.altura.max)) {
    errores.push('Altura del paciente: ' + validations.altura.mensaje);
  }

  if (!datos.sexo) {
    errores.push('Debe seleccionar el sexo del paciente');
  }

  if (!datos.hctInicial || !validarRango(datos.hctInicial, validations.hematocrito.min, validations.hematocrito.max)) {
    errores.push('Hematocrito inicial: ' + validations.hematocrito.mensaje);
  }

  if (!datos.hbSInicial || !validarRango(datos.hbSInicial, 1, 100)) {
    errores.push('HbS inicial debe estar entre 1% y 100%');
  }

  if (!datos.hbSObjetivo || !validarRango(datos.hbSObjetivo, 0, 100)) {
    errores.push('HbS objetivo debe estar entre 0% y 100%');
  }

  if (datos.hbSObjetivo && datos.hbSInicial && parseFloat(datos.hbSObjetivo) >= parseFloat(datos.hbSInicial)) {
    errores.push('HbS objetivo debe ser menor que HbS inicial');
  }

  if (!datos.hctCH || !validarRango(datos.hctCH, validations.hematocrito.min, validations.hematocrito.max)) {
    errores.push('Hematocrito de los CH: ' + validations.hematocrito.mensaje);
  }

  return errores;
}

/**
 * Valida campos para Citrato
 */
export function validarCamposCitrato(datos) {
  const errores = [];

  if (!datos.peso || !validarRango(datos.peso, validations.peso.min, validations.peso.max)) {
    errores.push('Peso del paciente: ' + validations.peso.mensaje);
  }

  if (!datos.flujoEntrada || parseFloat(datos.flujoEntrada) <= 0) {
    errores.push('Flujo de entrada debe ser mayor a 0');
  }

  if (!datos.ratioACD || parseFloat(datos.ratioACD) < 1) {
    errores.push('Ratio ACD-A debe ser al menos 1');
  }

  return errores;
}

/**
 * Valida campos para DLI
 */
export function validarCamposDLI(datos) {
  const errores = [];

  if (!datos.volumenProducto || parseFloat(datos.volumenProducto) <= 0) {
    errores.push('Volumen del producto debe ser mayor a 0');
  }

  if (!datos.concentracionCD3 || parseFloat(datos.concentracionCD3) <= 0) {
    errores.push('Concentración CD3+ debe ser mayor a 0');
  }

  if (!datos.pesoReceptor || !validarRango(datos.pesoReceptor, validations.peso.min, validations.peso.max)) {
    errores.push('Peso del receptor: ' + validations.peso.mensaje);
  }

  if (!datos.dosisInicial || parseFloat(datos.dosisInicial) <= 0) {
    errores.push('Dosis inicial debe ser mayor a 0');
  }

  if (!datos.numDosis || parseInt(datos.numDosis) < 1) {
    errores.push('Número de dosis debe ser al menos 1');
  }

  return errores;
}
