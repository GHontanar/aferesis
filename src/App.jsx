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
import TPECalculator from './components/calculators/TPECalculator';
import RCECalculator from './components/calculators/RCECalculator';
// import CitrateCalculator from './components/calculators/CitrateCalculator';
// import DLICalculator from './components/calculators/DLICalculator';
import DisclaimerModal from './components/common/DisclaimerModal';
import FeedbackButton from './components/common/FeedbackButton';
import NotFound from './pages/NotFound';

const calculators = [
  { id: 'cd34', label: 'CD34 - Volemias', component: <CD34Calculator /> },
  { id: 'linfoaferesis', label: 'Linfoaféresis', component: <LinfoaferesisCalculator /> },
  { id: 'tpe', label: 'Recambio Plasmático', component: <TPECalculator /> },
  { id: 'rce', label: 'Eritrocitaféresis', component: <RCECalculator /> },
  // { id: 'citrate', label: 'Citrato', component: <CitrateCalculator /> },
  { id: 'cryopreservation', label: 'Congelaciones', component: <CryopreservationCalculator /> },
  // { id: 'dli', label: 'DLI', component: <DLICalculator /> },
];

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

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
            <Route
              path="/"
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

            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
