# Calculadora de Aféresis

Aplicación web React para realizar cálculos médicos relacionados con procedimientos de aféresis.

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](http://creativecommons.org/licenses/by-nc/4.0/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/tu-usuario/web-aferesis)

## Características

- **Calculadora de Volemias para CD34**: Calcula el número de volemias a procesar basado en la fórmula de Nadler
- **Calculadora de Linfoaféresis (CD3)**: Calcula el número de volemias para recolección de células CD3
- **Programación de Congelaciones**: Calcula la distribución óptima de productos en contenedores para criopreservación con DMSO
- **Interfaz minimalista**: Diseño limpio con Material-UI
- **Sistema extensible**: Fácil de agregar nuevas calculadoras
- **Reportes imprimibles**: Genera reportes HTML con todos los parámetros y resultados con referencias bibliográficas
- **Validaciones en tiempo real**: Validación de inputs con advertencias no bloqueantes

## Tecnologías

- React 18
- Material-UI (MUI) v5
- Vite
- React Router v7
- Context API para gestión de estado

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Para ejecutar en modo desarrollo:
npm run dev

# Para compilar para producción:
npm run build

# Para previsualizar la versión de producción:
npm run preview
```

## 🚀 Deployment en Cloudflare Pages

1. Conecta tu repositorio a Cloudflare Pages
2. Configuración de build:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 18 o superior

3. Los archivos `_headers` y `_redirects` en `/public` se copiarán automáticamente

### Antes de Deployment

- [ ] Actualizar URLs en `robots.txt` y `sitemap.xml` con tu dominio real
- [ ] Añadir iconos PWA en `/public/icons/` (ver README en esa carpeta)
- [ ] Revisar que todos los meta tags estén correctos en `index.html`
- [ ] Probar el build localmente: `npm run build && npm run preview`

## Estructura del proyecto

```
src/
  components/
    layout/
      TabLayout.jsx                # Sistema de pestañas extensible
    calculators/
      CD34Calculator.jsx           # Calculadora de CD34
      LinfoaferesisCalculator.jsx  # Calculadora de Linfoaféresis (CD3)
    common/
      ResultDisplay.jsx            # Visualización de resultados
      PrintReport.jsx              # Generación de reportes
  context/
    CalculatorContext.jsx          # Gestión de estado global
  utils/
    formulas/
      nadler.js                    # Fórmula de Nadler para volemia
      cd34Calculations.js          # Cálculos específicos de CD34
      cd3Calculations.js           # Cálculos específicos de CD3 (Linfoaféresis)
    validation.js                  # Validaciones de inputs
  styles/
    theme.js                       # Configuración de Material-UI
  App.jsx                          # Componente principal
  main.jsx                         # Punto de entrada
```

## Cómo agregar una nueva calculadora

1. **Crear el componente de la calculadora** en `src/components/calculators/`:

```jsx
// src/components/calculators/NuevaCalculadora.jsx
import { useCalculator } from '../../context/CalculatorContext';
import ResultDisplay from '../common/ResultDisplay';
import PrintReport from '../common/PrintReport';

export default function NuevaCalculadora() {
  const { setResults, results } = useCalculator();

  // Implementar lógica de la calculadora

  return (
    <Box>
      {/* Formulario */}
      <ResultDisplay result={results} tipo="nueva" />
      <PrintReport data={formData} result={results} tipo="nueva" />
    </Box>
  );
}
```

2. **Crear las fórmulas** en `src/utils/formulas/`:

```javascript
// src/utils/formulas/nuevaFormula.js
export function calcularNuevo(params) {
  // Implementar cálculos
  return resultado;
}
```

3. **Registrar la calculadora** en `src/App.jsx`:

```jsx
import NuevaCalculadora from './components/calculators/NuevaCalculadora';

const calculators = [
  {
    id: 'cd34',
    label: 'CD34 - Volemias',
    component: <CD34Calculator />
  },
  {
    id: 'nueva',
    label: 'Nombre de la Nueva',
    component: <NuevaCalculadora />
  }
];
```

4. **Extender ResultDisplay y PrintReport** si es necesario para el nuevo tipo de cálculo.

## Calculadoras implementadas

- ✅ **CD34 - Volemias**: Cálculo de volemias para recolección de células CD34
- ✅ **Linfoaféresis (CD3)**: Cálculo de volemias para recolección de células CD3
- ✅ **Programación de Congelaciones**: Distribución óptima en contenedores con cálculo de criopreservante (DMSO/Plasma)

## Calculadoras planificadas

- Recambio plasmático

## Validaciones implementadas

- Peso: 1-200 kg
- Altura: 50-250 cm
- CD34: Advertencia no bloqueante si <10/μL
- Eficiencia: 0-1

## Fórmulas

### Volemia de Nadler

**Hombres:**
```
V = 0.3669 × (altura_m)³ + 0.03219 × peso + 0.6041
```

**Mujeres:**
```
V = 0.3561 × (altura_m)³ + 0.03308 × peso + 0.1833
```

### Cálculo de Volemias CD34

```
CD34_totales = objetivo × peso_receptor
Volumen_procesar = (CD34_totales / concentración_CD34) × eficiencia
Volemias = Volumen_procesar / volemia_donante
```

## Advertencias

- Si el resultado es ≥4 volemias, se muestra una advertencia visual (fondo amarillo)
- Si CD34/CD3 <10/μL, se muestra advertencia pero permite continuar con el cálculo

## Referencias bibliográficas

Las siguientes referencias se incluyen automáticamente en todos los reportes generados:

- **Nadler SB, Hidalgo JH, Bloch T.** Prediction of blood volume in normal human adults. Surgery. 1962 Feb;51(2):224-32.

## 📄 Licencia

Este proyecto está licenciado bajo [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](http://creativecommons.org/licenses/by-nc/4.0/).

### Resumen de la licencia:

✅ **Permitido:**
- Compartir y redistribuir el material en cualquier medio o formato
- Adaptar, remezclar, transformar y construir sobre el material

❌ **No permitido:**
- Uso comercial del material

⚠️ **Condiciones:**
- Atribución: Debe dar crédito apropiado y proporcionar un enlace a la licencia
- NoComercial: No puede usar el material con propósitos comerciales

Para ver el texto completo de la licencia, visite:
https://creativecommons.org/licenses/by-nc/4.0/legalcode

## ⚠️ Disclaimer Médico

Esta herramienta está diseñada exclusivamente con **fines informativos y educativos**. Los resultados proporcionados **no constituyen consejo médico, diagnóstico o recomendaciones terapéuticas**.

El uso de estos cálculos debe realizarse siempre bajo la **supervisión de personal sanitario cualificado**. Las decisiones clínicas deben basarse en el juicio profesional, considerando las circunstancias específicas de cada paciente.

Este es un **proyecto personal sin garantías ni soporte**. No se asume responsabilidad por decisiones tomadas basándose únicamente en los resultados de esta calculadora.

## 📞 Contacto

Proyecto personal sin soporte garantizado. Para sugerencias o reportes de errores, el método de contacto se habilitará próximamente.

## 🔄 Versión

**Versión actual**: 1.0.0 (Enero 2025)

Ver [src/utils/constants.js](src/utils/constants.js) para el historial completo de cambios.

---

Desarrollado con ❤️ para la comunidad sanitaria
