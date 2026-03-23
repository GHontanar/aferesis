import { useState } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCalculator } from '../../context/CalculatorContext';
import { APP_NAME } from '../../utils/constants';

const CARD_DESCRIPTIONS = {
  cd34: 'Volemias para recolección de progenitores hematopoyéticos',
  linfoaferesis: 'Volemias para recolección de linfocitos CD3',
  tpe: 'Volumen plasmático, líquido de reposición y eliminación de IgG',
  rce: 'Volumen de intercambio y unidades de concentrado de hematíes',
  citrate: 'Tasa de citrato, riesgo de toxicidad y suplementación de calcio',
  cryopreservation: 'Distribución en contenedores con DMSO/plasma',
  dli: 'Esquema de escalada de dosis y volúmenes de descongelación',
};

export default function TabLayout({ calculators }) {
  const [selectedCalc, setSelectedCalc] = useState(null);
  const { setCurrentCalculator } = useCalculator();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSelect = (calc) => {
    setSelectedCalc(calc);
    setCurrentCalculator(calc.id);
  };

  const handleBack = () => {
    setSelectedCalc(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Toolbar
          sx={{
            py: 1,
            px: isMobile ? 1.5 : 3,
            minHeight: isMobile ? 48 : 56,
          }}
        >
          <Typography
            variant="body1"
            component="h1"
            onClick={selectedCalc ? handleBack : undefined}
            sx={{
              fontWeight: 700,
              color: 'grey.800',
              fontSize: isMobile ? 15 : 17,
              cursor: selectedCalc ? 'pointer' : 'default',
              '&:hover': selectedCalc ? { color: 'primary.main' } : {},
            }}
          >
            {APP_NAME}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          mt: isMobile ? 2 : 5,
          mb: isMobile ? 2 : 5,
          px: isMobile ? 2 : 3,
          flex: 1,
        }}
      >
        {selectedCalc ? (
          <Box>{selectedCalc.component}</Box>
        ) : (
          <Grid container spacing={{ xs: 1.5, md: 3 }}>
            {calculators.map((calc) => (
              <Grid item xs={6} md={4} key={calc.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: 'grey.400',
                      bgcolor: 'grey.50',
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleSelect(calc)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: 'grey.800',
                          mb: { xs: 0.5, md: 1 },
                          fontSize: { xs: 15, md: 20 },
                        }}
                      >
                        {calc.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'grey.500',
                          lineHeight: 1.5,
                          fontSize: { xs: 12, md: 15 },
                        }}
                      >
                        {CARD_DESCRIPTIONS[calc.id]}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
