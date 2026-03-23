import { describe, it, expect } from 'vitest';
import {
  CRYO,
  CONTENEDORES_DEFAULT,
  calcularVolumenMinimo,
  calcularFactorConcentracion,
  calcularCriopreservante,
  calcularVolumenDistribuible,
  calcularConcentracionFinal,
  calcularAlicuotasMultiples,
  distribuirAutomaticamente,
  distribuirPorAlicuotas,
  distribuirEnContenedores,
  calcularCelulasPorContenedor,
  calcularProgramacionCongelacion,
} from '../cryopreservationCalculations';

describe('Constantes CRYO', () => {
  it('tiene los valores esperados', () => {
    expect(CRYO.DMSO_RATIO).toBe(0.2);
    expect(CRYO.PLASMA_RATIO).toBe(0.8);
    expect(CRYO.DMSO_FINAL_PCT).toBe(10);
    expect(CRYO.VOLUMEN_RESERVADO).toBe(4);
  });

  it('CONTENEDORES_DEFAULT tiene 3 tipos con esCriotubo flag', () => {
    expect(CONTENEDORES_DEFAULT).toHaveLength(3);
    expect(CONTENEDORES_DEFAULT[0].esCriotubo).toBe(true);
    expect(CONTENEDORES_DEFAULT[1].esCriotubo).toBe(false);
    expect(CONTENEDORES_DEFAULT[2].esCriotubo).toBe(false);
  });
});

describe('calcularVolumenMinimo', () => {
  it('calcula el volumen mínimo correctamente', () => {
    // 200ml × (100000/250000) = 80ml
    expect(calcularVolumenMinimo(200, 100000, 250000)).toBeCloseTo(80);
  });

  it('volumen mínimo = volumen inicial si leucocitos = concentración máxima', () => {
    expect(calcularVolumenMinimo(200, 250000, 250000)).toBeCloseTo(200);
  });

  it('volumen mínimo < volumen inicial si leucocitos < concentración máxima', () => {
    const result = calcularVolumenMinimo(200, 50000, 250000);
    expect(result).toBeLessThan(200);
    expect(result).toBeCloseTo(40);
  });
});

describe('calcularFactorConcentracion', () => {
  it('factor = 1 si no se concentra', () => {
    expect(calcularFactorConcentracion(200, 200)).toBe(1);
  });

  it('factor = 2 si se reduce a la mitad', () => {
    expect(calcularFactorConcentracion(200, 100)).toBe(2);
  });
});

describe('calcularCriopreservante', () => {
  it('calcula DMSO 20% y plasma 80% correctamente', () => {
    const result = calcularCriopreservante(100);
    expect(result.dmso).toBeCloseTo(20);
    expect(result.plasma).toBeCloseTo(80);
    expect(result.volumenTotal).toBeCloseTo(200);
    expect(result.concentracionDMSO).toBe(10);
  });

  it('retorna números, no strings', () => {
    const result = calcularCriopreservante(100);
    expect(typeof result.dmso).toBe('number');
    expect(typeof result.plasma).toBe('number');
    expect(typeof result.volumenTotal).toBe('number');
  });
});

describe('calcularVolumenDistribuible', () => {
  it('resta los 4ml de controles y hemocultivos', () => {
    expect(calcularVolumenDistribuible(200)).toBe(196);
  });
});

describe('calcularConcentracionFinal', () => {
  it('diluye la concentración según el volumen final', () => {
    // 100 células/μL × 200ml / 400ml = 50 células/μL
    expect(calcularConcentracionFinal(100, 200, 400)).toBeCloseTo(50);
  });

  it('concentración se mantiene si volumen no cambia', () => {
    expect(calcularConcentracionFinal(100, 200, 200)).toBeCloseTo(100);
  });
});

