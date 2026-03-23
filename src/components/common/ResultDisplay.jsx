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
  TableRow,
  Chip
} from '@mui/material';

export default function ResultDisplay({ result, tipo = 'cd34', formData }) {
  if (!result) return null;

  const renderCD34Result = () => (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Volemia del donante: <strong style={{ color: '#6D28D9' }}>{result.volemiaDonante} L</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          CD34 totales requeridas: <strong style={{ color: '#6D28D9' }}>{result.cd34Totales} millones</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Volumen a procesar: <strong style={{ color: '#6D28D9' }}>{result.volumenProcesar} L</strong>
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 3, mt: 3,
          background: result.advertencia
            ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
            : 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
          textAlign: 'center',
          border: '2px solid',
          borderColor: result.advertencia ? '#F59E0B' : '#10B981',
          transition: 'transform 0.2s ease',
          '&:hover': { transform: 'scale(1.02)' }
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
          Volemia del donante: <strong style={{ color: '#6D28D9' }}>{result.volemiaDonante} L</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          CD3 totales requeridas: <strong style={{ color: '#6D28D9' }}>{result.cd3Totales} millones</strong>
          {result.modoObjetivo === 'totalProducto' && (
            <Chip label="CAR-T" size="small" color="info" sx={{ ml: 1 }} />
          )}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Volumen a procesar: <strong style={{ color: '#6D28D9' }}>{result.volumenProcesar} L</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Concentración CD3 usada: <strong style={{ color: '#6D28D9' }}>{result.concentracionCD3Usada} /μL</strong>
          {result.cd3Estimado && (
            <Chip label="Estimado desde hemograma" size="small" color="warning" variant="outlined" sx={{ ml: 1 }} />
          )}
        </Typography>
        {result.cd3Estimado && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Linfocitos: {result.linfocitosTotales} /μL | % CD3 aplicado: {result.porcentajeCD3}%
          </Typography>
        )}
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 3, mt: 3,
          background: result.advertencia
            ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
            : 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
          textAlign: 'center',
          border: '2px solid',
          borderColor: result.advertencia ? '#F59E0B' : '#10B981',
          transition: 'transform 0.2s ease',
          '&:hover': { transform: 'scale(1.02)' }
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

  const renderTPEResult = () => {
    const tipoReposLabel = {
      albumina5: 'Albúmina 5%',
      pfc: 'Plasma Fresco Congelado',
      combinacion: 'Combinación'
    };

    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
            Volemia: <strong style={{ color: '#6D28D9' }}>{result.volemia} L</strong>
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
            Volumen plasmático: <strong style={{ color: '#6D28D9' }}>{result.volumenPlasmatico} mL</strong>
          </Typography>
        </Box>

        <Paper elevation={3} sx={{
          p: 3, mt: 3,
          background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
          textAlign: 'center',
          border: '2px solid', borderColor: '#3B82F6'
        }}>
          <Typography variant="h5" fontWeight={700} color="#1E40AF">
            Volumen de intercambio por sesión: {result.volumenIntercambio} mL
          </Typography>
          <Typography variant="body1" color="#1E40AF" sx={{ mt: 1 }}>
            {result.volemiasIntercambio} volemias plasmáticas × {result.numSesiones} sesiones = {result.volumenTotalSerie} mL total
          </Typography>
        </Paper>

        <Box sx={{ mt: 3, p: 3, borderRadius: 2, background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', border: '1px solid', borderColor: 'success.light' }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="success.dark">
            Líquido de Reposición ({tipoReposLabel[result.tipoReposicion]})
          </Typography>
          {result.reposicion.albumina5 > 0 && (
            <Typography variant="body1" gutterBottom>
              Albúmina 5%: <strong style={{ color: '#065F46' }}>{result.reposicion.albumina5} mL</strong>
            </Typography>
          )}
          {result.reposicion.pfc > 0 && (
            <Typography variant="body1" gutterBottom>
              PFC: <strong style={{ color: '#065F46' }}>{result.reposicion.pfc} mL</strong>
            </Typography>
          )}
        </Box>

        {result.igGResidual && (
          <Box sx={{ mt: 3, p: 3, borderRadius: 2, background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', border: '1px solid', borderColor: 'warning.light' }}>
            <Typography variant="h6" gutterBottom fontWeight={600} color="#92400E">
              Eliminación de IgG
            </Typography>
            <Typography variant="body1" gutterBottom>
              IgG inicial: <strong>{result.igGInicial} g/L</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
              IgG residual estimada tras {result.numSesiones} sesiones: <strong>{result.igGResidual} g/L</strong>
            </Typography>
            <Typography variant="body1">
              Eliminación total: <strong>{result.porcentajeEliminacionIgG}%</strong> ({result.volemiasAcumuladas} VP acumuladas)
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderRCEResult = () => (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Volemia: <strong style={{ color: '#6D28D9' }}>{result.volemia} L</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          FCR (Fracción de Células Restantes): <strong style={{ color: '#6D28D9' }}>{result.fcr}</strong>
        </Typography>
      </Box>

      <Paper elevation={3} sx={{
        p: 3, mt: 3,
        background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
        textAlign: 'center',
        border: '2px solid', borderColor: '#EF4444'
      }}>
        <Typography variant="h5" fontWeight={700} color="#991B1B">
          Volumen de intercambio: {result.volumenIntercambio} mL
        </Typography>
        <Typography variant="h6" fontWeight={600} color="#991B1B" sx={{ mt: 1 }}>
          Unidades de CH necesarias: {result.unidadesCH}
        </Typography>
        <Typography variant="body2" color="#991B1B">
          ({result.volumenPorUnidad} mL/unidad)
        </Typography>
      </Paper>

      <Box sx={{ mt: 3, p: 3, borderRadius: 2, background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', border: '1px solid', borderColor: 'success.light' }}>
        <Typography variant="h6" gutterBottom fontWeight={600} color="success.dark">
          Resultado Esperado
        </Typography>
        <Typography variant="body1" gutterBottom>
          HbS final: <strong style={{ color: '#065F46' }}>{result.hbSFinal}%</strong>
        </Typography>
        <Typography variant="body1">
          Hematocrito post-procedimiento estimado: <strong style={{ color: '#065F46' }}>{result.hctFinal}%</strong>
        </Typography>
      </Box>
    </Box>
  );

  const renderCitrateResult = () => (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Flujo de ACD-A: <strong style={{ color: '#6D28D9' }}>{result.flujoACD} mL/min</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Ratio ACD-A: <strong style={{ color: '#6D28D9' }}>1:{result.ratioACD}</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Volumen total ACD-A: <strong style={{ color: '#6D28D9' }}>{result.volumenTotalACD} mL</strong> ({result.duracion} min)
        </Typography>
      </Box>

      <Paper elevation={3} sx={{
        p: 3, mt: 3,
        background: result.riesgo.nivel === 'bajo'
          ? 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
          : result.riesgo.nivel === 'moderado'
            ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
            : 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
        textAlign: 'center',
        border: '2px solid',
        borderColor: result.riesgo.nivel === 'bajo' ? '#10B981'
          : result.riesgo.nivel === 'moderado' ? '#F59E0B' : '#EF4444'
      }}>
        <Typography variant="h5" fontWeight={700}
          color={result.riesgo.nivel === 'bajo' ? '#065F46' : result.riesgo.nivel === 'moderado' ? '#92400E' : '#991B1B'}>
          Tasa de citrato: {result.tasaCitrato} mg/kg/min
        </Typography>
        <Chip
          label={result.riesgo.label}
          color={result.riesgo.color}
          sx={{ mt: 1, fontWeight: 600, fontSize: '0.9rem' }}
        />
        {result.riesgo.ajustadoPorFactores && (
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
            Riesgo ajustado por factores agravantes
          </Typography>
        )}
      </Paper>

      <Alert severity={result.riesgo.color} sx={{ mt: 2 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>{result.riesgo.descripcion}</Typography>
        <Typography variant="body2">{result.riesgo.recomendacionCalcio}</Typography>
      </Alert>

      {result.factoresRiesgo.length > 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2" fontWeight={600}>Factores de riesgo adicionales:</Typography>
          {result.factoresRiesgo.map((f, i) => (
            <Typography key={i} variant="body2">• {f}</Typography>
          ))}
        </Alert>
      )}
    </Box>
  );

  const renderDLIResult = () => (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          CD3+ total en producto: <strong style={{ color: '#6D28D9' }}>{result.celulasTotalProducto} ×10⁶</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Dosis administrables: <strong style={{ color: '#6D28D9' }}>{result.dosisAdministrables} de {result.totalDosis}</strong>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          Volumen necesario: <strong style={{ color: '#6D28D9' }}>{result.volumenTotalNecesario} mL</strong> de {result.volumenProducto} mL disponibles
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={2} sx={{ mt: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Dosis nº</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>CD3+/kg</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>CD3+ total</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Volumen (mL)</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Vol. acumulado (mL)</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.tabla.map((fila) => (
              <TableRow key={fila.numeroDosis} sx={{
                bgcolor: fila.disponible ? (fila.numeroDosis % 2 === 0 ? 'grey.50' : 'white') : '#FEE2E2',
                opacity: fila.disponible ? 1 : 0.6
              }}>
                <TableCell>{fila.numeroDosis}</TableCell>
                <TableCell align="center">{fila.dosisCD3PorKgFormateada}</TableCell>
                <TableCell align="center">{fila.cd3TotalFormateada}</TableCell>
                <TableCell align="center">{fila.volumenML}</TableCell>
                <TableCell align="center">{fila.volumenAcumulado}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={fila.disponible ? 'Disponible' : 'Insuficiente'}
                    size="small"
                    color={fila.disponible ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {result.volumenRestante > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Volumen restante tras administrar las dosis disponibles: {result.volumenRestante} mL
        </Alert>
      )}
    </Box>
  );

  const renderCryopreservationResult = () => (
    <Box>
      <Box
        sx={{
          mb: 3, p: 3, borderRadius: 2,
          background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
          border: '1px solid', borderColor: 'primary.light'
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark" sx={{ mb: 2 }}>
          Resumen de Concentración
        </Typography>
        <Typography variant="body1" gutterBottom>
          Factor de concentración: <strong style={{ color: '#6D28D9' }}>{result.factorConcentracion}x</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Volumen mínimo calculado: <strong style={{ color: '#6D28D9' }}>{result.volumenMinimo} ml</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Concentración final de {formData?.tipoProducto || 'células'}: <strong style={{ color: '#6D28D9' }}>{result.concentracionFinal} células/μL</strong>
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 3, p: 3, borderRadius: 2,
          background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
          border: '1px solid', borderColor: 'success.light'
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

      <Box sx={{ mb: 2, pb: 1, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
        <Typography variant="h6" fontWeight={600} color="primary.dark" sx={{ mt: 3 }}>
          Distribución en Contenedores
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={2} sx={{ mt: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}>
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
                  '&:hover': { bgcolor: 'primary.50', transform: 'scale(1.01)' }
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

  const renderers = {
    cd34: renderCD34Result,
    linfoaferesis: renderLinfoaferesisResult,
    tpe: renderTPEResult,
    rce: renderRCEResult,
    citrate: renderCitrateResult,
    dli: renderDLIResult,
    cryopreservation: renderCryopreservationResult
  };

  const renderer = renderers[tipo];
  if (!renderer) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        mt: 3,
        background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
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
      {renderer()}
    </Paper>
  );
}
