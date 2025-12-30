/**
 * Cálculos para programación de congelación de productos de aféresis
 */

/**
 * Calcula el volumen mínimo de concentración
 */
export function calcularVolumenMinimo(volumenInicial, concentracionLeucocitos, concentracionMaxima) {
  return volumenInicial * (concentracionLeucocitos / concentracionMaxima);
}

/**
 * Calcula el factor de concentración aplicado
 */
export function calcularFactorConcentracion(volumenInicial, volumenConcentrado) {
  return volumenInicial / volumenConcentrado;
}

/**
 * Calcula volúmenes de criopreservante (DMSO y Plasma)
 */
export function calcularCriopreservante(volumenConcentrado) {
  const dmso = volumenConcentrado * 0.2; // 20% DMSO
  const plasma = volumenConcentrado * 0.8; // 80% Plasma
  const volumenTotal = volumenConcentrado + dmso + plasma;

  return {
    dmso: dmso.toFixed(2),
    plasma: plasma.toFixed(2),
    volumenTotal: volumenTotal.toFixed(2),
    concentracionDMSO: 10 // 10% final
  };
}

/**
 * Calcula el volumen disponible para distribución
 */
export function calcularVolumenDistribuible(volumenTotal) {
  const volumenControles = 4; // 2 criotubos de 1ml + 2ml hemocultivos
  return volumenTotal - volumenControles;
}

/**
 * Calcula la concentración final después de la criopreservación
 */
export function calcularConcentracionFinal(
  concentracionInicial,
  volumenInicial,
  volumenConcentrado,
  volumenFinal
) {
  // Células totales se mantienen
  const celulasTotal = concentracionInicial * volumenInicial;
  // Nueva concentración en el volumen final
  return celulasTotal / volumenFinal;
}

/**
 * Algoritmo de distribución en contenedores
 * @param {number} volumenDisponible - Volumen a distribuir (ml)
 * @param {Object} opciones - Opciones de distribución
 * @param {boolean} opciones.usarDosisEspecifica - Si se usa dosis específica
 * @param {number} opciones.criotubosMaximos - Número de criotubos con dosis específica
 * @param {number} opciones.volumenPorCriotubo - Volumen por criotubo con dosis específica
 * @param {Array} tiposContenedores - Array de tipos de contenedores {nombre, volMin, volMax}
 * @returns {Object} Distribución optimizada
 */
export function distribuirEnContenedores(volumenDisponible, opciones, tiposContenedores) {
  const distribucion = [];
  let volumenRestante = volumenDisponible;

  // Ordenar tipos de contenedores por volumen máximo (de mayor a menor)
  const contenedoresOrdenados = [...tiposContenedores].sort((a, b) => b.volMax - a.volMax);

  // 1. Si se usa dosis específica, crear criotubos primero
  if (opciones.usarDosisEspecifica && opciones.criotubosMaximos > 0) {
    const criotubo = contenedoresOrdenados.find(c => c.nombre.toLowerCase().includes('criotubo'));
    if (criotubo && opciones.volumenPorCriotubo) {
      const volumenCriotubos = opciones.criotubosMaximos * opciones.volumenPorCriotubo;

      distribucion.push({
        tipo: criotubo.nombre + ' (dosis específica)',
        cantidad: opciones.criotubosMaximos,
        volumenUnitario: parseFloat(opciones.volumenPorCriotubo.toFixed(2)),
        volumenTotal: parseFloat(volumenCriotubos.toFixed(2))
      });

      volumenRestante -= volumenCriotubos;
    }
  }

  // 2. Distribuir el resto optimizando volúmenes uniformes
  for (const contenedor of contenedoresOrdenados) {
    // Saltar criotubos si se usó dosis específica (ya fueron procesados)
    if (opciones.usarDosisEspecifica && contenedor.nombre.toLowerCase().includes('criotubo')) {
      continue;
    }

    if (volumenRestante < contenedor.volMin) {
      continue; // No hay suficiente volumen para este tipo
    }

    // Calcular cuántos contenedores de este tipo podemos llenar
    const cantidadMaxima = Math.floor(volumenRestante / contenedor.volMin);

    if (cantidadMaxima === 0) continue;

    // Calcular volumen óptimo por contenedor (uniforme)
    let volumenOptimo = volumenRestante / cantidadMaxima;

    // Ajustar si excede el máximo
    if (volumenOptimo > contenedor.volMax) {
      volumenOptimo = contenedor.volMax;
    }

    const cantidad = Math.floor(volumenRestante / volumenOptimo);
    const volumenUsado = cantidad * volumenOptimo;

    if (cantidad > 0) {
      distribucion.push({
        tipo: contenedor.nombre,
        cantidad: cantidad,
        volumenUnitario: parseFloat(volumenOptimo.toFixed(2)),
        volumenTotal: parseFloat(volumenUsado.toFixed(2))
      });

      volumenRestante -= volumenUsado;
    }

    // Si el volumen restante es muy pequeño, terminamos
    if (volumenRestante < 1) break;
  }

  // 3. Si queda volumen, intentar agregarlo a criotubos
  if (volumenRestante >= 1) {
    const criotubo = contenedoresOrdenados.find(c => c.nombre.toLowerCase().includes('criotubo'));
    if (criotubo) {
      const criotubosExtra = Math.floor(volumenRestante / criotubo.volMax);
      if (criotubosExtra > 0) {
        const existente = distribucion.find(d => d.tipo === criotubo.nombre);
        if (existente) {
          existente.cantidad += criotubosExtra;
          existente.volumenTotal += criotubosExtra * criotubo.volMax;
        } else {
          distribucion.push({
            tipo: criotubo.nombre,
            cantidad: criotubosExtra,
            volumenUnitario: criotubo.volMax,
            volumenTotal: criotubosExtra * criotubo.volMax
          });
        }
        volumenRestante -= criotubosExtra * criotubo.volMax;
      }
    }
  }

  return {
    distribucion,
    volumenDistribuido: parseFloat((volumenDisponible - volumenRestante).toFixed(2)),
    volumenRestante: parseFloat(volumenRestante.toFixed(2))
  };
}

