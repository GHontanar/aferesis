import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalculatorProvider } from '../../../context/CalculatorContext';
import CryopreservationCalculator from '../CryopreservationCalculator';

function renderWizard() {
  render(
    <CalculatorProvider>
      <CryopreservationCalculator />
    </CalculatorProvider>
  );
}

function rellenarPaso1({ volumen = '100', cd34 = '1000', leucos = '400000', peso = '70' } = {}) {
  const set = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
  set(/Volumen inicial de aféresis/, volumen);
  set(/Concentración de CD34/, cd34);
  set(/Concentración de leucocitos/, leucos);
  set(/Peso del receptor/, peso);
  fireEvent.click(screen.getByRole('button', { name: /Siguiente/ }));
}

describe('CryopreservationCalculator — dilución', () => {
  it('propone diluir cuando el producto supera la concentración máxima', () => {
    renderWizard();
    rellenarPaso1();

    expect(screen.getByText(/supera la concentración\s+máxima/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Concentrar el producto/)).not.toBeInTheDocument();
    // 100 ml × 400000 / 250000 = 160 ml → +60 ml de medio
    expect(screen.getByLabelText(/Volumen tras dilución/)).toHaveValue(160);
    expect(screen.getByText(/Medio de dilución a añadir/).textContent).toContain('60.00 ml');
    expect(screen.getByText(/Factor de dilución/).textContent).toContain('1.60x');
  });

  it('recalcula al aumentar el volumen diluido y bloquea valores por debajo del mínimo', () => {
    renderWizard();
    rellenarPaso1();

    const input = screen.getByLabelText(/Volumen tras dilución/);
    fireEvent.change(input, { target: { value: '200' } });
    expect(screen.getByText(/Medio de dilución a añadir/).textContent).toContain('100.00 ml');

    fireEvent.change(input, { target: { value: '120' } });
    fireEvent.click(screen.getAllByRole('button', { name: /Siguiente/ })[1]);
    expect(screen.getByText(/Volumen tras dilución debe ser al menos 160.00 ml/)).toBeInTheDocument();
  });

  it('muestra el DMSO estimado y avisa si supera el límite por kg', () => {
    renderWizard();
    rellenarPaso1({ peso: '20' });
    // Total 320 ml − 4 ml reservados = 316 ml → 31.6 ml DMSO / 20 kg = 1.58 ml/kg
    expect(screen.getByText(/Supera el límite de 1 ml\/kg\/día/)).toBeInTheDocument();
    expect(screen.getAllByText(/Circular of Information/).length).toBeGreaterThan(0);
  });

  it('mantiene el flujo de concentrar si no hace falta diluir', () => {
    renderWizard();
    rellenarPaso1({ leucos: '100000' });

    expect(screen.queryByLabelText(/Volumen tras dilución/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Concentrar el producto/)).toBeInTheDocument();
    expect(screen.getByText(/Dentro del límite de 1 ml\/kg\/día/)).toBeInTheDocument();
  });

  it('calcula la distribución completa con dilución y DMSO por contenedor', () => {
    renderWizard();
    rellenarPaso1();
    fireEvent.click(screen.getAllByRole('button', { name: /Siguiente/ })[1]);
    fireEvent.click(screen.getByRole('button', { name: /Calcular/ }));

    expect(screen.getByText(/Producto diluido:/).textContent).toContain('160 ml');
    expect(screen.getByText(/DMSO total a infundir/)).toBeInTheDocument();
    expect(screen.getByText('DMSO/ud (ml/kg)')).toBeInTheDocument();
  });
});
