import { describe, it, expect } from 'vitest';
import {
  calcularFCR,
  calcularVolumenIntercambioRCE,
  calcularUnidadesCH,
  calcularRCE
} from '../rceCalculations.js';

describe('calcularFCR', () => {
  it('calcula FCR correctamente', () => {
    const fcr = calcularFCR(30, 80); // objetivo 30%, inicial 80%
    expect(fcr).toBeCloseTo(0.375, 3);
  });

  it('FCR < 1 cuando objetivo < inicial', () => {
    const fcr = calcularFCR(20, 60);
    expect(fcr).toBeLessThan(1);
  });

  it('FCR baja requiere más intercambio', () => {
    const fcrBaja = calcularFCR(10, 80);
    const fcrAlta = calcularFCR(40, 80);
    expect(fcrBaja).toBeLessThan(fcrAlta);
  });
});

describe('calcularVolumenIntercambioRCE', () => {
  it('calcula volumen de intercambio', () => {
    const vol = calcularVolumenIntercambioRCE(5.0, 35, 0.375);
    expect(vol).toBeGreaterThan(0);
  });

  it('volumen mayor con FCR menor (más intercambio necesario)', () => {
    const vol1 = calcularVolumenIntercambioRCE(5.0, 35, 0.5);
    const vol2 = calcularVolumenIntercambioRCE(5.0, 35, 0.3);
    expect(vol2).toBeGreaterThan(vol1);
  });

  it('volumen mayor con hematocrito mayor', () => {
    const volBajo = calcularVolumenIntercambioRCE(5.0, 25, 0.4);
    const volAlto = calcularVolumenIntercambioRCE(5.0, 45, 0.4);
    expect(volAlto).toBeGreaterThan(volBajo);
  });
});

describe('calcularUnidadesCH', () => {
  it('redondea hacia arriba', () => {
    expect(calcularUnidadesCH(850, 280)).toBe(4); // 850/280 = 3.03 → 4
  });

  it('sin resto devuelve exacto', () => {
    expect(calcularUnidadesCH(840, 280)).toBe(3); // exacto
  });

  it('volumen por unidad personalizado', () => {
    expect(calcularUnidadesCH(1000, 250)).toBe(4);
  });
});

describe('calcularRCE', () => {
  const paramsBase = {
    peso: 70,
    altura: 170,
    sexo: 'M',
    hctInicial: 30,
    hbSInicial: 80,
    hbSObjetivo: 30,
    hctCH: 60,
    volumenPorUnidad: 280
  };

  it('calcula resultados completos', () => {
    const r = calcularRCE(paramsBase);
    expect(parseFloat(r.volemia)).toBeGreaterThan(0);
    expect(parseFloat(r.fcr)).toBeGreaterThan(0);
    expect(parseFloat(r.fcr)).toBeLessThan(1);
    expect(r.volumenIntercambio).toBeGreaterThan(0);
    expect(r.unidadesCH).toBeGreaterThan(0);
    expect(parseFloat(r.hbSFinal)).toBe(30);
  });

  it('HbS objetivo más bajo requiere más unidades', () => {
    const r1 = calcularRCE({ ...paramsBase, hbSObjetivo: 40 });
    const r2 = calcularRCE({ ...paramsBase, hbSObjetivo: 20 });
    expect(r2.unidadesCH).toBeGreaterThan(r1.unidadesCH);
  });

  it('mayor volemia requiere más intercambio', () => {
    const rLigero = calcularRCE({ ...paramsBase, peso: 50 });
    const rPesado = calcularRCE({ ...paramsBase, peso: 100 });
    expect(rPesado.volumenIntercambio).toBeGreaterThan(rLigero.volumenIntercambio);
  });

  it('modo adulto no añade campos pediátricos', () => {
    const r = calcularRCE(paramsBase);
    expect(r.metodoVolemia).toBe('nadler');
    expect(r.franjaVolemia).toBeUndefined();
  });

  it('franja pediátrica estima la volemia por peso sin usar altura ni sexo', () => {
    const r = calcularRCE({
      ...paramsBase,
      peso: 12,
      altura: undefined,
      sexo: undefined,
      franjaVolemia: 'mayor2'
    });
    expect(r.metodoVolemia).toBe('pediatrico');
    expect(parseFloat(r.volemia)).toBeCloseTo(12 * 70 / 1000, 2); // 0.84 L
    expect(r.franjaVolemia).toBe('Niño mayor de 2 años');
    expect(r.volemiaMlKg).toBe(70);
    expect(r.volemiaRangoMlKg).toBe('70');
  });

  it('prematuro de 1,5 kg usa la franja pretérmino (95 mL/kg de valor medio)', () => {
    const r = calcularRCE({
      peso: 1.5,
      franjaVolemia: 'pretermino',
      hctInicial: 35,
      hbSInicial: 20,
      hbSObjetivo: 10,
      hctCH: 60
    });
    expect(r.metodoVolemia).toBe('pediatrico');
    expect(parseFloat(r.volemia)).toBeCloseTo(0.14, 2); // 1.5 kg × 95 mL/kg → 0.1425 L → 0.14
    expect(r.volemiaRangoMlKg).toBe('90–100');
  });
});