/**
 * Calcula células totales y por kg para cada contenedor
 */
export function calcularCelulasPorContenedor(
  distribucion,
  concentracionFinal,
  pesoReceptor,
  tipoCelula
) {
  return distribucion.map(contenedor => {
    // Concentración final está en células/μL, volumen en ml
    // Convertir: células/μL * 1000 = células/ml
    const concentracionPorMl = concentracionFinal * 1000;
    const celulasTotal = (concentracionPorMl * contenedor.volumenUnitario) / 1000000; // en millones
    const celulasPorKg = celulasTotal / pesoReceptor;

    return {
      ...contenedor,
      concentracionFinal: concentracionFinal.toFixed(2),
      celulasTotal: celulasTotal.toFixed(2),
      celulasPorKg: celulasPorKg.toFixed(2),
      tipoCelula
    };
  });
}

/**
 * Función principal que coordina todos los cálculos
 */
export function calcularProgramacionCongelacion(params) {
  const {
    tipoProducto,
    volumenInicial,
    concentracionCelulas,
    concentracionLeucocitos,
    pesoReceptor,
    concentracionMaxima,
    volumenConcentrado,
    usarDosisEspecifica,
    dosisPorKg,
    criotubosMaximos,
    tiposContenedores
  } = params;

  // 1. Calcular volumen mínimo
  const volumenMinimo = calcularVolumenMinimo(
    volumenInicial,
    concentracionLeucocitos,
    concentracionMaxima
  );

  // 2. Calcular factor de concentración
  const factorConcentracion = calcularFactorConcentracion(volumenInicial, volumenConcentrado);

  // 3. Calcular criopreservante
  const criopreservante = calcularCriopreservante(volumenConcentrado);

  // 4. Calcular volumen distribuible
  const volumenDistribuible = calcularVolumenDistribuible(parseFloat(criopreservante.volumenTotal));

  // 5. Calcular concentración final
  const concentracionFinal = calcularConcentracionFinal(
    concentracionCelulas,
    volumenInicial,
    volumenConcentrado,
    parseFloat(criopreservante.volumenTotal)
  );

  // 6. Calcular volumen por criotubo si se usa dosis específica
  let volumenPorCriotubo = 0;
  if (usarDosisEspecifica && dosisPorKg) {
    const celulasPorCriotubo = dosisPorKg * pesoReceptor; // millones
    volumenPorCriotubo = (celulasPorCriotubo * 1000000) / (concentracionFinal * 1000); // ml
  }

  // 7. Distribuir en contenedores
  const resultadoDistribucion = distribuirEnContenedores(
    volumenDistribuible,
    {
      usarDosisEspecifica: usarDosisEspecifica || false,
      criotubosMaximos: criotubosMaximos || 0,
      volumenPorCriotubo: volumenPorCriotubo
    },
    tiposContenedores
  );

  if (resultadoDistribucion.error) {
    return { error: resultadoDistribucion.error };
  }

  // 8. Calcular células por contenedor
  const distribucionFinal = calcularCelulasPorContenedor(
    resultadoDistribucion.distribucion,
    concentracionFinal,
    pesoReceptor,
    tipoProducto
  );

  // Agregar controles
  const controles = {
    tipo: 'Controles',
    cantidad: 2,
    volumenUnitario: 1,
    volumenTotal: 2,
    concentracionFinal: concentracionFinal.toFixed(2),
    celulasTotal: ((concentracionFinal * 1000 * 1) / 1000000).toFixed(2),
    celulasPorKg: ((concentracionFinal * 1000 * 1) / 1000000 / pesoReceptor).toFixed(2),
    tipoCelula: tipoProducto
  };

  const hemocultivos = {
    tipo: 'Hemocultivos',
    cantidad: 1,
    volumenUnitario: 2,
    volumenTotal: 2,
    concentracionFinal: '-',
    celulasTotal: '-',
    celulasPorKg: '-',
    tipoCelula: tipoProducto
  };

  return {
    volumenMinimo: volumenMinimo.toFixed(2),
    factorConcentracion: factorConcentracion.toFixed(2),
    dmso: criopreservante.dmso,
    plasma: criopreservante.plasma,
    volumenTotal: criopreservante.volumenTotal,
    concentracionDMSO: criopreservante.concentracionDMSO,
    volumenDistribuible: volumenDistribuible.toFixed(2),
    concentracionFinal: concentracionFinal.toFixed(2),
    distribucion: [controles, hemocultivos, ...distribucionFinal],
    volumenDistribuido: resultadoDistribucion.volumenDistribuido,
    volumenRestante: resultadoDistribucion.volumenRestante
  };
}
