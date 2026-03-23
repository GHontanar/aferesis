import { describe, it, expect } from 'vitest';
import {
  calcularVolumenPlasmatico,
  calcularIgGResidual,
  calcularReposicion,
  calcularTPE
} from '../tpeCalculations.js';

describe('calcularVolumenPlasmatico', () => {
  it('calcula volumen plasmático correctamente', () => {
    const vp = calcularVolumenPlasmatico(5.0, 40); // 5L volemia, 40% Hct
    expect(vp).toBe(3.0);
  });

  it('hematocrito alto reduce volumen plasmático', () => {
    const vpAlto = calcularVolumenPlasmatico(5.0, 60);
    const vpBajo = calcularVolumenPlasmatico(5.0, 30);
    expect(vpBajo).toBeGreaterThan(vpAlto);
  });

  it('hematocrito 0 = toda la volemia es plasma', () => {
    const vp = calcularVolumenPlasmatico(5.0, 0);
    expect(vp).toBe(5.0);
  });
});

describe('calcularIgGResidual', () => {
  it('calcula eliminación tras sesiones', () => {
    const resultado = calcularIgGResidual(10, 1.0, 5);
    expect(resultado.igGResidual).toBeGreaterThan(0);
    expect(resultado.igGResidual).toBeLessThan(10);
    expect(resultado.porcentajeEliminacion).toBeGreaterThan(0);
  });

  it('más sesiones = más eliminación', () => {
    const r3 = calcularIgGResidual(10, 1.0, 3);
    const r5 = calcularIgGResidual(10, 1.0, 5);
    expect(r5.porcentajeEliminacion).toBeGreaterThan(r3.porcentajeEliminacion);
  });

  it('más volemias por sesión = más eliminación', () => {
    const r1 = calcularIgGResidual(10, 1.0, 5);
    const r15 = calcularIgGResidual(10, 1.5, 5);
    expect(r15.porcentajeEliminacion).toBeGreaterThan(r1.porcentajeEliminacion);
  });
});

describe('calcularReposicion', () => {
  it('albúmina 5% usa todo el volumen', () => {
    const r = calcularReposicion(3000, 'albumina5');
    expect(r.albumina5).toBe(3000);
    expect(r.pfc).toBe(0);
  });

  it('PFC usa todo el volumen', () => {
    const r = calcularReposicion(3000, 'pfc');
    expect(r.albumina5).toBe(0);
    expect(r.pfc).toBe(3000);
  });

  it('combinación reparte según porcentaje', () => {
    const r = calcularReposicion(3000, 'combinacion', 70);
    expect(r.albumina5).toBe(2100);
    expect(r.pfc).toBe(900);
    expect(r.albumina5 + r.pfc).toBe(3000);
  });
});

describe('calcularTPE', () => {
  const paramsBase = {
    peso: 70,
    altura: 170,
    sexo: 'M',
    hematocrito: 40,
    volemiasIntercambio: 1.0,
    tipoReposicion: 'albumina5',
    numSesiones: 5
  };

  it('calcula resultados completos', () => {
    const r = calcularTPE(paramsBase);
    expect(parseFloat(r.volemia)).toBeGreaterThan(0);
    expect(parseInt(r.volumenPlasmatico)).toBeGreaterThan(0);
    expect(r.volumenIntercambio).toBeGreaterThan(0);
    expect(r.numSesiones).toBe(5);
    expect(r.reposicion.albumina5).toBeGreaterThan(0);
  });

  it('incluye IgG cuando se proporciona', () => {
    const r = calcularTPE({ ...paramsBase, igGInicial: 12 });
    expect(r.igGResidual).toBeDefined();
    expect(parseFloat(r.igGResidual)).toBeLessThan(12);
    expect(parseFloat(r.porcentajeEliminacionIgG)).toBeGreaterThan(0);
  });

  it('no incluye IgG cuando no se proporciona', () => {
    const r = calcularTPE(paramsBase);
    expect(r.igGResidual).toBeUndefined();
  });

  it('volumen total serie = intercambio × sesiones', () => {
    const r = calcularTPE(paramsBase);
    expect(r.volumenTotalSerie).toBe(r.volumenIntercambio * r.numSesiones);
  });
});
