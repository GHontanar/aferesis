import { describe, it, expect } from 'vitest';
import { calcularVolemiasCD34 } from '../cd34Calculations.js';
import { calcularVolemiaNadler } from '../nadler.js';

describe('calcularVolemiasCD34', () => {
  const paramsBase = {
    pesoDonante: 70,
    alturaDonante: 170,
    sexoDonante: 'M',
    pesoReceptor: 70,
    objetivoCD34: 5,
    concentracionCD34: 50,
    eficiencia: 0.4
  };

  it('calcula resultados completos con volemia de Nadler', () => {
    const r = calcularVolemiasCD34(paramsBase);
    expect(r.metodoVolemia).toBe('nadler');
    expect(parseFloat(r.volemiaDonante)).toBeCloseTo(calcularVolemiaNadler(70, 170, 'M'), 2);
    expect(parseFloat(r.cd34Totales)).toBe(350); // 5 × 70
    expect(parseFloat(r.volumenProcesar)).toBe(17.5); // 350 / (50 × 0.4)
    expect(parseFloat(r.volemias)).toBeGreaterThan(0);
    expect(r.franjaVolemia).toBeUndefined();
  });

  it('marca advertencia cuando volemias >= 4', () => {
    const r = calcularVolemiasCD34({ ...paramsBase, concentracionCD34: 10 });
    expect(parseFloat(r.volemias)).toBeGreaterThanOrEqual(4);
    expect(r.advertencia).toBe(true);
  });

  it('no marca advertencia con volemias normales', () => {
    const r = calcularVolemiasCD34(paramsBase);
    expect(r.advertencia).toBe(false);
  });

  it('eficiencia mayor reduce el volumen a procesar', () => {
    const rBaja = calcularVolemiasCD34({ ...paramsBase, eficiencia: 0.3 });
    const rAlta = calcularVolemiasCD34({ ...paramsBase, eficiencia: 0.6 });
    expect(parseFloat(rBaja.volumenProcesar)).toBeGreaterThan(parseFloat(rAlta.volumenProcesar));
  });

  it('donante pediátrico: volemia estimada por peso sin usar altura ni sexo', () => {
    const r = calcularVolemiasCD34({
      ...paramsBase,
      pesoDonante: 10,
      alturaDonante: undefined,
      sexoDonante: undefined,
      franjaVolemia: 'lactante'
    });
    expect(r.metodoVolemia).toBe('pediatrico');
    expect(parseFloat(r.volemiaDonante)).toBeCloseTo(10 * 75 / 1000, 2); // 0.75 L
    expect(r.franjaVolemia).toBe('Lactante (3 meses a 2 años)');
    expect(r.volemiaMlKg).toBe(75);
    expect(r.volemiaRangoMlKg).toBe('70–80');
  });

  it('donante prematuro: franja pretérmino con valor medio 95 mL/kg', () => {
    const r = calcularVolemiasCD34({
      ...paramsBase,
      pesoDonante: 1.2,
      franjaVolemia: 'pretermino'
    });
    expect(r.metodoVolemia).toBe('pediatrico');
    expect(parseFloat(r.volemiaDonante)).toBeCloseTo(0.11, 2); // 1.2 kg × 95 mL/kg → 0.114 L → 0.11
    expect(r.volemiaRangoMlKg).toBe('90–100');
  });
});
