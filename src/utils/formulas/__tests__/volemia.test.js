import { describe, it, expect } from 'vitest';
import { calcularVolemia, calcularVolemiaPediatrica } from '../volemia.js';
import { calcularVolemiaNadler } from '../nadler.js';
import { FRANJAS_VOLEMIA_PEDIATRICA, ID_FRANJA_ADULTO } from '../../data/volemiaPediatrica.js';

describe('calcularVolemiaPediatrica', () => {
  const casos = [
    { franja: 'pretermino', mlKgEsperado: 95, rangoEsperado: '90–100' },
    { franja: 'termino', mlKgEsperado: 85, rangoEsperado: '80–90' },
    { franja: 'lactante', mlKgEsperado: 75, rangoEsperado: '70–80' },
    { franja: 'mayor2', mlKgEsperado: 70, rangoEsperado: '70' },
    { franja: 'obeso', mlKgEsperado: 62.5, rangoEsperado: '60–65' }
  ];

  casos.forEach(({ franja, mlKgEsperado, rangoEsperado }) => {
    it(`franja ${franja}: usa el valor medio del rango (${mlKgEsperado} mL/kg)`, () => {
      const r = calcularVolemiaPediatrica(10, franja);
      expect(r.mlKg).toBe(mlKgEsperado);
      expect(r.volemia).toBeCloseTo(10 * mlKgEsperado / 1000, 10);
      expect(r.rangoMlKg).toBe(rangoEsperado);
      expect(r.franja.id).toBe(franja);
    });
  });

  it('volemia en litros: neonato a término de 3 kg', () => {
    const r = calcularVolemiaPediatrica(3, 'termino');
    expect(r.volemia).toBeCloseTo(3 * 85 / 1000, 10); // 0.255 L
  });

  it('devuelve null si la franja no existe', () => {
    expect(calcularVolemiaPediatrica(10, 'noexiste')).toBeNull();
  });

  it('la tabla contiene las 5 franjas de la petición clínica', () => {
    expect(FRANJAS_VOLEMIA_PEDIATRICA.map(f => f.id)).toEqual([
      'pretermino', 'termino', 'lactante', 'mayor2', 'obeso'
    ]);
    FRANJAS_VOLEMIA_PEDIATRICA.forEach(f => {
      expect(f.mlKgMin).toBeLessThanOrEqual(f.mlKgMax);
      expect(f.label).toBeTruthy();
    });
  });
});

describe('calcularVolemia', () => {
  it('sin franja usa Nadler', () => {
    const r = calcularVolemia({ peso: 70, altura: 170, sexo: 'M' });
    expect(r.metodo).toBe('nadler');
    expect(r.volemia).toBe(calcularVolemiaNadler(70, 170, 'M'));
  });

  it('franja adulto usa Nadler', () => {
    const r = calcularVolemia({ peso: 60, altura: 160, sexo: 'F', franjaVolemia: ID_FRANJA_ADULTO });
    expect(r.metodo).toBe('nadler');
    expect(r.volemia).toBe(calcularVolemiaNadler(60, 160, 'F'));
  });

  it('franja pediátrica calcula por peso e ignora altura y sexo', () => {
    const conDatos = calcularVolemia({ peso: 3, altura: 50, sexo: 'M', franjaVolemia: 'termino' });
    const sinDatos = calcularVolemia({ peso: 3, franjaVolemia: 'termino' });
    expect(conDatos.metodo).toBe('pediatrico');
    expect(conDatos.volemia).toBe(sinDatos.volemia);
    expect(conDatos.mlKg).toBe(85);
    expect(conDatos.rangoMlKg).toBe('80–90');
    expect(conDatos.franjaLabel).toBe('Recién nacido a término (hasta 3 meses)');
  });

  it('cada franja pediátrica devuelve su método y datos', () => {
    FRANJAS_VOLEMIA_PEDIATRICA.forEach(franja => {
      const r = calcularVolemia({ peso: 8, franjaVolemia: franja.id });
      expect(r.metodo).toBe('pediatrico');
      expect(r.volemia).toBeCloseTo(8 * (franja.mlKgMin + franja.mlKgMax) / 2 / 1000, 10);
    });
  });

  it('lanza error si la franja indicada no existe', () => {
    expect(() => calcularVolemia({ peso: 10, franjaVolemia: 'inventada' })).toThrow('Franja de volemia desconocida');
  });
});
