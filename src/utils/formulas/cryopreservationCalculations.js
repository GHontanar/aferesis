/**
 * Cálculos para programación de congelación de productos de aféresis
 */

// Constantes de criopreservación
export const CRYO = {
  DMSO_RATIO: 0.2,              // 20% del volumen concentrado
  PLASMA_RATIO: 0.8,            // 80% del volumen concentrado
  DMSO_FINAL_PCT: 10,           // 10% concentración final de DMSO
  CONTROLES_CANTIDAD: 2,        // 2 criotubos de control
  CONTROLES_VOL_UNITARIO: 1,    // 1 ml cada criotubo de control
  HEMOCULTIVOS_CANTIDAD: 1,     // 1 muestra de hemocultivo
  HEMOCULTIVOS_VOL: 2,          // 2 ml para hemocultivos
  CONCENTRACION_MAXIMA_DEFAULT: 250000, // células/mm³, en el producto antes de la mezcla
  DMSO_LIMITE_ML_KG_DIA: 1,     // AABB Circular of Information (cellular therapy products)
};

export const FUENTE_LIMITE_DMSO =
  'AABB, ASFA, ASTCT, FACT, ISCT, JACIE et al. Circular of Information for the Use of Cellular Therapy Products. ' +
  'Productos descongelados sin lavar: no superar 1 mL de DMSO por kg de receptor y día.';

CRYO.VOLUMEN_RESERVADO =
  (CRYO.CONTROLES_CANTIDAD * CRYO.CONTROLES_VOL_UNITARIO) + CRYO.HEMOCULTIVOS_VOL;

/**
 * Contenedores por defecto. esCriotubo marca el contenedor usado para alícuotas.
 */
export const CONTENEDORES_DEFAULT = [
  { id: 1, nombre: 'Criotubo', volMin: 1, volMax: 1, esCriotubo: true },
  { id: 2, nombre: 'Bolsa pequeña', volMin: 15, volMax: 85, esCriotubo: false },
  { id: 3, nombre: 'Bolsa grande', volMin: 40, volMax: 160, esCriotubo: false },
];

/**
 * Calcula el volumen mínimo de concentración para no exceder la concentración máxima
 */
export function calcularVolumenMinimo(volumenInicial, concentracionLeucocitos, concentracionMaxima) {
  return volumenInicial * (concentracionLeucocitos / concentracionMaxima);
}

/**
 * Indica si el producto supera la concentración máxima y hay que diluirlo
 * antes de añadir la mezcla crioprotectora.
 */
export function requiereDilucion(volumenInicial, concentracionLeucocitos, concentracionMaxima) {
  if (!(volumenInicial > 0 && concentracionLeucocitos > 0 && concentracionMaxima > 0)) return false;
  return concentracionLeucocitos > concentracionMaxima;
}

/**
 * Volumen de medio de dilución a añadir para llevar el producto al volumen diluido
 */
export function calcularVolumenDilucion(volumenInicial, volumenDiluido) {
  return Math.max(0, volumenDiluido - volumenInicial);
}

/**
 * Volumen base del producto antes de la mezcla crioprotectora:
 * diluido si supera la concentración máxima, concentrado si se elige, o el inicial.
 * Si se diluye, nunca queda por debajo del volumen mínimo.
 */
export function calcularVolumenBase({
  volumenInicial,
  concentracionLeucocitos,
  concentracionMaxima,
  concentrar,
  volumenConcentrado,
  volumenDiluido,
}) {
  if (requiereDilucion(volumenInicial, concentracionLeucocitos, concentracionMaxima)) {
    const minimo = calcularVolumenMinimo(volumenInicial, concentracionLeucocitos, concentracionMaxima);
    return { modo: 'diluir', volumen: Math.max(volumenDiluido || 0, minimo) };
  }
  if (concentrar) return { modo: 'concentrar', volumen: volumenConcentrado };
  return { modo: 'ninguno', volumen: volumenInicial };
}

/**
 * Dosis de DMSO que recibe el receptor con un volumen de producto final
 * (concentración final de DMSO fija). Umbral: mL/kg/día (AABB).
 */