describe('calcularAlicuotasMultiples', () => {
  it('calcula volúmenes para un solo tier', () => {
    // concentracionFinal = 50000 células/μL, volumenTotal = 50 ml
    // dosisPorKg = 0.1, peso = 70, cantidad = 10
    // celulasPorCriotubo = 0.1 × 70 = 7 millones
    // volumenPorCriotubo = (7×10⁶) / (50000×1000) = 0.14 ml
    // volumenTier = 10 × 0.14 = 1.4 ml
    // disponible = 50 - 4 = 46 ml → cabe
    const result = calcularAlicuotasMultiples(
      [{ id: 1, cantidad: 10, dosisPorKg: 0.1 }],
      70, 50000, 50
    );
    expect(result.tiers).toHaveLength(1);
    expect(result.tiers[0].celulasPorCriotubo).toBeCloseTo(7);
    expect(result.tiers[0].volumenPorCriotubo).toBeCloseTo(0.14);
    expect(result.tiers[0].volumenTier).toBeCloseTo(1.4);
    expect(result.cabe).toBe(true);
  });

  it('calcula volúmenes para múltiples tiers', () => {
    const tiers = [
      { id: 1, cantidad: 1, dosisPorKg: 0.5 },
      { id: 2, cantidad: 1, dosisPorKg: 1.0 },
      { id: 3, cantidad: 5, dosisPorKg: 2.0 },
    ];
    const result = calcularAlicuotasMultiples(tiers, 70, 50000, 50);

    expect(result.tiers).toHaveLength(3);
    // Tier 1: 0.5 × 70 = 35M → vol = 35e6 / (50000×1000) = 0.7ml → 1 × 0.7 = 0.7
    expect(result.tiers[0].volumenTier).toBeCloseTo(0.7);
    // Tier 2: 1.0 × 70 = 70M → vol = 70e6 / (50000×1000) = 1.4ml → 1 × 1.4 = 1.4
    expect(result.tiers[1].volumenTier).toBeCloseTo(1.4);
    // Tier 3: 2.0 × 70 = 140M → vol = 140e6 / (50000×1000) = 2.8ml → 5 × 2.8 = 14
    expect(result.tiers[2].volumenTier).toBeCloseTo(14);

    expect(result.volumenTotalAlicuotas).toBeCloseTo(16.1);
    expect(result.cabe).toBe(true);
  });

  it('detecta que no cabe si excede el volumen disponible', () => {
    const tiers = [
      { id: 1, cantidad: 1000, dosisPorKg: 2.0 },
    ];
    // 2.0 × 70 = 140M → vol = 2.8ml/criotubo → 1000 × 2.8 = 2800ml
    // disponible = 50 - 4 = 46 → no cabe
    const result = calcularAlicuotasMultiples(tiers, 70, 50000, 50);
    expect(result.cabe).toBe(false);
  });

  it('retorna lista vacía para array vacío', () => {
    const result = calcularAlicuotasMultiples([], 70, 50000, 50);
    expect(result.tiers).toHaveLength(0);
    expect(result.volumenTotalAlicuotas).toBe(0);
    expect(result.cabe).toBe(true);
  });
});

