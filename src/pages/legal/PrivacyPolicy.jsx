import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LAST_UPDATE } from '../../utils/constants';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
          POLÍTICA DE PRIVACIDAD
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          Última actualización: {LAST_UPDATE}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            2.1 Información que recopilamos
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>No se recopila ningún dato personal.</strong> La Aplicación funciona
            completamente en su navegador.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            2.2 Almacenamiento local
          </Typography>
          <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
            <li>
              <strong>SessionStorage:</strong> Para mantener el estado del disclaimer durante la
              sesión
            </li>
            <li>No se utilizan cookies ni otros mecanismos de rastreo</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            2.3 Datos de cálculos
          </Typography>
          <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
            <li>Todos los cálculos se realizan localmente en su navegador</li>
            <li>No se transmiten datos a ningún servidor</li>
            <li>Los datos se eliminan al cerrar la aplicación</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            2.4 Terceros
          </Typography>
          <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
            <li>No se comparten datos con terceros</li>
            <li>Alojamiento en Cloudflare Pages (solo archivos estáticos)</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            2.5 Contacto
          </Typography>
          <Typography variant="body1" paragraph>
            Esta es una aplicación personal sin recopilación de datos, por lo que no hay datos que
            gestionar.
          </Typography>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            size="large"
          >
            Volver a la aplicación
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