export function calcularDosisDMSO(volumenProductoFinal, pesoReceptor) {
  const dmsoMl = volumenProductoFinal * (CRYO.DMSO_FINAL_PCT / 100);
  const mlPorKg = pesoReceptor > 0 ? dmsoMl / pesoReceptor : 0;
  return {
    dmsoMl: parseFloat(dmsoMl.toFixed(2)),
    mlPorKg: parseFloat(mlPorKg.toFixed(3)),
    limiteMlKgDia: CRYO.DMSO_LIMITE_ML_KG_DIA,
    superaLimite: mlPorKg > CRYO.DMSO_LIMITE_ML_KG_DIA,
  };
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
  const dmso = volumenConcentrado * CRYO.DMSO_RATIO;
  const plasma = volumenConcentrado * CRYO.PLASMA_RATIO;
  const volumenTotal = volumenConcentrado + dmso + plasma;

  return {
    dmso: parseFloat(dmso.toFixed(2)),
    plasma: parseFloat(plasma.toFixed(2)),
    volumenTotal: parseFloat(volumenTotal.toFixed(2)),
    concentracionDMSO: CRYO.DMSO_FINAL_PCT,
  };
}

/**
 * Calcula el volumen disponible para distribución (descontando controles y hemocultivos)
 */
export function calcularVolumenDistribuible(volumenTotal) {
  return volumenTotal - CRYO.VOLUMEN_RESERVADO;
}

/**
 * Calcula la concentración final después de añadir criopreservante
 */
export function calcularConcentracionFinal(
  concentracionInicial,
  volumenInicial,
  volumenFinal
) {
  const celulasTotal = concentracionInicial * volumenInicial;
  return celulasTotal / volumenFinal;
}

/**
 * Distribución automática: contenedor más pequeño que admita el volumen,
 * o mínimo número de contenedores del mayor tipo si excede el mayor.
 */
