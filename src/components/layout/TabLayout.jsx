import { useState } from 'react';
import { Box, Tabs, Tab, Container, AppBar, Toolbar, Typography } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useCalculator } from '../../context/CalculatorContext';

// Registro de calculadoras - Fácilmente extensible
const calculatorRegistry = [
  {
    id: 'cd34',
    label: 'CD34 - Volemias',
    component: null // Se cargará dinámicamente
  }
  // Aquí se pueden agregar más calculadoras en el futuro:
  // {
  //   id: 'linfoaferesis',
  //   label: 'Linfoaféresis',
  //   component: LinfoaferesisCalculator
  // },
  // {
  //   id: 'recambio',
  //   label: 'Recambio Plasmático',
  //   component: RecambioPlasmaticoCalculator
  // }
];

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TabLayout({ calculators }) {
  const [tabValue, setTabValue] = useState(0);
  const { setCurrentCalculator } = useCalculator();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentCalculator(calculators[newValue].id);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar sx={{ py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LocalHospitalIcon sx={{ fontSize: 28, color: 'white', opacity: 0.9 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.02em'
              }}
            >
              Aféresis
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-flexContainer': {
                gap: 1
              }
            }}
          >
            {calculators.map((calc, index) => (
              <Tab key={calc.id} label={calc.label} />
            ))}
          </Tabs>
        </Box>

        {calculators.map((calc, index) => (
          <TabPanel key={calc.id} value={tabValue} index={index}>
            {calc.component}
          </TabPanel>
        ))}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: 'grey.50',
          borderTop: 2,
          borderColor: 'grey.200'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ fontWeight: 500 }}
          >
            Sistema de Cálculos para Aféresis - {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

// Exportar también el registro para que otros módulos puedan extenderlo
export { calculatorRegistry };
