import { describe, it, expect } from 'vitest';
import {
  validarRango,
  validarCamposCD34,
  validarCamposCD3,
  validarCamposTPE,
  validarCamposRCE,
  validarCamposCitrato,
  validarCamposDLI
} from '../validation.js';

describe('validarRango', () => {
  it('acepta valor dentro del rango', () => {
    expect(validarRango(50, 1, 200)).toBe(true);
  });

  it('acepta valor en el límite', () => {
    expect(validarRango(1, 1, 200)).toBe(true);
    expect(validarRango(200, 1, 200)).toBe(true);
  });

  it('rechaza valor fuera de rango', () => {
    expect(validarRango(0, 1, 200)).toBe(false);
    expect(validarRango(201, 1, 200)).toBe(false);
  });

  it('rechaza NaN', () => {
    expect(validarRango('abc', 1, 200)).toBe(false);
  });

  it('acepta string numérico', () => {
    expect(validarRango('50', 1, 200)).toBe(true);
  });
});

describe('validarCamposCD34', () => {
  const datosValidos = {
    pesoDonante: '70',
    alturaDonante: '170',
    sexoDonante: 'M',
    pesoReceptor: '70',
    objetivoCD34: '5',
    concentracionCD34: '20',
    eficiencia: '0.4'
  };

  it('acepta datos válidos', () => {
    expect(validarCamposCD34(datosValidos)).toHaveLength(0);
  });

  it('rechaza peso fuera de rango', () => {
    const errores = validarCamposCD34({ ...datosValidos, pesoDonante: '300' });
    expect(errores.length).toBeGreaterThan(0);
  });

  it('rechaza eficiencia > 1', () => {
    const errores = validarCamposCD34({ ...datosValidos, eficiencia: '1.5' });
    expect(errores.length).toBeGreaterThan(0);
  });

  it('rechaza campos vacíos', () => {
    const errores = validarCamposCD34({});
    expect(errores.length).toBeGreaterThan(0);
  });
});

describe('validarCamposCD3', () => {
  const datosValidos = {
    pesoDonante: '70',
    alturaDonante: '170',
    sexoDonante: 'M',
    pesoReceptor: '70',
    objetivoCD3: '2',
    concentracionCD3: '1000',
    eficiencia: '0.4',
    modoObjetivo: 'porKg',
    fuenteCD3: 'directo'
  };

  it('acepta datos válidos modo porKg', () => {
    expect(validarCamposCD3(datosValidos)).toHaveLength(0);
  });

  it('no requiere pesoReceptor en modo totalProducto', () => {
    const datos = { ...datosValidos, modoObjetivo: 'totalProducto', pesoReceptor: '' };
    const errores = validarCamposCD3(datos);
    const tieneErrorPeso = errores.some(e => e.includes('Peso del receptor'));
    expect(tieneErrorPeso).toBe(false);
  });

  it('requiere linfocitosTotales en modo estimación', () => {
    const datos = {
      ...datosValidos,
      fuenteCD3: 'estimacion',
      linfocitosTotales: ''
    };
    const errores = validarCamposCD3(datos);
    expect(errores.some(e => e.includes('Linfocitos'))).toBe(true);
  });

  it('acepta estimación con linfocitos válidos', () => {
    const datos = {
      ...datosValidos,
      fuenteCD3: 'estimacion',
      linfocitosTotales: '2000',
      concentracionCD3: '1400' // estimado
    };
    expect(validarCamposCD3(datos)).toHaveLength(0);
  });
});

describe('validarCamposTPE', () => {
  const datosValidos = {
    peso: '70',
    altura: '170',
    sexo: 'M',
    hematocrito: '40',
    volemiasIntercambio: '1.0',
    tipoReposicion: 'albumina5',
    numSesiones: '5'
  };

  it('acepta datos válidos', () => {
    expect(validarCamposTPE(datosValidos)).toHaveLength(0);
  });

  it('rechaza hematocrito fuera de rango', () => {
    const errores = validarCamposTPE({ ...datosValidos, hematocrito: '80' });
    expect(errores.length).toBeGreaterThan(0);
  });
});

describe('validarCamposRCE', () => {
  const datosValidos = {
    peso: '70',
    altura: '170',
    sexo: 'M',
    hctInicial: '30',
    hbSInicial: '80',
    hbSObjetivo: '30',
    hctCH: '60'
  };

  it('acepta datos válidos', () => {
    expect(validarCamposRCE(datosValidos)).toHaveLength(0);
  });

  it('rechaza HbS objetivo >= HbS inicial', () => {
    const errores = validarCamposRCE({ ...datosValidos, hbSObjetivo: '90' });
    expect(errores.some(e => e.includes('menor'))).toBe(true);
  });
});

describe('validarCamposCitrato', () => {
  it('acepta datos válidos', () => {
    const errores = validarCamposCitrato({ peso: '70', flujoEntrada: '60', ratioACD: '12' });
    expect(errores).toHaveLength(0);
  });

  it('rechaza ratio < 1', () => {
    const errores = validarCamposCitrato({ peso: '70', flujoEntrada: '60', ratioACD: '0' });
    expect(errores.length).toBeGreaterThan(0);
  });
});

describe('validarCamposDLI', () => {
  it('acepta datos válidos', () => {
    const errores = validarCamposDLI({
      volumenProducto: '50',
      concentracionCD3: '5000',
      pesoReceptor: '70',
      dosisInicial: '1000000',
      numDosis: '5'
    });
    expect(errores).toHaveLength(0);
  });

  it('rechaza campos vacíos', () => {
    const errores = validarCamposDLI({});
    expect(errores.length).toBeGreaterThan(0);
  });
});
