import { describe, it, expect } from 'vitest';
import { calcularVolemiaNadler } from '../nadler.js';

describe('calcularVolemiaNadler', () => {
  it('calcula volemia para hombre adulto estándar', () => {
    const resultado = calcularVolemiaNadler(70, 170, 'M');
    expect(resultado).toBeGreaterThan(4);
    expect(resultado).toBeLessThan(6);
  });

  it('calcula volemia para mujer adulta estándar', () => {
    const resultado = calcularVolemiaNadler(60, 160, 'F');
    expect(resultado).toBeGreaterThan(3);
    expect(resultado).toBeLessThan(5);
  });

  it('volemia masculina mayor que femenina con mismos parámetros', () => {
    const volemiaM = calcularVolemiaNadler(70, 170, 'M');
    const volemiaF = calcularVolemiaNadler(70, 170, 'F');
    expect(volemiaM).toBeGreaterThan(volemiaF);
  });

  it('volemia aumenta con el peso', () => {
    const volemiaLigero = calcularVolemiaNadler(50, 170, 'M');
    const volemiaPesado = calcularVolemiaNadler(100, 170, 'M');
    expect(volemiaPesado).toBeGreaterThan(volemiaLigero);
  });

  it('volemia aumenta con la altura', () => {
    const volemiaBaja = calcularVolemiaNadler(70, 150, 'M');
    const volemiaAlta = calcularVolemiaNadler(70, 190, 'M');
    expect(volemiaAlta).toBeGreaterThan(volemiaBaja);
  });
});
