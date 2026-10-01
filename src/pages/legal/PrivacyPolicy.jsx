import { Typography, Box } from '@mui/material';
import { PRIVACY_LAST_UPDATE } from '../../utils/constants';

export default function PrivacyPolicy() {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Última actualización: {PRIVACY_LAST_UPDATE}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Información que recopilamos
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Las calculadoras no recopilan ningún dato personal.</strong> Funcionan
          completamente en su navegador.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Formulario de feedback
        </Typography>
        <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
          <li>
            Si envía feedback, se transmiten el tipo, el mensaje, la página desde la que se envía y,
            solo si lo indica, su email
          </li>
          <li>Se reciben por correo electrónico y se usan exclusivamente para mejorar la aplicación</li>
          <li>El email, si lo facilita, se usa únicamente para responderle</li>
          <li>
            El envío se realiza a través de Resend (proveedor de correo electrónico)
          </li>
          <li>
            <strong>No incluya datos de pacientes</strong> ni información que permita identificarlos
          </li>
          <li>
            Puede solicitar el acceso o la eliminación de sus mensajes escribiendo a
            privacidad@ghontanar.com
          </li>
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
          <li>Los datos de los cálculos no se transmiten a ningún servidor</li>
          <li>Los datos se eliminan al cerrar la aplicación</li>
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Terceros
        </Typography>
        <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
          <li>No se comparten datos con terceros salvo lo indicado para el feedback</li>
          <li>Alojamiento en Cloudflare Pages</li>
          <li>Envío de los mensajes de feedback mediante Resend</li>
        </Typography>
      </Box>
    </Box>
  );
}