export function distribuirAutomaticamente(volumenDisponible, tiposContenedores) {
  const distribucion = [];
  let volumenRestante = volumenDisponible;

  // Filtrar solo contenedores no-criotubo (bolsas) para distribución automática
  const bolsas = tiposContenedores
    .filter(c => !c.esCriotubo)
    .sort((a, b) => a.volMax - b.volMax); // ascendente por volMax

  if (bolsas.length === 0) {
    // Solo hay criotubos: usar criotubos
    const criotubo = tiposContenedores.find(c => c.esCriotubo);
    if (criotubo) {
      const cantidad = Math.ceil(volumenDisponible / criotubo.volMax);
      const volUnitario = parseFloat((volumenDisponible / cantidad).toFixed(2));
      distribucion.push({
        tipo: criotubo.nombre,
        cantidad,
        volumenUnitario: volUnitario,
        volumenTotal: parseFloat((volUnitario * cantidad).toFixed(2)),
      });
      volumenRestante = volumenDisponible - (volUnitario * cantidad);
    }
    return { distribucion, volumenDistribuido: parseFloat((volumenDisponible - volumenRestante).toFixed(2)), volumenRestante: parseFloat(Math.max(0, volumenRestante).toFixed(2)) };
  }

  // Buscar la bolsa más pequeña donde quepa todo el volumen
  const bolsaUnica = bolsas.find(b => volumenDisponible <= b.volMax && volumenDisponible >= b.volMin);

  if (bolsaUnica) {
    distribucion.push({
      tipo: bolsaUnica.nombre,
      cantidad: 1,
      volumenUnitario: parseFloat(volumenDisponible.toFixed(2)),
      volumenTotal: parseFloat(volumenDisponible.toFixed(2)),
    });
    volumenRestante = 0;
  } else {
    // No cabe en una sola bolsa: usar la bolsa más grande, mínimo número
    const bolsaMayor = bolsas[bolsas.length - 1];
    const cantidad = Math.ceil(volumenDisponible / bolsaMayor.volMax);
    const volUnitario = parseFloat((volumenDisponible / cantidad).toFixed(2));

    // Verificar que el volumen unitario cabe en el contenedor
    if (volUnitario >= bolsaMayor.volMin && volUnitario <= bolsaMayor.volMax) {
      distribucion.push({
        tipo: bolsaMayor.nombre,
        cantidad,
        volumenUnitario: volUnitario,
        volumenTotal: parseFloat((volUnitario * cantidad).toFixed(2)),
      });
      volumenRestante = volumenDisponible - (volUnitario * cantidad);
    } else {
      // Volumen unitario queda por debajo del mínimo de la bolsa mayor:
      // intentar con menos bolsas grandes + una bolsa más pequeña
      const cantidadGrandes = Math.floor(volumenDisponible / bolsaMayor.volMax);
      if (cantidadGrandes > 0) {
        distribucion.push({
          tipo: bolsaMayor.nombre,
          cantidad: cantidadGrandes,
          volumenUnitario: bolsaMayor.volMax,
          volumenTotal: parseFloat((cantidadGrandes * bolsaMayor.volMax).toFixed(2)),
        });
        volumenRestante -= cantidadGrandes * bolsaMayor.volMax;
      }

      // Distribuir el resto en la bolsa más pequeña que admita
      if (volumenRestante >= 1) {
        const bolsaResto = bolsas.find(b => volumenRestante <= b.volMax && volumenRestante >= b.volMin);
        if (bolsaResto) {
          distribucion.push({
            tipo: bolsaResto.nombre,
            cantidad: 1,
            volumenUnitario: parseFloat(volumenRestante.toFixed(2)),
            volumenTotal: parseFloat(volumenRestante.toFixed(2)),
          });
          volumenRestante = 0;
        }
      }
    }
  }

  // Si queda resto residual, intentar meter en criotubos
  if (volumenRestante >= 1) {
    const criotubo = tiposContenedores.find(c => c.esCriotubo);
    if (criotubo) {
      const cantidadCriotubos = Math.floor(volumenRestante / criotubo.volMax);
      if (cantidadCriotubos > 0) {
        distribucion.push({
          tipo: criotubo.nombre,
          cantidad: cantidadCriotubos,
          volumenUnitario: criotubo.volMax,
          volumenTotal: parseFloat((cantidadCriotubos * criotubo.volMax).toFixed(2)),
        });
        volumenRestante -= cantidadCriotubos * criotubo.volMax;
      }
    }
  }

  return {
    distribucion,
    volumenDistribuido: parseFloat((volumenDisponible - volumenRestante).toFixed(2)),
    volumenRestante: parseFloat(Math.max(0, volumenRestante).toFixed(2)),
  };
}

/**
 * Distribución por alícuotas múltiples: cada tier genera criotubos con dosis distinta,
 * resto distribuido automáticamente en bolsas.
 * @param {number} volumenDisponible - ml disponibles para distribución
 * @param {Object} opciones - { modoDistribucion, tiers: [{cantidad, dosisPorKg, volumenPorCriotubo, volumenTier}] }
 * @param {Array} tiposContenedores - tipos de contenedores disponibles
 */
export function distribuirPorAlicuotas(volumenDisponible, opciones, tiposContenedores) {
  const distribucion = [];
  let volumenRestante = volumenDisponible;

  const criotubo = tiposContenedores.find(c => c.esCriotubo);

  if (criotubo && opciones.tiers && opciones.tiers.length > 0) {
    for (const tier of opciones.tiers) {
      if (tier.cantidad > 0 && tier.volumenPorCriotubo > 0) {
        distribucion.push({
          tipo: `${criotubo.nombre} (${tier.dosisPorKg} ×10⁶/kg)`,
          cantidad: tier.cantidad,
          volumenUnitario: parseFloat(tier.volumenPorCriotubo.toFixed(2)),
          volumenTotal: parseFloat(tier.volumenTier.toFixed(2)),
        });
        volumenRestante -= tier.volumenTier;
      }
    }
  }

  // Distribuir el resto automáticamente (sin criotubos, que ya se usaron)
  if (volumenRestante >= 1) {
    const contenedoresSinCriotubo = tiposContenedores.filter(c => !c.esCriotubo);
    if (contenedoresSinCriotubo.length > 0) {
      const restoDistribucion = distribuirAutomaticamente(volumenRestante, contenedoresSinCriotubo);
      distribucion.push(...restoDistribucion.distribucion);
      volumenRestante = restoDistribucion.volumenRestante;
    }
  }

  return {
    distribucion,
    volumenDistribuido: parseFloat((volumenDisponible - volumenRestante).toFixed(2)),
    volumenRestante: parseFloat(Math.max(0, volumenRestante).toFixed(2)),
  };
}

