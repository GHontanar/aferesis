import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { APP_NAME } from '../../utils/constants';
import TermsOfUse from '../../pages/legal/TermsOfUse';
import PrivacyPolicy from '../../pages/legal/PrivacyPolicy';
import LegalNotice from '../../pages/legal/LegalNotice';

const LEGAL_PAGES = {
  terms: { title: 'Términos de uso', component: TermsOfUse },
  privacy: { title: 'Política de privacidad', component: PrivacyPolicy },
  legal: { title: 'Aviso legal', component: LegalNotice },
};

export default function Footer() {
  const [openDialog, setOpenDialog] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const activePage = openDialog ? LEGAL_PAGES[openDialog] : null;
  const ActiveComponent = activePage?.component;

  return (
    <>
      <Box
        component="footer"
        sx={{
          py: isMobile ? 1.5 : 2,
          px: isMobile ? 2 : 3,
          mt: 'auto',
          borderTop: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: isMobile ? 1 : 0,
            }}
          >
            <Typography variant="caption" sx={{ color: 'grey.400' }}>
              © 2026 {APP_NAME}. Todos los derechos reservados.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {[
                { label: 'Términos', key: 'terms' },
                { label: 'Privacidad', key: 'privacy' },
                { label: 'Aviso legal', key: 'legal' },
              ].map(({ label, key }) => (
                <MuiLink
                  key={key}
                  component="button"
                  variant="caption"
                  onClick={() => setOpenDialog(key)}
                  sx={{
                    color: 'grey.500',
                    textDecoration: 'none',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': { color: 'grey.700' },
                  }}
                >
                  {label}
                </MuiLink>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Dialog legal */}
      <Dialog
        open={openDialog !== null}
        onClose={() => setOpenDialog(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {activePage && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {activePage.title}
              </Typography>
              <IconButton onClick={() => setOpenDialog(null)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ pt: 2 }}>
              <ActiveComponent />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
