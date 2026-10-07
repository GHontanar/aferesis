import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { FRANJAS_VOLEMIA_PEDIATRICA, ID_FRANJA_ADULTO } from '../../utils/data/volemiaPediatrica.js';

function rangoLabel(franja) {
  return franja.mlKgMin === franja.mlKgMax
    ? `${franja.mlKgMin} mL/kg`
    : `${franja.mlKgMin}–${franja.mlKgMax} mL/kg`;
}

export function descripcionFranjaVolemia(franjaId) {
  const franja = FRANJAS_VOLEMIA_PEDIATRICA.find(f => f.id === franjaId);
  if (!franja) return null;
  const mlKgMedio = (franja.mlKgMin + franja.mlKgMax) / 2;
  return `Volemia estimada por peso: ${rangoLabel(franja)} (valor medio ${mlKgMedio} mL/kg). La altura y el sexo no se utilizan.`;
}

export default function VolemiaGrupoEdadSelect({
  value,
  onChange,
  label = 'Grupo de edad (volemia)',
  helperText
}) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select name="franjaVolemia" value={value} onChange={onChange} label={label}>
        <MenuItem value={ID_FRANJA_ADULTO}>Adulto — fórmula de Nadler</MenuItem>
        {FRANJAS_VOLEMIA_PEDIATRICA.map(franja => (
          <MenuItem key={franja.id} value={franja.id}>
            {franja.label} ({rangoLabel(franja)})
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