/**
 * Punto de entrada de distribución: delega al modo correspondiente
 */
export function distribuirEnContenedores(volumenDisponible, opciones, tiposContenedores) {
  if (opciones.modoDistribucion === 'alicuotas') {
    return distribuirPorAlicuotas(volumenDisponible, opciones, tiposContenedores);
  }
  return distribuirAutomaticamente(volumenDisponible, tiposContenedores);
}

/**
 * Calcula células totales y por kg para cada contenedor de la distribución
 */
export function calcularCelulasPorContenedor(
  distribucion,
  concentracionFinal,
  pesoReceptor,
  tipoCelula
) {
  return distribucion.map(contenedor => {
    // Concentración final en células/μL, volumen en ml
    // células/μL × 1000 = células/ml
    const concentracionPorMl = concentracionFinal * 1000;
    const celulasTotal = (concentracionPorMl * contenedor.volumenUnitario) / 1000000; // millones
    const celulasPorKg = celulasTotal / pesoReceptor;

    return {
      ...contenedor,
      concentracionFinal: concentracionFinal.toFixed(2),
      celulasTotal: celulasTotal.toFixed(2),
      celulasPorKg: celulasPorKg.toFixed(2),
      tipoCelula,
    };
  });
}

/**
 * Calcula volúmenes para múltiples tiers de alícuotas
 * @param {Array} tiposAlicuotas - [{id, cantidad, dosisPorKg}, ...]
 * @param {number} pesoReceptor - kg
 * @param {number} concentracionFinal - células/μL
 * @param {number} volumenTotal - ml total tras criopreservante
 * @returns {Object} tiers calculados con volúmenes, y si cabe en el volumen disponible
 */
export function calcularAlicuotasMultiples(tiposAlicuotas, pesoReceptor, concentracionFinal, volumenTotal) {
  const volumenDisponible = volumenTotal - CRYO.VOLUMEN_RESERVADO;

  const tiers = tiposAlicuotas.map(tier => {
    const celulasPorCriotubo = tier.dosisPorKg * pesoReceptor; // millones
    const volumenPorCriotubo = (celulasPorCriotubo * 1000000) / (concentracionFinal * 1000); // ml
    const volumenTier = tier.cantidad * volumenPorCriotubo;
    return {
      ...tier,
      celulasPorCriotubo,
      volumenPorCriotubo,
      volumenTier,
    };
  });

  const volumenTotalAlicuotas = tiers.reduce((sum, t) => sum + t.volumenTier, 0);

  return {
    tiers,
    volumenTotalAlicuotas,
    cabe: volumenTotalAlicuotas <= volumenDisponible,
    volumenDisponible,
  };
}

/**
 * Función principal que coordina todos los cálculos de criopreservación
 */
