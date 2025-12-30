import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={2}
        sx={{
          p: 6,
          textAlign: 'center',
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #F9FAFB 100%)',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />

        <Typography variant="h2" gutterBottom fontWeight={700} color="primary.main">
          404
        </Typography>

        <Typography variant="h5" gutterBottom fontWeight={600} color="text.primary">
          Página no encontrada
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph sx={{ mt: 2 }}>
          La página que buscas no existe o ha sido movida.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
