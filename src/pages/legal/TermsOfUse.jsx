import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LAST_UPDATE, LICENSE_FULL_NAME, LICENSE_URL } from '../../utils/constants';

export default function TermsOfUse() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
          TÉRMINOS DE USO
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          Última actualización: {LAST_UPDATE}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            1.1 Aceptación de los términos
          </Typography>
          <Typography variant="body1" paragraph>
            Al acceder y utilizar esta aplicación web de cálculos para aféresis ("la Aplicación"),
            usted acepta estos Términos de Uso. Si no está de acuerdo, no debe usar la Aplicación.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            1.2 Descripción del servicio
          </Typography>
          <Typography variant="body1" paragraph>
            La Aplicación es un proyecto personal que proporciona herramientas de cálculo para
            profesionales sanitarios relacionadas con procedimientos de aféresis.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            1.3 Uso apropiado
          </Typography>
          <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
            <li>Destinada exclusivamente a profesionales sanitarios cualificados</li>
            <li>Los cálculos son orientativos y no sustituyen el juicio clínico</li>
            <li>El usuario debe verificar todos los cálculos antes de su aplicación</li>
            <li>Prohibido el uso comercial sin autorización expresa</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            1.4 Limitación de responsabilidad
          </Typography>
          <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
            <li>La Aplicación se proporciona "tal cual" sin garantías</li>
            <li>No asumo responsabilidad por decisiones clínicas basadas en los cálculos</li>
            <li>El usuario asume toda responsabilidad por el uso de los resultados</li>
            <li>Este es un proyecto personal sin soporte garantizado</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            1.5 Propiedad intelectual
          </Typography>
          <Typography variant="body1" paragraph>
            Esta obra está licenciada bajo{' '}
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563EB', textDecoration: 'none' }}
            >
              {LICENSE_FULL_NAME}
            </a>
            . Puede compartir y adaptar el material para fines no comerciales, siempre que
            proporcione atribución adecuada.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            1.6 Modificaciones
          </Typography>
          <Typography variant="body1" paragraph>
            Me reservo el derecho de modificar estos términos o discontinuar la aplicación en
            cualquier momento.
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