describe('distribuirAutomaticamente', () => {
  const contenedores = CONTENEDORES_DEFAULT;

  it('usa una sola bolsa pequeña si el volumen cabe', () => {
    const result = distribuirAutomaticamente(50, contenedores);
    expect(result.distribucion).toHaveLength(1);
    expect(result.distribucion[0].tipo).toBe('Bolsa pequeña');
    expect(result.distribucion[0].cantidad).toBe(1);
    expect(result.volumenRestante).toBeCloseTo(0);
  });

  it('usa una sola bolsa grande si el volumen excede la bolsa pequeña', () => {
    const result = distribuirAutomaticamente(100, contenedores);
    expect(result.distribucion).toHaveLength(1);
    expect(result.distribucion[0].tipo).toBe('Bolsa grande');
    expect(result.distribucion[0].cantidad).toBe(1);
  });

  it('usa múltiples bolsas grandes si el volumen excede la mayor', () => {
    // 300 ml, bolsa grande max 160 → ceil(300/160) = 2 bolsas de 150ml cada una
    const result = distribuirAutomaticamente(300, contenedores);
    expect(result.distribucion[0].tipo).toBe('Bolsa grande');
    expect(result.distribucion[0].cantidad).toBe(2);
    expect(result.distribucion[0].volumenUnitario).toBeCloseTo(150);
  });

  it('maneja volumen que no cabe exacto con bolsas + resto en criotubos', () => {
    // 165 ml: 1 bolsa grande (160ml) + posiblemente criotubos para los 5ml restantes
    const result = distribuirAutomaticamente(165, contenedores);
    const volumenTotal = result.distribucion.reduce((sum, d) => sum + d.volumenTotal, 0);
    expect(volumenTotal).toBeGreaterThanOrEqual(160);
  });

  it('usa solo criotubos si no hay bolsas', () => {
    const soloTubos = [{ id: 1, nombre: 'Criotubo', volMin: 1, volMax: 1, esCriotubo: true }];
    const result = distribuirAutomaticamente(5, soloTubos);
    expect(result.distribucion[0].tipo).toBe('Criotubo');
    expect(result.distribucion[0].cantidad).toBe(5);
  });
});

describe('distribuirPorAlicuotas', () => {
  const contenedores = CONTENEDORES_DEFAULT;

  it('crea criotubos por cada tier y distribuye el resto', () => {
    const tiers = [
      { id: 1, cantidad: 3, dosisPorKg: 0.5, celulasPorCriotubo: 35, volumenPorCriotubo: 0.5, volumenTier: 1.5 },
      { id: 2, cantidad: 2, dosisPorKg: 1.0, celulasPorCriotubo: 70, volumenPorCriotubo: 1.0, volumenTier: 2.0 },
    ];
    const result = distribuirPorAlicuotas(100, { tiers }, contenedores);

    expect(result.distribucion[0].tipo).toContain('0.5 ×10⁶/kg');
    expect(result.distribucion[0].cantidad).toBe(3);
    expect(result.distribucion[1].tipo).toContain('1 ×10⁶/kg');
    expect(result.distribucion[1].cantidad).toBe(2);
    // Resto distribuido en bolsas
    expect(result.distribucion.length).toBeGreaterThanOrEqual(3);
  });

  it('no crea criotubos si tiers es vacío', () => {
    const result = distribuirPorAlicuotas(100, { tiers: [] }, contenedores);
    const dosisEspecifica = result.distribucion.find(d => d.tipo.includes('×10⁶/kg'));
    expect(dosisEspecifica).toBeUndefined();
  });
});

describe('distribuirEnContenedores', () => {
  it('delega a distribución automática por defecto', () => {
    const result = distribuirEnContenedores(50, { modoDistribucion: 'automatica' }, CONTENEDORES_DEFAULT);
    expect(result.distribucion).toHaveLength(1);
    expect(result.distribucion[0].tipo).toBe('Bolsa pequeña');
  });

  it('delega a alícuotas cuando modoDistribucion es alicuotas', () => {
    const tiers = [
      { id: 1, cantidad: 3, dosisPorKg: 1.0, celulasPorCriotubo: 70, volumenPorCriotubo: 0.8, volumenTier: 2.4 },
    ];
    const result = distribuirEnContenedores(100, {
      modoDistribucion: 'alicuotas',
      tiers,
    }, CONTENEDORES_DEFAULT);

    expect(result.distribucion[0].tipo).toContain('×10⁶/kg');
  });
});

describe('calcularCelulasPorContenedor', () => {
  it('calcula células totales y por kg', () => {
    const distribucion = [
      { tipo: 'Bolsa', cantidad: 1, volumenUnitario: 50, volumenTotal: 50 }
    ];
    // concentracionFinal=100 células/μL, pesoReceptor=70
    // concentracionPorMl = 100 × 1000 = 100000
    // celulasTotal = (100000 × 50) / 1000000 = 5 millones
    // celulasPorKg = 5 / 70 = 0.071
    const result = calcularCelulasPorContenedor(distribucion, 100, 70, 'CD34');
    expect(parseFloat(result[0].celulasTotal)).toBeCloseTo(5, 1);
    expect(parseFloat(result[0].celulasPorKg)).toBeCloseTo(0.07, 1);
    expect(result[0].tipoCelula).toBe('CD34');
  });
});

