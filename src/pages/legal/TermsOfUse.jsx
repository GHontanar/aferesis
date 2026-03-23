import { Typography, Box } from '@mui/material';
import { LAST_UPDATE } from '../../utils/constants';

export default function TermsOfUse() {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Última actualización: {LAST_UPDATE}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Aceptación de los términos
        </Typography>
        <Typography variant="body2" paragraph>
          Al acceder y utilizar esta aplicación web de cálculos para aféresis,
          usted acepta estos Términos de Uso. Si no está de acuerdo, no debe usar la aplicación.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Descripción del servicio
        </Typography>
        <Typography variant="body2" paragraph>
          Proyecto personal que proporciona herramientas de cálculo orientativas para
          profesionales sanitarios en procedimientos de aféresis.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Uso apropiado
        </Typography>
        <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
          <li>Destinada exclusivamente a profesionales sanitarios cualificados</li>
          <li>Los cálculos son orientativos y no sustituyen el juicio clínico</li>
          <li>El usuario debe verificar todos los resultados antes de su aplicación</li>
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Limitación de responsabilidad
        </Typography>
        <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
          <li>La aplicación se proporciona "tal cual" sin garantías de ningún tipo</li>
          <li>No se asume responsabilidad por decisiones clínicas basadas en los cálculos</li>
          <li>El usuario asume toda responsabilidad por el uso de los resultados</li>
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Propiedad intelectual
        </Typography>
        <Typography variant="body2" paragraph>
          Todos los derechos reservados. Queda prohibida la reproducción, distribución
          o modificación total o parcial sin autorización expresa.
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Modificaciones
        </Typography>
        <Typography variant="body2">
          Se reserva el derecho de modificar estos términos o discontinuar la aplicación en
          cualquier momento sin previo aviso.
        </Typography>
      </Box>
    </Box>
  );
}
