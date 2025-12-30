import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { APP_NAME, LICENSE, LICENSE_URL } from '../../utils/constants';

export default function LegalNotice() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
          AVISO LEGAL
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            Identificación
          </Typography>
          <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
            <li>
              <strong>Aplicación:</strong> {APP_NAME}
            </li>
            <li>
              <strong>Tipo:</strong> Proyecto personal sin ánimo de lucro
            </li>
            <li>
              <strong>Hosting:</strong> Cloudflare Pages
            </li>
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            Finalidad
          </Typography>
          <Typography variant="body1" paragraph>
            Herramienta de cálculo para profesionales sanitarios en procedimientos de aféresis,
            ofrecida como recurso educativo y de apoyo.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            Exención de responsabilidad
          </Typography>
          <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
            <li>
              <strong>NO sustituye</strong> el juicio clínico profesional
            </li>
            <li>Los resultados son orientativos</li>
            <li>Sin garantía de exactitud absoluta</li>
            <li>Sin responsabilidad por uso clínico</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            Licencia
          </Typography>
          <Typography variant="body1" paragraph>
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563EB', textDecoration: 'none' }}
            >
              {LICENSE}
            </a>{' '}
            - Uso no comercial con atribución.
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
