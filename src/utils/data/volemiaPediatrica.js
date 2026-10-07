/**
 * Tabla de volemia estimada por peso (mL/kg) en pacientes pediátricos.
 *
 * NOTA CLÍNICA: contenido orientativo pendiente de validación bibliográfica
 * por el especialista antes de publicarse (ver AGENTS.md).
 */

export const FRANJAS_VOLEMIA_PEDIATRICA = [
  { id: 'pretermino', label: 'Recién nacido pretérmino', mlKgMin: 90, mlKgMax: 100 },
  { id: 'termino', label: 'Recién nacido a término (hasta 3 meses)', mlKgMin: 80, mlKgMax: 90 },
  { id: 'lactante', label: 'Lactante (3 meses a 2 años)', mlKgMin: 70, mlKgMax: 80 },
  { id: 'mayor2', label: 'Niño mayor de 2 años', mlKgMin: 70, mlKgMax: 70 },
  { id: 'obeso', label: 'Niño con obesidad', mlKgMin: 60, mlKgMax: 65 },
];

export const ID_FRANJA_ADULTO = 'adulto';

export const NOTA_FUENTE_VOLEMIA = 'Volemia pediátrica estimada por peso (mL/kg). Tabla clínica pendiente de validación bibliográfica por el especialista.';
