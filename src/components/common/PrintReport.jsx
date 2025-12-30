import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

export default function PrintReport({ data, result, tipo = 'cd34' }) {
  const generateReportHTML = () => {
    const fecha = new Date().toLocaleString('es-ES');

    let contenido = '';

    if (tipo === 'cd34') {
      contenido = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1 style="text-align: center; color: #1976d2;">Sistema de Cálculos - Aféresis</h1>
          <h2 style="border-bottom: 2px solid #1976d2; padding-bottom: 10px;">Cálculo de Volemias para CD34</h2>

          <p style="color: #666;"><strong>Fecha y hora:</strong> ${fecha}</p>

          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h3>Parámetros del Donante</h3>
            <p><strong>Peso:</strong> ${data.pesoDonante} kg</p>
            <p><strong>Altura:</strong> ${data.alturaDonante} cm</p>
            <p><strong>Sexo:</strong> ${data.sexoDonante === 'M' ? 'Masculino' : 'Femenino'}</p>
          </div>

          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h3>Parámetros del Procedimiento</h3>
            <p><strong>Peso del receptor:</strong> ${data.pesoReceptor} kg</p>
            <p><strong>Objetivo de recolección:</strong> ${data.objetivoCD34} millones CD34/kg</p>
            <p><strong>Concentración CD34 pre-aféresis:</strong> ${data.concentracionCD34} CD34/μL</p>
            <p><strong>Eficiencia del proceso (CE2):</strong> ${data.eficiencia}</p>
          </div>

          <div style="margin: 30px 0; padding: 20px; background-color: ${result.advertencia ? '#fff9c4' : '#c8e6c9'}; border-radius: 5px; border: 2px solid ${result.advertencia ? '#ffc107' : '#4caf50'};">
            <h3>Resultados</h3>
            <p><strong>Volemia del donante:</strong> ${result.volemiaDonante} L</p>
            <p><strong>CD34 totales requeridas:</strong> ${result.cd34Totales} millones</p>
            <p><strong>Volumen a procesar:</strong> ${result.volumenProcesar} L</p>
            <p style="font-size: 20px; margin-top: 15px;"><strong>VOLEMIAS A PROCESAR: ${result.volemias}</strong></p>
            ${result.advertencia ? '<p style="color: #f57c00; font-weight: bold;">⚠️ Procedimiento requiere ≥4 volemias. Evaluar con precaución.</p>' : ''}
          </div>

          <div style="margin-top: 40px; padding: 15px; border-top: 1px solid #ccc;">
            <h4>Referencias</h4>
            <p style="font-size: 12px; color: #666;">Nadler SB, Hidalgo JH, Bloch T. Prediction of blood volume in normal human adults. Surgery. 1962 Feb;51(2):224-32.</p>
          </div>
        </div>
      `;
    }

    if (tipo === 'linfoaferesis') {
      contenido = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1 style="text-align: center; color: #1976d2;">Sistema de Cálculos - Aféresis</h1>
          <h2 style="border-bottom: 2px solid #1976d2; padding-bottom: 10px;">Cálculo de Linfoaféresis (CD3)</h2>

          <p style="color: #666;"><strong>Fecha y hora:</strong> ${fecha}</p>

          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h3>Parámetros del Donante</h3>
            <p><strong>Peso:</strong> ${data.pesoDonante} kg</p>
            <p><strong>Altura:</strong> ${data.alturaDonante} cm</p>
            <p><strong>Sexo:</strong> ${data.sexoDonante === 'M' ? 'Masculino' : 'Femenino'}</p>
          </div>

          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h3>Parámetros del Procedimiento</h3>
            <p><strong>Peso del receptor:</strong> ${data.pesoReceptor} kg</p>
            <p><strong>Objetivo de recolección:</strong> ${data.objetivoCD3} millones CD3/kg</p>
            <p><strong>Concentración CD3 pre-aféresis:</strong> ${data.concentracionCD3} CD3/μL</p>
            <p><strong>Eficiencia del proceso (CE2):</strong> ${data.eficiencia}</p>
          </div>

          <div style="margin: 30px 0; padding: 20px; background-color: ${result.advertencia ? '#fff9c4' : '#c8e6c9'}; border-radius: 5px; border: 2px solid ${result.advertencia ? '#ffc107' : '#4caf50'};">
            <h3>Resultados</h3>
            <p><strong>Volemia del donante:</strong> ${result.volemiaDonante} L</p>
            <p><strong>CD3 totales requeridas:</strong> ${result.cd3Totales} millones</p>
            <p><strong>Volumen a procesar:</strong> ${result.volumenProcesar} L</p>
            <p style="font-size: 20px; margin-top: 15px;"><strong>VOLEMIAS A PROCESAR: ${result.volemias}</strong></p>
            ${result.advertencia ? '<p style="color: #f57c00; font-weight: bold;">⚠️ Procedimiento requiere ≥4 volemias. Evaluar con precaución.</p>' : ''}
          </div>

          <div style="margin-top: 40px; padding: 15px; border-top: 1px solid #ccc;">
            <h4>Referencias</h4>
            <p style="font-size: 12px; color: #666;">Nadler SB, Hidalgo JH, Bloch T. Prediction of blood volume in normal human adults. Surgery. 1962 Feb;51(2):224-32.</p>
          </div>
        </div>
      `;
    }

    if (tipo === 'cryopreservation') {
      contenido = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1000px; margin: 0 auto;">
          <h1 style="text-align: center; color: #1976d2;">Sistema de Cálculos - Aféresis</h1>
          <h2 style="border-bottom: 2px solid #1976d2; padding-bottom: 10px;">Programación de Congelaciones</h2>

          <p style="color: #666;"><strong>Fecha y hora:</strong> ${fecha}</p>

          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h3>Parámetros Iniciales</h3>
            <p><strong>Tipo de producto:</strong> ${data.tipoProducto}</p>
            <p><strong>Volumen inicial de aféresis:</strong> ${data.volumenInicial} ml</p>
            <p><strong>Concentración de ${data.tipoProducto}:</strong> ${data.concentracionCelulas} células/μL</p>
            <p><strong>Concentración de leucocitos:</strong> ${data.concentracionLeucocitos} células/mm³</p>
            <p><strong>Peso del receptor:</strong> ${data.pesoReceptor} kg</p>
            <p><strong>Concentración máxima permitida:</strong> ${data.concentracionMaxima} células/mm³</p>
            ${data.criotubosRequeridos ? `<p><strong>Criotubos solicitados:</strong> ${data.criotubosRequeridos}</p>` : ''}
          </div>

          <div style="margin: 20px 0; padding: 15px; background-color: #e3f2fd; border-radius: 5px;">
            <h3>Resumen de Concentración</h3>
            <p><strong>Volumen mínimo calculado:</strong> ${result.volumenMinimo} ml</p>
            <p><strong>Factor de concentración aplicado:</strong> ${result.factorConcentracion}x</p>
            <p><strong>Concentración final de ${data.tipoProducto}:</strong> ${result.concentracionFinal} células/μL</p>
          </div>

          <div style="margin: 20px 0; padding: 15px; background-color: #fff3e0; border-radius: 5px;">
            <h3>Solución Criopreservante</h3>
            <p><strong>DMSO necesario (20%):</strong> ${result.dmso} ml</p>
            <p><strong>Plasma necesario (80%):</strong> ${result.plasma} ml</p>
            <p><strong>Volumen total final:</strong> ${result.volumenTotal} ml</p>
            <p><strong>Concentración DMSO final:</strong> ${result.concentracionDMSO}%</p>
          </div>

          <div style="margin: 30px 0;">
            <h3>Distribución en Contenedores</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <thead>
                <tr style="background-color: #1976d2; color: white;">
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Contenedor</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Cantidad</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Vol/unidad (ml)</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Conc. final (células/μL)</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.tipoProducto} total (×10⁶)</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.tipoProducto}/kg (×10⁶)</th>
                </tr>
              </thead>
              <tbody>
                ${result.distribucion.map(item => `
                  <tr style="background-color: ${item.tipo === 'Controles' || item.tipo === 'Hemocultivos' ? '#f5f5f5' : 'white'};">
                    <td style="border: 1px solid #ddd; padding: 10px;">${item.tipo}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.cantidad}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.volumenUnitario}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.concentracionFinal}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.celulasTotal}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.celulasPorKg}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="margin: 20px 0; padding: 15px; background-color: ${result.volumenRestante < 1 ? '#c8e6c9' : '#fff9c4'}; border-radius: 5px;">
            <p><strong>Volumen distribuido:</strong> ${result.volumenDistribuido} ml</p>
            <p><strong>Volumen restante:</strong> ${result.volumenRestante} ml</p>
          </div>

          <div style="margin-top: 40px; padding: 15px; border-top: 1px solid #ccc;">
            <h4>Referencias</h4>
            <p style="font-size: 12px; color: #666;">Nadler SB, Hidalgo JH, Bloch T. Prediction of blood volume in normal human adults. Surgery. 1962 Feb;51(2):224-32.</p>
          </div>
        </div>
      `;
    }

    return contenido;
  };

  const handlePrint = () => {
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reporte - Cálculo de Aféresis</title>
          <meta charset="utf-8">
          <style>
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${generateReportHTML()}
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    reportWindow.document.close();
  };

  if (!result) return null;

  return (
    <Button
      variant="outlined"
      startIcon={<PrintIcon />}
      onClick={handlePrint}
      sx={{ mt: 2 }}
    >
      Generar Reporte
    </Button>
  );
}
