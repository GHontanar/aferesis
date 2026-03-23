import { describe, it, expect } from 'vitest';
import {
  calcularVolumenPorDosis,
  calcularDosisDisponibles,
  calcularDLI,
  formatearDosis
} from '../dliCalculations.js';

describe('calcularVolumenPorDosis', () => {
  it('calcula volumen necesario para una dosis', () => {
    // 1e6 CD3+/kg, 70 kg receptor, 5000 células/μL
    const vol = calcularVolumenPorDosis(1e6, 70, 5000);
    // 1e6 × 70 = 70e6 células necesarias
    // 5000 células/μL = 5000000 células/mL
    // 70e6 / 5000000 = 14 mL
    expect(vol).toBe(14);
  });

  it('mayor dosis = mayor volumen', () => {
    const vol1 = calcularVolumenPorDosis(1e6, 70, 5000);
    const vol2 = calcularVolumenPorDosis(1e7, 70, 5000);
    expect(vol2).toBeGreaterThan(vol1);
  });

  it('mayor concentración = menor volumen', () => {
    const vol1 = calcularVolumenPorDosis(1e6, 70, 5000);
    const vol2 = calcularVolumenPorDosis(1e6, 70, 10000);
    expect(vol2).toBeLessThan(vol1);
  });
});

describe('calcularDosisDisponibles', () => {
  it('calcula número de dosis', () => {
    // 100 mL producto, 5000 células/μL, 70 kg, 1e6 CD3+/kg
    const n = calcularDosisDisponibles(100, 5000, 70, 1e6);
    // vol por dosis = 14 mL
    // 100 / 14 = 7.14 → 7
    expect(n).toBe(7);
  });

  it('retorna 0 si no hay suficiente', () => {
    const n = calcularDosisDisponibles(1, 5000, 70, 1e8);
    expect(n).toBe(0);
  });
});

describe('calcularDLI', () => {
  const paramsBase = {
    volumenProducto: 50,
    concentracionCD3: 5000,
    pesoReceptor: 70,
    dosisInicial: 1e6,
    esquemaEscalada: [1e6, 5e6, 1e7, 5e7, 1e8],
    numDosis: 5
  };

  it('genera tabla de planificación', () => {
    const r = calcularDLI(paramsBase);
    expect(r.tabla).toHaveLength(5);
    expect(r.tabla[0].numeroDosis).toBe(1);
    expect(r.tabla[4].numeroDosis).toBe(5);
  });

  it('marca dosis no disponibles correctamente', () => {
    const r = calcularDLI(paramsBase);
    const disponibles = r.tabla.filter(d => d.disponible);
    const noDisponibles = r.tabla.filter(d => !d.disponible);
    expect(r.dosisAdministrables).toBe(disponibles.length);
    expect(disponibles.length + noDisponibles.length).toBe(5);
  });

  it('volumen acumulado es creciente', () => {
    const r = calcularDLI(paramsBase);
    for (let i = 1; i < r.tabla.length; i++) {
      expect(r.tabla[i].volumenAcumulado).toBeGreaterThan(r.tabla[i - 1].volumenAcumulado);
    }
  });

  it('genera escalada desde dosis inicial si no hay esquema', () => {
    const r = calcularDLI({
      ...paramsBase,
      esquemaEscalada: null,
      dosisInicial: 1e6,
      numDosis: 3
    });
    expect(r.tabla).toHaveLength(3);
    // Escalada: 1e6 → 5e6 → 1e7
    expect(r.tabla[0].dosisCD3PorKg).toBe(1e6);
    expect(r.tabla[1].dosisCD3PorKg).toBe(5e6);
    expect(r.tabla[2].dosisCD3PorKg).toBe(1e7);
  });

  it('limita numDosis al esquema disponible', () => {
    const r = calcularDLI({
      ...paramsBase,
      numDosis: 3 // solo 3 de las 5 del esquema
    });
    expect(r.tabla).toHaveLength(3);
  });

  it('calcula CD3 total del producto', () => {
    const r = calcularDLI(paramsBase);
    // 5000 células/μL × 50 mL × 1000 μL/mL = 250e6 células = 250 millones
    expect(parseFloat(r.celulasTotalProducto)).toBeCloseTo(250, 0);
  });
});

describe('formatearDosis', () => {
  it('formatea millones', () => {
    expect(formatearDosis(1e6)).toBe('1.0×10⁶');
    expect(formatearDosis(5e6)).toBe('5.0×10⁶');
  });

  it('formatea decenas de millones', () => {
    expect(formatearDosis(1e7)).toBe('1.0×10⁷');
  });

  it('formatea centenas de millones', () => {
    expect(formatearDosis(1e8)).toBe('1.0×10⁸');
  });

  it('formatea centenas de miles', () => {
    expect(formatearDosis(5e5)).toBe('5.0×10⁵');
  });
});
