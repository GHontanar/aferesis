import { Box, Typography, Paper } from '@mui/material';
import { CHANGELOG } from '../../utils/constants';

export default function Changelog() {
  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
        Historial de Versiones
      </Typography>

      {CHANGELOG.map((release, index) => (
        <Box key={index} sx={{ mb: index < CHANGELOG.length - 1 ? 3 : 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 2,
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} color="primary.main">
              v{release.version}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {release.date}
            </Typography>
          </Box>

          <Box component="ul" sx={{ pl: 3, mt: 1 }}>
            {release.changes.map((change, idx) => (
              <Typography key={idx} component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {change}
              </Typography>
            ))}
          </Box>
        </Box>
      ))}
    </Paper>
  );
}
