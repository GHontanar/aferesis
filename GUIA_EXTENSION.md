# Guía de Extensión - Agregar Nuevas Calculadoras

Esta guía muestra paso a paso cómo agregar nuevas calculadoras al sistema.

## Ejemplo: Agregar Calculadora de Linfoaféresis

### 1. Crear la fórmula de cálculo

Crear archivo: `src/utils/formulas/linfoaferesisCalculations.js`

```javascript
import { calcularVolemiaNadler } from './nadler.js';

export function calcularLinfoaferesis(params) {
  const {
    pesoDonante,
    alturaDonante,
    sexoDonante,
    // ... otros parámetros específicos
  } = params;

  const volemiaDonante = calcularVolemiaNadler(pesoDonante, alturaDonante, sexoDonante);

  // Implementar cálculos específicos aquí

  return {
    volemiaDonante: volemiaDonante.toFixed(2),
    // ... otros resultados
  };
}
```

### 2. Crear el componente de la calculadora

Crear archivo: `src/components/calculators/LinfoaferesisCalculator.jsx`

```javascript
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper
} from '@mui/material';
import { useCalculator } from '../../context/CalculatorContext';
import { calcularLinfoaferesis } from '../../utils/formulas/linfoaferesisCalculations';
import ResultDisplay from '../common/ResultDisplay';
import PrintReport from '../common/PrintReport';

export default function LinfoaferesisCalculator() {
  const { setResults, results } = useCalculator();

  const [formData, setFormData] = useState({
    pesoDonante: '',
    alturaDonante: '',
    sexoDonante: 'M',
    // ... campos específicos
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalcular = () => {
    const resultado = calcularLinfoaferesis({
      pesoDonante: parseFloat(formData.pesoDonante),
      alturaDonante: parseFloat(formData.alturaDonante),
      sexoDonante: formData.sexoDonante,
      // ... convertir otros campos
    });

    setResults(resultado);
  };

  const handleReset = () => {
    setFormData({
      pesoDonante: '',
      alturaDonante: '',
      sexoDonante: 'M',
      // ... resetear campos
    });
    setResults(null);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Cálculo de Linfoaféresis
        </Typography>

        <Box component="form" sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Agregar campos del formulario */}
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleCalcular}>
              Calcular
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Limpiar
            </Button>
          </Box>
        </Box>
      </Paper>

      <ResultDisplay result={results} tipo="linfoaferesis" />
      {results && <PrintReport data={formData} result={results} tipo="linfoaferesis" />}
    </Box>
  );
}
```

### 3. Extender ResultDisplay

Editar: `src/components/common/ResultDisplay.jsx`

Agregar el caso para el nuevo tipo:

```javascript
const renderLinfoaferesisResult = () => (
  <Box>
    <Typography variant="body2" gutterBottom>
      Resultado 1: <strong>{result.valor1}</strong>
    </Typography>
    {/* Agregar visualización de otros resultados */}
  </Box>
);

// En el return del componente:
return (
  <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
    <Typography variant="h6" gutterBottom color="primary">
      Resultado del Cálculo
    </Typography>
    {tipo === 'cd34' && renderCD34Result()}
    {tipo === 'linfoaferesis' && renderLinfoaferesisResult()}
  </Paper>
);
```

### 4. Extender PrintReport

Editar: `src/components/common/PrintReport.jsx`

Agregar el template HTML para el nuevo tipo:

```javascript
if (tipo === 'linfoaferesis') {
  contenido = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>Cálculo de Linfoaféresis</h1>
      <!-- Agregar HTML del reporte -->
    </div>
  `;
}
```

### 5. Registrar la nueva calculadora

Editar: `src/App.jsx`

```javascript
import LinfoaferesisCalculator from './components/calculators/LinfoaferesisCalculator';

const calculators = [
  {
    id: 'cd34',
    label: 'CD34 - Volemias',
    component: <CD34Calculator />
  },
  {
    id: 'linfoaferesis',
    label: 'Linfoaféresis',
    component: <LinfoaferesisCalculator />
  }
];
```

### 6. Agregar validaciones (opcional)

Editar: `src/utils/validation.js`

```javascript
export const validations = {
  // ... validaciones existentes
  parametroNuevo: {
    min: 0,
    max: 100,
    mensaje: 'Debe estar entre 0 y 100'
  }
};

export function validarCamposLinfoaferesis(datos) {
  const errores = [];
  // Agregar validaciones
  return errores;
}
```

## Patrón de componentes reutilizables

Para campos comunes que se repiten, considera crear componentes:

```javascript
// src/components/common/DatosDonante.jsx
export default function DatosDonante({ formData, onChange }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="pesoDonante"
          label="Peso (kg)"
          type="number"
          value={formData.pesoDonante}
          onChange={onChange}
        />
      </Grid>
      {/* ... otros campos */}
    </Grid>
  );
}
```

Luego usar en las calculadoras:

```javascript
<DatosDonante formData={formData} onChange={handleChange} />
```

## Checklist para agregar una nueva calculadora

- [ ] Crear archivo de fórmulas en `src/utils/formulas/`
- [ ] Crear componente calculadora en `src/components/calculators/`
- [ ] Extender `ResultDisplay.jsx` con el nuevo tipo
- [ ] Extender `PrintReport.jsx` con el template HTML
- [ ] Registrar en `App.jsx`
- [ ] Agregar validaciones si es necesario
- [ ] Probar con `npm run build` que no hay errores
- [ ] Verificar visualmente con `npm run dev`

## Buenas prácticas

1. **Nomenclatura consistente**: Usar el mismo patrón de nombres en todos los archivos
2. **Validaciones claras**: Mensajes de error descriptivos
3. **Tooltips informativos**: Explicar qué representa cada campo
4. **Unidades explícitas**: Siempre mostrar las unidades en labels
5. **Valores por defecto**: Proporcionar valores razonables cuando sea posible
6. **Reutilizar componentes**: DRY (Don't Repeat Yourself)
