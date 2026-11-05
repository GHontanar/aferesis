import { Typography, Box } from '@mui/material';
import { APP_NAME, OWNER_NAME, CONTACT_EMAIL } from '../../utils/constants';

export default function LegalNotice() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Identificación
        </Typography>
        <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
          <li><strong>Titular:</strong> {OWNER_NAME}</li>
          <li><strong>Contacto:</strong> {CONTACT_EMAIL}</li>
          <li><strong>Aplicación:</strong> {APP_NAME}</li>
          <li><strong>Tipo:</strong> Proyecto personal sin ánimo de lucro</li>
          <li><strong>Hosting:</strong> Cloudflare Pages</li>
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Finalidad
        </Typography>
        <Typography variant="body2" paragraph>
          Herramienta de cálculo orientativa para profesionales sanitarios en procedimientos
          de aféresis, ofrecida como recurso educativo y de apoyo.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Exención de responsabilidad
        </Typography>
        <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
          <li>No sustituye el juicio clínico profesional</li>
          <li>Los resultados son orientativos, sin garantía de exactitud absoluta</li>
          <li>Sin responsabilidad por el uso clínico de los resultados</li>
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Propiedad intelectual
        </Typography>
        <Typography variant="body2">
          © 2026 {OWNER_NAME}. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
}
