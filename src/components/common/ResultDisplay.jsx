import {
  Box,
  Paper,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

export default function ResultDisplay({ result, tipo = 'cd34', formData }) {
  if (!result) return null;

  const renderCD34Result = () => (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Volemia del donante: <strong style={{ color: '#1E40AF' }}>{result.volemiaDonante} L</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          CD34 totales requeridas: <strong style={{ color: '#1E40AF' }}>{result.cd34Totales} millones</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Volumen a procesar: <strong style={{ color: '#1E40AF' }}>{result.volumenProcesar} L</strong>
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mt: 3,
          background: result.advertencia
            ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
            : 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
          textAlign: 'center',
          border: '2px solid',
          borderColor: result.advertencia ? '#F59E0B' : '#10B981',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      >
        <Typography variant="h4" fontWeight={700} color={result.advertencia ? '#92400E' : '#065F46'}>
          Volemias a procesar: {result.volemias}
        </Typography>
      </Paper>

      {result.advertencia && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          El procedimiento requiere procesar 4 o más volemias. Evaluar con precaución.
        </Alert>
      )}
    </Box>
  );

  const renderLinfoaferesisResult = () => (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Volemia del donante: <strong style={{ color: '#1E40AF' }}>{result.volemiaDonante} L</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          CD3 totales requeridas: <strong style={{ color: '#1E40AF' }}>{result.cd3Totales} millones</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Volumen a procesar: <strong style={{ color: '#1E40AF' }}>{result.volumenProcesar} L</strong>
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mt: 3,
          background: result.advertencia
            ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
            : 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
          textAlign: 'center',
          border: '2px solid',
          borderColor: result.advertencia ? '#F59E0B' : '#10B981',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      >
        <Typography variant="h4" fontWeight={700} color={result.advertencia ? '#92400E' : '#065F46'}>
          Volemias a procesar: {result.volemias}
        </Typography>
      </Paper>

      {result.advertencia && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          El procedimiento requiere procesar 4 o más volemias. Evaluar con precaución.
        </Alert>
      )}
    </Box>
  );

  const renderCryopreservationResult = () => (
    <Box>
      {/* Resumen de cálculos */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
          border: '1px solid',
          borderColor: 'primary.light'
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark" sx={{ mb: 2 }}>
          Resumen de Concentración
        </Typography>
        <Typography variant="body1" gutterBottom>
          Factor de concentración: <strong style={{ color: '#1E40AF' }}>{result.factorConcentracion}x</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Volumen mínimo calculado: <strong style={{ color: '#1E40AF' }}>{result.volumenMinimo} ml</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Concentración final de {formData?.tipoProducto || 'células'}: <strong style={{ color: '#1E40AF' }}>{result.concentracionFinal} células/μL</strong>
        </Typography>
      </Box>

      {/* Criopreservante */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
          border: '1px solid',
          borderColor: 'success.light'
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600} color="success.dark" sx={{ mb: 2 }}>
          Solución Criopreservante
        </Typography>
        <Typography variant="body1" gutterBottom>
          DMSO necesario (20%): <strong style={{ color: '#065F46' }}>{result.dmso} ml</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Plasma necesario (80%): <strong style={{ color: '#065F46' }}>{result.plasma} ml</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Volumen total: <strong style={{ color: '#065F46' }}>{result.volumenTotal} ml</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Concentración DMSO final: <strong style={{ color: '#065F46' }}>{result.concentracionDMSO}%</strong>
        </Typography>
      </Box>

      {/* Tabla de distribución */}
      <Box
        sx={{
          mb: 2,
          pb: 1,
          borderBottom: 2,
          borderColor: 'primary.main',
          display: 'inline-block'
        }}
      >
        <Typography variant="h6" fontWeight={600} color="primary.dark" sx={{ mt: 3 }}>
          Distribución en Contenedores
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          mt: 2,
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)' }}>
              <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Contenedor</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Cantidad</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Vol/unidad (ml)</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Conc. final (células/μL)</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                {formData?.tipoProducto || 'Células'} total (×10⁶)
              </TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                {formData?.tipoProducto || 'Células'}/kg (×10⁶)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.distribucion && result.distribucion.map((item, idx) => (
              <TableRow
                key={idx}
                sx={{
                  bgcolor: item.tipo === 'Controles' || item.tipo === 'Hemocultivos'
                    ? 'grey.100'
                    : idx % 2 === 0 ? 'white' : 'grey.50',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    bgcolor: 'primary.50',
                    transform: 'scale(1.01)'
                  }
                }}
              >
                <TableCell>{item.tipo}</TableCell>
                <TableCell align="center">{item.cantidad}</TableCell>
                <TableCell align="center">{item.volumenUnitario}</TableCell>
                <TableCell align="center">{item.concentracionFinal}</TableCell>
                <TableCell align="center">{item.celulasTotal}</TableCell>
                <TableCell align="center">{item.celulasPorKg}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Advertencias si hay volumen restante */}
      {result.volumenRestante > 1 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Volumen restante sin distribuir: {result.volumenRestante} ml.
          Considere ajustar los parámetros o añadir más contenedores.
        </Alert>
      )}

      {result.volumenRestante < 1 && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Distribución completada exitosamente. Volumen distribuido: {result.volumenDistribuido} ml
        </Alert>
      )}
    </Box>
  );

  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        mt: 3,
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        border: '1px solid',
        borderColor: 'primary.light',
        animation: 'fadeIn 0.5s ease-in',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight={700} color="primary.dark" sx={{ mb: 3 }}>
        Resultado del Cálculo
      </Typography>
      {tipo === 'cd34' && renderCD34Result()}
      {tipo === 'linfoaferesis' && renderLinfoaferesisResult()}
      {tipo === 'cryopreservation' && renderCryopreservationResult()}
    </Paper>
  );
}