describe('calcularProgramacionCongelacion', () => {
  const baseParams = {
    tipoProducto: 'CD34',
    volumenInicial: 200,
    concentracionCelulas: 100,
    concentracionLeucocitos: 100000,
    pesoReceptor: 70,
    concentrar: true,
    concentracionMaxima: 250000,
    volumenConcentrado: 100,
    modoDistribucion: 'automatica',
    tiposAlicuotas: [],
    tiposContenedores: CONTENEDORES_DEFAULT,
  };

  it('retorna resultado completo con distribución automática y concentración', () => {
    const result = calcularProgramacionCongelacion(baseParams);

    expect(result.error).toBeUndefined();
    expect(parseFloat(result.factorConcentracion)).toBeCloseTo(2);
    expect(parseFloat(result.volumenMinimo)).toBeCloseTo(80);
    expect(parseFloat(result.dmso)).toBeGreaterThan(0);
    expect(parseFloat(result.plasma)).toBeGreaterThan(0);
    expect(parseFloat(result.volumenTotal)).toBeGreaterThan(0);
    expect(result.concentracionDMSO).toBe(10);
    expect(result.distribucion.length).toBeGreaterThanOrEqual(3); // controles + hemocultivos + al menos 1 contenedor
    expect(result.distribucion[0].tipo).toBe('Controles');
    expect(result.distribucion[1].tipo).toBe('Hemocultivos');
    expect(result.modoDistribucion).toBe('automatica');
    expect(result.concentrar).toBe(true);
  });

  it('funciona sin concentrar (volumen = volumen inicial)', () => {
    const result = calcularProgramacionCongelacion({
      ...baseParams,
      concentrar: false,
    });

    expect(result.error).toBeUndefined();
    expect(parseFloat(result.factorConcentracion)).toBeCloseTo(1);
    expect(result.concentrar).toBe(false);
  });

  it('funciona en modo alícuotas con múltiples tiers', () => {
    const result = calcularProgramacionCongelacion({
      ...baseParams,
      modoDistribucion: 'alicuotas',
      tiposAlicuotas: [
        { id: 1, cantidad: 1, dosisPorKg: 0.5 },
        { id: 2, cantidad: 2, dosisPorKg: 1.0 },
      ],
    });

    expect(result.error).toBeUndefined();
    expect(result.modoDistribucion).toBe('alicuotas');
    // Debe haber controles + hemocultivos + 2 tiers de criotubos + bolsas para el resto
    expect(result.distribucion.length).toBeGreaterThanOrEqual(4);
    // Verificar que hay filas con las dosis
    const tier1 = result.distribucion.find(d => d.tipo.includes('0.5 ×10⁶/kg'));
    const tier2 = result.distribucion.find(d => d.tipo.includes('1 ×10⁶/kg'));
    expect(tier1).toBeDefined();
    expect(tier2).toBeDefined();
    expect(tier1.cantidad).toBe(1);
    expect(tier2.cantidad).toBe(2);
  });

  it('incluye controles y hemocultivos con volúmenes correctos', () => {
    const result = calcularProgramacionCongelacion(baseParams);
    const controles = result.distribucion.find(d => d.tipo === 'Controles');
    const hemocultivos = result.distribucion.find(d => d.tipo === 'Hemocultivos');

    expect(controles.cantidad).toBe(CRYO.CONTROLES_CANTIDAD);
    expect(controles.volumenUnitario).toBe(CRYO.CONTROLES_VOL_UNITARIO);
    expect(hemocultivos.volumenTotal).toBe(CRYO.HEMOCULTIVOS_VOL);
  });
});
