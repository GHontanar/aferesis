import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import { CalculatorProvider } from './context/CalculatorContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import TabLayout from './components/layout/TabLayout';
import Footer from './components/layout/Footer';
import CD34Calculator from './components/calculators/CD34Calculator';
import LinfoaferesisCalculator from './components/calculators/LinfoaferesisCalculator';
import CryopreservationCalculator from './components/calculators/CryopreservationCalculator';
import DisclaimerModal from './components/common/DisclaimerModal';
import FeedbackButton from './components/common/FeedbackButton';
import TermsOfUse from './pages/legal/TermsOfUse';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import LegalNotice from './pages/legal/LegalNotice';
import NotFound from './pages/NotFound';
import { ROUTES } from './utils/constants';

// Configuración de calculadoras disponibles
const calculators = [
  {
    id: 'cd34',
    label: 'CD34 - Volemias',
    component: <CD34Calculator />
  },
  {
    id: 'linfoaferesis',
    label: 'Linfoaféresis',
    component: <LinfoaferesisCalculator />
  },
  {
    id: 'cryopreservation',
    label: 'Congelaciones',
    component: <CryopreservationCalculator />
  }
  // Agregar futuras calculadoras aquí:
  // {
  //   id: 'recambio',
  //   label: 'Recambio Plasmático',
  //   component: <RecambioPlasmaticoCalculator />
  // }
];

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Verificar si el disclaimer ya fue aceptado en esta sesión
  useEffect(() => {
    const accepted = sessionStorage.getItem('disclaimerAccepted');
    if (accepted === 'true') {
      setDisclaimerAccepted(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    sessionStorage.setItem('disclaimerAccepted', 'true');
    setDisclaimerAccepted(true);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Rutas principales */}
            <Route
              path={ROUTES.HOME}
              element={
                <>
                  <DisclaimerModal
                    open={!disclaimerAccepted}
                    onAccept={handleAcceptDisclaimer}
                  />
                  <CalculatorProvider>
                    <TabLayout calculators={calculators} />
                  </CalculatorProvider>
                  <FeedbackButton />
                </>
              }
            />

            {/* Rutas legales */}
            <Route path={ROUTES.TERMS} element={<TermsOfUse />} />
            <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
            <Route path={ROUTES.LEGAL} element={<LegalNotice />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
