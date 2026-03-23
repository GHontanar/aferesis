import { Typography, Box } from '@mui/material';
import { LAST_UPDATE } from '../../utils/constants';

export default function PrivacyPolicy() {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Última actualización: {LAST_UPDATE}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Información que recopilamos
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>No se recopila ningún dato personal.</strong> La aplicación funciona
          completamente en su navegador.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Almacenamiento local
        </Typography>
        <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
          <li>Se usa SessionStorage para mantener el estado del disclaimer durante la sesión</li>
          <li>No se utilizan cookies ni otros mecanismos de rastreo</li>
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Datos de cálculos
        </Typography>
        <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
          <li>Todos los cálculos se realizan localmente en su navegador</li>
          <li>No se transmiten datos a ningún servidor</li>
          <li>Los datos se eliminan al cerrar la aplicación</li>
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Terceros
        </Typography>
        <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
          <li>No se comparten datos con terceros</li>
          <li>Alojamiento en Cloudflare Pages (solo archivos estáticos)</li>
        </Typography>
      </Box>
    </Box>
  );
}
