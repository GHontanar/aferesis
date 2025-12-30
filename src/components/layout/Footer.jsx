import { Box, Container, Typography, Link as MuiLink, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  APP_NAME,
  APP_VERSION,
  LICENSE,
  LICENSE_URL,
  ROUTES,
} from '../../utils/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        bgcolor: 'grey.50',
        borderTop: 2,
        borderColor: 'grey.200',
      }}
    >
      <Container maxWidth="lg">
        {/* Main footer content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: 3,
            mb: 3,
          }}
        >
          {/* App info */}
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {APP_NAME}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Versión {APP_VERSION}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Herramienta de cálculo para procedimientos de aféresis
            </Typography>
          </Box>

          {/* Legal links */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <MuiLink
                component={Link}
                to={ROUTES.TERMS}
                color="text.secondary"
                underline="hover"
                sx={{ fontSize: '0.875rem' }}
              >
                Términos de Uso
              </MuiLink>
              <MuiLink
                component={Link}
                to={ROUTES.PRIVACY}
                color="text.secondary"
                underline="hover"
                sx={{ fontSize: '0.875rem' }}
              >
                Política de Privacidad
              </MuiLink>
              <MuiLink
                component={Link}
                to={ROUTES.LEGAL}
                color="text.secondary"
                underline="hover"
                sx={{ fontSize: '0.875rem' }}
              >
                Aviso Legal
              </MuiLink>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Bottom row: Copyright and License */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} {APP_NAME} - Proyecto Personal
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Licencia:
            </Typography>
            <MuiLink
              href={LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer license"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <img
                src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc.svg"
                alt="CC BY-NC 4.0"
                style={{ height: '20px' }}
              />
              <Typography variant="body2" fontWeight={500}>
                {LICENSE}
              </Typography>
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
