/**
 * Calcula el volumen necesario para una dosis específica de DLI
 * @param {number} dosisCelulas - Dosis en número absoluto de CD3+ (ej: 1e6)
 * @param {number} pesoReceptor - Peso del receptor en kg
 * @param {number} concentracionCD3 - Concentración CD3+ del producto en células/μL
 * @returns {number} Volumen necesario en mL
 */
export function calcularVolumenPorDosis(dosisCelulas, pesoReceptor, concentracionCD3) {
  // dosisCelulas está en CD3+/kg, necesitamos total
  const celulasNecesarias = dosisCelulas * pesoReceptor;
  // concentracionCD3 en células/μL = células/0.001mL
  // volumen (mL) = celulasNecesarias / (concentracionCD3 × 1000)
  return celulasNecesarias / (concentracionCD3 * 1000);
}

/**
 * Calcula el número máximo de dosis disponibles de un producto criopreservado
 * @param {number} volumenProducto - Volumen total del producto en mL
 * @param {number} concentracionCD3 - Concentración CD3+ en células/μL
 * @param {number} pesoReceptor - Peso del receptor en kg
 * @param {number} dosisCelulas - Dosis objetivo en CD3+/kg
 * @returns {number} Número de dosis disponibles
 */
export function calcularDosisDisponibles(volumenProducto, concentracionCD3, pesoReceptor, dosisCelulas) {
  const volumenPorDosis = calcularVolumenPorDosis(dosisCelulas, pesoReceptor, concentracionCD3);
  if (volumenPorDosis <= 0) return 0;
  return Math.floor(volumenProducto / volumenPorDosis);
}

/**
 * Genera una tabla de escalada de DLI
 * @param {Object} params
 * @param {number} params.volumenProducto - Volumen total en mL
 * @param {number} params.concentracionCD3 - Concentración CD3+ en células/μL
 * @param {number} params.pesoReceptor - Peso del receptor en kg
 * @param {number} params.dosisInicial - Primera dosis en CD3+/kg
 * @param {number[]} params.esquemaEscalada - Array de dosis en CD3+/kg
 * @param {number} params.numDosis - Número de dosis previstas
 * @returns {Object} Tabla de planificación y resumen
 */
export function calcularDLI(params) {
  const {
    volumenProducto,
    concentracionCD3,
    pesoReceptor,
    dosisInicial,
    esquemaEscalada,
    numDosis
  } = params;

  const celulasTotal = concentracionCD3 * volumenProducto * 1000; // total CD3+ en producto
  const celulasTotalMillones = celulasTotal / 1e6;

  const tabla = [];
  let volumenAcumulado = 0;
  let cd3Acumulado = 0;

  // Usar esquema de escalada o generar desde dosis inicial
  const dosisArray = esquemaEscalada && esquemaEscalada.length > 0
    ? esquemaEscalada.slice(0, numDosis)
    : generarEscaladaDesdeInicial(dosisInicial, numDosis);

  for (let i = 0; i < dosisArray.length; i++) {
    const dosis = dosisArray[i];
    const volumen = calcularVolumenPorDosis(dosis, pesoReceptor, concentracionCD3);
    const cd3EnDosis = dosis * pesoReceptor;

    volumenAcumulado += volumen;
    cd3Acumulado += cd3EnDosis;

    const disponible = volumenAcumulado <= volumenProducto;

    tabla.push({
      numeroDosis: i + 1,
      dosisCD3PorKg: dosis,
      dosisCD3PorKgFormateada: formatearDosis(dosis),
      cd3Total: cd3EnDosis,
      cd3TotalFormateada: formatearDosis(cd3EnDosis),
      volumenML: parseFloat(volumen.toFixed(2)),
      volumenAcumulado: parseFloat(volumenAcumulado.toFixed(2)),
      disponible
    });
  }

  const dosisAdministrables = tabla.filter(d => d.disponible).length;
  const volumenTotalNecesario = tabla.reduce((acc, d) => d.disponible ? acc + d.volumenML : acc, 0);

  return {
    tabla,
    dosisAdministrables,
    totalDosis: dosisArray.length,
    volumenProducto,
    volumenTotalNecesario: parseFloat(volumenTotalNecesario.toFixed(2)),
    volumenRestante: parseFloat((volumenProducto - volumenTotalNecesario).toFixed(2)),
    celulasTotalProducto: celulasTotalMillones.toFixed(1),
    cd3Acumulado: parseFloat((cd3Acumulado / 1e6).toFixed(2))
  };
}

/**
 * Genera un esquema de escalada desde una dosis inicial (×10 por escalón)
 */
function generarEscaladaDesdeInicial(dosisInicial, numDosis) {
  const escalada = [];
  let dosis = dosisInicial;
  for (let i = 0; i < numDosis; i++) {
    escalada.push(dosis);
    // Escalada log: ×5, ×2 alternando (1e6 → 5e6 → 1e7 → 5e7...)
    dosis = i % 2 === 0 ? dosis * 5 : dosis * 2;
  }
  return escalada;
}

/**
 * Formatea una dosis en notación científica legible
 */
export function formatearDosis(valor) {
  if (valor >= 1e8) return `${(valor / 1e8).toFixed(1)}×10⁸`;
  if (valor >= 1e7) return `${(valor / 1e7).toFixed(1)}×10⁷`;
  if (valor >= 1e6) return `${(valor / 1e6).toFixed(1)}×10⁶`;
  if (valor >= 1e5) return `${(valor / 1e5).toFixed(1)}×10⁵`;
  if (valor >= 1e4) return `${(valor / 1e4).toFixed(1)}×10⁴`;
  return valor.toFixed(0);
}
