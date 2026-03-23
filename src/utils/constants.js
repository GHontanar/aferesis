// Información de la aplicación
export const APP_VERSION = '2.0.0';
export const LAST_UPDATE = 'Marzo 2026';
export const APP_NAME = 'Calculadora de Aféresis';
export const APP_SHORT_NAME = 'CalcAféresis';
export const APP_DESCRIPTION = 'Herramienta de cálculo para procedimientos de aféresis';

// Rutas legales
export const ROUTES = {
  HOME: '/',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  LEGAL: '/legal',
};

// Estimación CD3 desde linfocitos
export const CD3_ESTIMATION = {
  DEFAULT_PERCENTAGE: 70,
  MIN_PERCENTAGE: 40,
  MAX_PERCENTAGE: 90,
  WARNING_LOW: 50,
  WARNING_HIGH: 85,
};

// Recambio plasmático terapéutico
export const TPE = {
  DEFAULT_VOLEMIAS: 1.0,
  MIN_VOLEMIAS: 0.5,
  MAX_VOLEMIAS: 2.0,
  REPOSICION_TIPOS: ['albumina5', 'pfc', 'combinacion'],
  DEFAULT_SESIONES: 5,
  MIN_SESIONES: 1,
  MAX_SESIONES: 20,
};

// Eritrocitaféresis
export const RCE = {
  DEFAULT_HCT_CH: 60,
  MIN_HCT_CH: 50,
  MAX_HCT_CH: 80,
  VOL_UNIDAD_CH: 280,
};

// Citrato / Anticoagulante
export const CITRATE = {
  ACD_A_CITRATO_CONCENTRACION: 22.0,
  RIESGO_BAJO_MAX: 1.0,
  RIESGO_MODERADO_MAX: 1.8,
  DEFAULT_RATIO: 12,
  MIN_RATIO: 8,
  MAX_RATIO: 20,
};

// DLI - Infusión de linfocitos del donante
export const DLI = {
  ESCALAS_PREDEFINIDAS: [
    { nombre: 'Estándar', dosis: [1e6, 5e6, 1e7, 5e7, 1e8] },
    { nombre: 'Conservadora', dosis: [1e5, 5e5, 1e6, 5e6, 1e7] },
    { nombre: 'Agresiva', dosis: [1e7, 5e7, 1e8, 5e8] },
  ],
};

// Changelog
export const CHANGELOG = [
  {
    version: '2.0.0',
    date: 'Marzo 2026',
    changes: [
      'Linfoaféresis: modo por kg y producto total (CAR-T)',
      'Linfoaféresis: estimación CD3 desde hemograma',
      'Nueva calculadora: Recambio Plasmático Terapéutico (TPE)',
      'Nueva calculadora: Eritrocitaféresis (RCE)',
      'Nueva calculadora: Citrato / Anticoagulante',
      'Nueva calculadora: DLI (Infusión de Linfocitos del Donante)',
      'Mejoras UX en tab de Congelaciones',
      'Navegación por categorías con 7 calculadoras',
    ],
  },
  {
    version: '1.0.0',
    date: 'Enero 2025',
    changes: [
      'Lanzamiento inicial de la aplicación',
      'Calculadora CD34 - Volemias',
      'Calculadora de Linfoaféresis (CD3)',
      'Programación de Congelaciones',
      'Sistema de disclaimer y avisos legales',
      'Diseño moderno y responsive',
    ],
  },
];

// Meta información
export const META = {
  description: 'Calculadora gratuita para procedimientos de aféresis: CD34, CD3, TPE, eritrocitaféresis, citrato, DLI, criopreservación. Herramienta para profesionales sanitarios.',
  keywords: 'aféresis, CD34, CD3, TPE, eritrocitaféresis, citrato, DLI, hematología, calculadora médica, volemias, criopreservación',
  author: 'Calculadora de Aféresis',
  type: 'website',
};
