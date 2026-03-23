import { describe, it, expect } from 'vitest';
import {
  calcularFlujoACD,
  calcularTasaCitrato,
  clasificarRiesgoCitrato,
  calcularCitrato
} from '../citrateCalculations.js';

describe('calcularFlujoACD', () => {
  it('calcula flujo ACD-A correctamente', () => {
    const flujo = calcularFlujoACD(60, 12); // 60 mL/min, ratio 1:12
    expect(flujo).toBe(5);
  });

  it('ratio mayor = menor flujo ACD', () => {
    const flujo10 = calcularFlujoACD(60, 10);
    const flujo16 = calcularFlujoACD(60, 16);
    expect(flujo16).toBeLessThan(flujo10);
  });
});

describe('calcularTasaCitrato', () => {
  it('calcula tasa en mg/kg/min', () => {
    const tasa = calcularTasaCitrato(5, 70); // 5 mL/min ACD, 70 kg
    // (5 × 22.0) / 70 = 110 / 70 ≈ 1.57 mg/kg/min
    expect(tasa).toBeCloseTo(1.57, 1);
  });

  it('paciente más pesado = tasa menor', () => {
    const tasaLigero = calcularTasaCitrato(5, 50);
    const tasaPesado = calcularTasaCitrato(5, 100);
    expect(tasaPesado).toBeLessThan(tasaLigero);
  });
});

describe('clasificarRiesgoCitrato', () => {
  it('clasifica riesgo bajo', () => {
    const r = clasificarRiesgoCitrato(0.5);
    expect(r.nivel).toBe('bajo');
    expect(r.color).toBe('success');
  });

  it('clasifica riesgo moderado', () => {
    const r = clasificarRiesgoCitrato(1.2);
    expect(r.nivel).toBe('moderado');
    expect(r.color).toBe('warning');
  });

  it('clasifica riesgo alto', () => {
    const r = clasificarRiesgoCitrato(2.0);
    expect(r.nivel).toBe('alto');
    expect(r.color).toBe('error');
  });

  it('límite bajo exacto es moderado', () => {
    const r = clasificarRiesgoCitrato(1.0);
    expect(r.nivel).toBe('moderado');
  });

  it('incluye recomendaciones de calcio', () => {
    const r = clasificarRiesgoCitrato(1.5);
    expect(r.recomendacionCalcio).toBeTruthy();
    expect(r.recomendacionCalcio.length).toBeGreaterThan(0);
  });
});

describe('calcularCitrato', () => {
  const paramsBase = {
    peso: 70,
    flujoEntrada: 60,
    ratioACD: 12,
    duracion: 120,
    hepatopatia: false,
    pediatrico: false
  };

  it('calcula resultados completos', () => {
    const r = calcularCitrato(paramsBase);
    expect(parseFloat(r.flujoACD)).toBeGreaterThan(0);
    expect(parseFloat(r.tasaCitrato)).toBeGreaterThan(0);
    expect(r.riesgo).toBeDefined();
    expect(r.riesgo.nivel).toBeDefined();
    expect(r.volumenTotalACD).toBeGreaterThan(0);
  });

  it('volumen total ACD = flujo × duración', () => {
    const r = calcularCitrato(paramsBase);
    expect(r.volumenTotalACD).toBe(Math.round(parseFloat(r.flujoACD) * paramsBase.duracion));
  });

  it('hepatopatía ajusta riesgo hacia arriba', () => {
    const rNormal = calcularCitrato(paramsBase);
    const rHepatopatia = calcularCitrato({ ...paramsBase, hepatopatia: true });
    if (rNormal.riesgo.nivel !== 'alto') {
      expect(rHepatopatia.riesgo.ajustadoPorFactores).toBe(true);
    }
  });

  it('factores de riesgo se reportan', () => {
    const r = calcularCitrato({ ...paramsBase, hepatopatia: true, pediatrico: true });
    expect(r.factoresRiesgo).toHaveLength(2);
  });
});
