import { describe, it, expect } from 'vitest';
import { calcularVolemiasCD3, estimarCD3DesdeLinfocitos } from '../cd3Calculations.js';

describe('estimarCD3DesdeLinfocitos', () => {
  it('estima CD3 con porcentaje por defecto (70%)', () => {
    const resultado = estimarCD3DesdeLinfocitos(2000);
    expect(resultado).toBe(1400);
  });

  it('estima CD3 con porcentaje personalizado', () => {
    const resultado = estimarCD3DesdeLinfocitos(2000, 50);
    expect(resultado).toBe(1000);
  });

  it('retorna 0 con linfocitos 0', () => {
    const resultado = estimarCD3DesdeLinfocitos(0, 70);
    expect(resultado).toBe(0);
  });

  it('maneja porcentaje 100%', () => {
    const resultado = estimarCD3DesdeLinfocitos(1500, 100);
    expect(resultado).toBe(1500);
  });
});

describe('calcularVolemiasCD3', () => {
  const paramsBase = {
    pesoDonante: 70,
    alturaDonante: 170,
    sexoDonante: 'M',
    pesoReceptor: 70,
    objetivoCD3: 2,
    concentracionCD3: 1000,
    eficiencia: 0.4,
    modoObjetivo: 'porKg'
  };

  it('calcula volemias en modo porKg', () => {
    const resultado = calcularVolemiasCD3(paramsBase);
    expect(parseFloat(resultado.volemias)).toBeGreaterThan(0);
    expect(parseFloat(resultado.volemiaDonante)).toBeGreaterThan(0);
    expect(parseFloat(resultado.cd3Totales)).toBe(140); // 2 × 70
    expect(resultado.modoObjetivo).toBe('porKg');
  });

  it('calcula volemias en modo totalProducto', () => {
    const resultado = calcularVolemiasCD3({
      ...paramsBase,
      modoObjetivo: 'totalProducto',
      objetivoCD3: 100 // 100 millones totales
    });
    expect(parseFloat(resultado.cd3Totales)).toBe(100);
    expect(resultado.modoObjetivo).toBe('totalProducto');
  });

  it('modo totalProducto no necesita pesoReceptor para cd3Totales', () => {
    const resultado = calcularVolemiasCD3({
      ...paramsBase,
      modoObjetivo: 'totalProducto',
      objetivoCD3: 50,
      pesoReceptor: undefined
    });
    expect(parseFloat(resultado.cd3Totales)).toBe(50);
  });

  it('marca advertencia cuando volemias >= 4', () => {
    const resultado = calcularVolemiasCD3({
      ...paramsBase,
      objetivoCD3: 100, // muy alto
      concentracionCD3: 100 // baja concentración
    });
    expect(parseFloat(resultado.volemias)).toBeGreaterThanOrEqual(4);
    expect(resultado.advertencia).toBe(true);
  });

  it('no marca advertencia con volemias normales', () => {
    const resultado = calcularVolemiasCD3({
      ...paramsBase,
      objetivoCD3: 0.5,
      concentracionCD3: 2000
    });
    expect(parseFloat(resultado.volemias)).toBeLessThan(4);
    expect(resultado.advertencia).toBe(false);
  });

  it('usa estimación desde linfocitos cuando fuenteCD3 es estimacion', () => {
    const resultado = calcularVolemiasCD3({
      ...paramsBase,
      fuenteCD3: 'estimacion',
      linfocitosTotales: 2000,
      porcentajeCD3: 70
    });
    expect(resultado.cd3Estimado).toBe(true);
    expect(parseFloat(resultado.concentracionCD3Usada)).toBeCloseTo(1400, 0);
    expect(resultado.linfocitosTotales).toBe(2000);
    expect(resultado.porcentajeCD3).toBe(70);
  });

  it('eficiencia mayor reduce volemias necesarias', () => {
    const resultadoBaja = calcularVolemiasCD3({ ...paramsBase, eficiencia: 0.3 });
    const resultadoAlta = calcularVolemiasCD3({ ...paramsBase, eficiencia: 0.6 });
    expect(parseFloat(resultadoBaja.volemias)).toBeGreaterThan(parseFloat(resultadoAlta.volemias));
  });

  it('modo adulto no añade campos pediátricos', () => {
    const resultado = calcularVolemiasCD3(paramsBase);
    expect(resultado.metodoVolemia).toBe('nadler');
    expect(resultado.franjaVolemia).toBeUndefined();
  });

  it('donante pediátrico: volemia estimada por peso sin usar altura ni sexo', () => {
    const resultado = calcularVolemiasCD3({
      ...paramsBase,
      pesoDonante: 10,
      alturaDonante: undefined,
      sexoDonante: undefined,
      franjaVolemia: 'lactante'
    });
    expect(resultado.metodoVolemia).toBe('pediatrico');
    expect(parseFloat(resultado.volemiaDonante)).toBeCloseTo(10 * 75 / 1000, 2); // 0.75 L
    expect(resultado.franjaVolemia).toBe('Lactante (3 meses a 2 años)');
    expect(resultado.volemiaMlKg).toBe(75);
    expect(resultado.volemiaRangoMlKg).toBe('70–80');
  });
});