export function calcularProgramacionCongelacion(params) {
  const {
    tipoProducto,
    volumenInicial,
    concentracionCelulas,
    concentracionLeucocitos,
    pesoReceptor,
    concentrar,
    concentracionMaxima,
    volumenConcentrado,
    volumenDiluido,
    modoDistribucion,
    tiposAlicuotas,
    tiposContenedores,
  } = params;

  // 0. Volumen base: diluido, concentrado o inicial
  const { modo: modoAjuste, volumen: volEfectivo } = calcularVolumenBase({
    volumenInicial,
    concentracionLeucocitos,
    concentracionMaxima,
    concentrar,
    volumenConcentrado,
    volumenDiluido,
  });
  const diluir = modoAjuste === 'diluir';
  const volumenDilucion = diluir ? calcularVolumenDilucion(volumenInicial, volEfectivo) : 0;

  // 1. Volumen mínimo (relevante al concentrar o diluir)
  const volumenMinimo = concentrar || diluir
    ? calcularVolumenMinimo(volumenInicial, concentracionLeucocitos, concentracionMaxima)
    : volumenInicial;

  // 2. Factor de concentración
  const factorConcentracion = calcularFactorConcentracion(volumenInicial, volEfectivo);

  // 3. Criopreservante
  const criopreservante = calcularCriopreservante(volEfectivo);

  // 4. Volumen distribuible
  const volumenDistribuible = calcularVolumenDistribuible(criopreservante.volumenTotal);

  // 5. Concentración final
  const concentracionFinal = calcularConcentracionFinal(
    concentracionCelulas,
    volumenInicial,
    criopreservante.volumenTotal,
  );

  // 6. Opciones de distribución
  let opcionesDistribucion = { modoDistribucion };

  if (modoDistribucion === 'alicuotas' && tiposAlicuotas && tiposAlicuotas.length > 0) {
    const alicuotas = calcularAlicuotasMultiples(
      tiposAlicuotas, pesoReceptor, concentracionFinal, criopreservante.volumenTotal
    );
    opcionesDistribucion = {
      ...opcionesDistribucion,
      tiers: alicuotas.tiers,
    };
  }

  // 7. Distribuir en contenedores
  const resultadoDistribucion = distribuirEnContenedores(
    volumenDistribuible,
    opcionesDistribucion,
    tiposContenedores,
  );

  if (resultadoDistribucion.error) {
    return { error: resultadoDistribucion.error };
  }

  // 8. Calcular células y DMSO por contenedor
  const distribucionFinal = calcularCelulasPorContenedor(
    resultadoDistribucion.distribucion,
    concentracionFinal,
    pesoReceptor,
    tipoProducto,
  ).map(contenedor => {
    const dosis = calcularDosisDMSO(contenedor.volumenUnitario, pesoReceptor);
    return { ...contenedor, dmsoMl: dosis.dmsoMl, dmsoMlPorKg: dosis.mlPorKg };
  });

  // 8b. DMSO total del producto a infundir (sin controles ni hemocultivos)
  const dosisDMSO = calcularDosisDMSO(resultadoDistribucion.volumenDistribuido, pesoReceptor);

  // 9. Agregar controles y hemocultivos
  const concentracionPorMl = concentracionFinal * 1000;

  const controles = {
    tipo: 'Controles',
    cantidad: CRYO.CONTROLES_CANTIDAD,
    volumenUnitario: CRYO.CONTROLES_VOL_UNITARIO,
    volumenTotal: CRYO.CONTROLES_CANTIDAD * CRYO.CONTROLES_VOL_UNITARIO,
    concentracionFinal: concentracionFinal.toFixed(2),
    celulasTotal: ((concentracionPorMl * CRYO.CONTROLES_VOL_UNITARIO) / 1000000).toFixed(2),
    celulasPorKg: ((concentracionPorMl * CRYO.CONTROLES_VOL_UNITARIO) / 1000000 / pesoReceptor).toFixed(2),
    tipoCelula: tipoProducto,
    dmsoMl: '-',
    dmsoMlPorKg: '-',
  };

  const hemocultivos = {
    tipo: 'Hemocultivos',
    cantidad: CRYO.HEMOCULTIVOS_CANTIDAD,
    volumenUnitario: CRYO.HEMOCULTIVOS_VOL,
    volumenTotal: CRYO.HEMOCULTIVOS_CANTIDAD * CRYO.HEMOCULTIVOS_VOL,
    concentracionFinal: '-',
    celulasTotal: '-',
    celulasPorKg: '-',
    tipoCelula: tipoProducto,
    dmsoMl: '-',
    dmsoMlPorKg: '-',
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
    volumenRestante: resultadoDistribucion.volumenRestante,
    modoDistribucion,
    concentrar: concentrar && !diluir,
    diluir,
    volumenBase: parseFloat(volEfectivo.toFixed(2)),
    volumenDilucion: parseFloat(volumenDilucion.toFixed(2)),
    factorDilucion: (volEfectivo / volumenInicial).toFixed(2),
    dosisDMSO,
  };
}
