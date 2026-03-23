import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const CSS = `
  @page { margin: 15mm 10mm; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; line-height: 1.6; }
  .page { max-width: 760px; margin: 0 auto; padding: 40px 48px; }
  .header { border-bottom: 2px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: baseline; }
  .header h1 { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
  .header .date { font-size: 12px; color: #666; }
  h2 { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #444; margin: 28px 0 12px; }
  h2:first-of-type { margin-top: 0; }
  .section { margin-bottom: 24px; }
  .params { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
  .param { font-size: 13px; }
  .param strong { font-weight: 600; color: #333; }
  .param .value { color: #1a1a1a; }
  .result-box { border: 1px solid #d0d0d0; border-radius: 6px; padding: 16px 20px; margin: 16px 0; background: #fafafa; }
  .result-box.highlight { border-color: #1a1a1a; background: #f5f5f0; }
  .result-big { font-size: 22px; font-weight: 700; margin: 8px 0; }
  .result-big.warn { color: #b45309; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
  thead th { background: #f5f5f5; border-bottom: 2px solid #ccc; padding: 8px 10px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; color: #555; }
  thead th.center { text-align: center; }
  tbody td { border-bottom: 1px solid #e5e5e5; padding: 7px 10px; }
  tbody td.center { text-align: center; }
  tbody tr.muted td { color: #888; font-style: italic; }
  .summary { font-size: 13px; margin-top: 8px; padding: 10px 14px; background: #f9f9f6; border-left: 3px solid #999; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; }
  .footer p { font-size: 11px; color: #888; line-height: 1.5; }
  .badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 3px; background: #eee; color: #555; margin-left: 6px; }
  @media print { .page { padding: 20px; } }
`;

export default function PrintReport({ data, result, tipo = 'cd34' }) {
  const generateReportHTML = () => {
    const fecha = new Date().toLocaleString('es-ES');

    const header = `<div class="header"><h1>Calculadora de Aféresis</h1><span class="date">${fecha}</span></div>`;

    const footer = (refs) => `
      <div class="footer">
        <p><strong>Referencias:</strong></p>
        ${refs.map(r => `<p>${r}</p>`).join('')}
      </div>
    `;

    const nadlerRef = 'Nadler SB, Hidalgo JH, Bloch T. Prediction of blood volume in normal human adults. Surgery. 1962;51(2):224-32.';

    const generators = {
      cd34: () => `
        ${header}
        <h2>Cálculo de Volemias para CD34</h2>
        <div class="section">
          <div class="params">
            <p class="param"><strong>Peso donante:</strong> <span class="value">${data.pesoDonante} kg</span></p>
            <p class="param"><strong>Altura donante:</strong> <span class="value">${data.alturaDonante} cm</span></p>
            <p class="param"><strong>Sexo:</strong> <span class="value">${data.sexoDonante === 'M' ? 'Masculino' : 'Femenino'}</span></p>
            <p class="param"><strong>Peso receptor:</strong> <span class="value">${data.pesoReceptor} kg</span></p>
            <p class="param"><strong>Objetivo:</strong> <span class="value">${data.objetivoCD34} ×10⁶ CD34/kg</span></p>
            <p class="param"><strong>Concentración CD34:</strong> <span class="value">${data.concentracionCD34} /μL</span></p>
            <p class="param"><strong>Eficiencia (CE2):</strong> <span class="value">${data.eficiencia}</span></p>
          </div>
        </div>
        <div class="result-box${result.advertencia ? '' : ' highlight'}">
          <p class="param"><strong>Volemia donante:</strong> ${result.volemiaDonante} L</p>
          <p class="param"><strong>CD34 totales requeridas:</strong> ${result.cd34Totales} ×10⁶</p>
          <p class="param"><strong>Volumen a procesar:</strong> ${result.volumenProcesar} L</p>
          <p class="result-big${result.advertencia ? ' warn' : ''}">Volemias a procesar: ${result.volemias}</p>
          ${result.advertencia ? '<p style="color:#b45309;font-size:13px;">Procedimiento requiere 4+ volemias. Evaluar con precaución.</p>' : ''}
        </div>
        ${footer([nadlerRef])}
      `,

      linfoaferesis: () => `
        ${header}
        <h2>Cálculo de Linfoaféresis (CD3)</h2>
        <div class="section">
          <div class="params">
            <p class="param"><strong>Peso donante:</strong> <span class="value">${data.pesoDonante} kg</span></p>
            <p class="param"><strong>Altura donante:</strong> <span class="value">${data.alturaDonante} cm</span></p>
            <p class="param"><strong>Sexo:</strong> <span class="value">${data.sexoDonante === 'M' ? 'Masculino' : 'Femenino'}</span></p>
            <p class="param"><strong>Modo:</strong> <span class="value">${result.modoObjetivo === 'totalProducto' ? 'Producto total (CAR-T)' : 'Por kg de receptor'}</span></p>
            ${result.modoObjetivo !== 'totalProducto' ? `<p class="param"><strong>Peso receptor:</strong> <span class="value">${data.pesoReceptor} kg</span></p>` : ''}
            <p class="param"><strong>Objetivo:</strong> <span class="value">${data.objetivoCD3} ${result.modoObjetivo === 'totalProducto' ? '×10⁶ CD3 totales' : '×10⁶ CD3/kg'}</span></p>
            <p class="param"><strong>CD3 usada:</strong> <span class="value">${result.concentracionCD3Usada} /μL</span>${result.cd3Estimado ? '<span class="badge">Estimada</span>' : ''}</p>
            <p class="param"><strong>Eficiencia (CE2):</strong> <span class="value">${data.eficiencia}</span></p>
          </div>
        </div>
        <div class="result-box${result.advertencia ? '' : ' highlight'}">
          <p class="param"><strong>Volemia donante:</strong> ${result.volemiaDonante} L</p>
          <p class="param"><strong>CD3 totales requeridas:</strong> ${result.cd3Totales} ×10⁶</p>
          <p class="param"><strong>Volumen a procesar:</strong> ${result.volumenProcesar} L</p>
          <p class="result-big${result.advertencia ? ' warn' : ''}">Volemias a procesar: ${result.volemias}</p>
          ${result.advertencia ? '<p style="color:#b45309;font-size:13px;">Procedimiento requiere 4+ volemias. Evaluar con precaución.</p>' : ''}
        </div>
        ${footer([nadlerRef])}
      `,

      tpe: () => {
        const tipoReposLabel = { albumina5: 'Albúmina 5%', pfc: 'PFC', combinacion: 'Combinación' };
        return `
          ${header}
          <h2>Recambio Plasmático Terapéutico (TPE)</h2>
          <div class="section">
            <div class="params">
              <p class="param"><strong>Peso:</strong> <span class="value">${data.peso} kg</span></p>
              <p class="param"><strong>Altura:</strong> <span class="value">${data.altura} cm</span></p>
              <p class="param"><strong>Sexo:</strong> <span class="value">${data.sexo === 'M' ? 'Masculino' : 'Femenino'}</span></p>
              <p class="param"><strong>Hematocrito:</strong> <span class="value">${data.hematocrito}%</span></p>
              <p class="param"><strong>Volemias/sesión:</strong> <span class="value">${result.volemiasIntercambio} VP</span></p>
              <p class="param"><strong>Reposición:</strong> <span class="value">${tipoReposLabel[result.tipoReposicion]}</span></p>
              <p class="param"><strong>Sesiones:</strong> <span class="value">${result.numSesiones}</span></p>
            </div>
          </div>
          <div class="result-box highlight">
            <p class="param"><strong>Volemia:</strong> ${result.volemia} L</p>
            <p class="param"><strong>Volumen plasmático:</strong> ${result.volumenPlasmatico} mL</p>
            <p class="result-big">Intercambio/sesión: ${result.volumenIntercambio} mL</p>
            <p class="param"><strong>Total serie (${result.numSesiones} sesiones):</strong> ${result.volumenTotalSerie} mL</p>
            ${result.reposicion.albumina5 > 0 ? `<p class="param"><strong>Albúmina 5%:</strong> ${result.reposicion.albumina5} mL/sesión</p>` : ''}
            ${result.reposicion.pfc > 0 ? `<p class="param"><strong>PFC:</strong> ${result.reposicion.pfc} mL/sesión</p>` : ''}
          </div>
          ${result.igGResidual ? `
            <div class="summary">
              <strong>IgG:</strong> ${result.igGInicial} g/L → ${result.igGResidual} g/L (eliminación ${result.porcentajeEliminacionIgG}%)
            </div>
          ` : ''}
          ${footer([nadlerRef])}
        `;
      },

      rce: () => `
        ${header}
        <h2>Eritrocitaféresis (RCE)</h2>
        <div class="section">
          <div class="params">
            <p class="param"><strong>Peso:</strong> <span class="value">${data.peso} kg</span></p>
            <p class="param"><strong>Altura:</strong> <span class="value">${data.altura} cm</span></p>
            <p class="param"><strong>Sexo:</strong> <span class="value">${data.sexo === 'M' ? 'Masculino' : 'Femenino'}</span></p>
            <p class="param"><strong>Hct inicial:</strong> <span class="value">${data.hctInicial}%</span></p>
            <p class="param"><strong>HbS inicial:</strong> <span class="value">${data.hbSInicial}%</span></p>
            <p class="param"><strong>HbS objetivo:</strong> <span class="value">${data.hbSObjetivo}%</span></p>
            <p class="param"><strong>Hct CH:</strong> <span class="value">${data.hctCH}%</span></p>
            <p class="param"><strong>Vol/unidad CH:</strong> <span class="value">${data.volumenPorUnidad} mL</span></p>
          </div>
        </div>
        <div class="result-box highlight">
          <p class="param"><strong>Volemia:</strong> ${result.volemia} L</p>
          <p class="param"><strong>FCR:</strong> ${result.fcr}</p>
          <p class="result-big">Volumen de intercambio: ${result.volumenIntercambio} mL</p>
          <p class="result-big">Unidades de CH: ${result.unidadesCH}</p>
          <p class="param"><strong>HbS final:</strong> ${result.hbSFinal}% &nbsp;|&nbsp; <strong>Hct post:</strong> ${result.hctFinal}%</p>
        </div>
        ${footer(['Davis BA, et al. Guidelines on red cell transfusion in sickle cell disease. Br J Haematol. 2017;176(2):192-209.'])}
      `,

      citrate: () => `
        ${header}
        <h2>Citrato / Anticoagulante</h2>
        <div class="section">
          <div class="params">
            <p class="param"><strong>Peso:</strong> <span class="value">${data.peso} kg</span></p>
            <p class="param"><strong>Flujo de entrada:</strong> <span class="value">${data.flujoEntrada} mL/min</span></p>
            <p class="param"><strong>Ratio ACD-A:</strong> <span class="value">1:${data.ratioACD}</span></p>
            <p class="param"><strong>Duración:</strong> <span class="value">${data.duracion} min</span></p>
            ${data.hepatopatia ? '<p class="param"><strong>Factor:</strong> <span class="value">Hepatopatía</span></p>' : ''}
            ${data.pediatrico ? '<p class="param"><strong>Factor:</strong> <span class="value">Pediátrico</span></p>' : ''}
          </div>
        </div>
        <div class="result-box highlight">
          <p class="param"><strong>Flujo ACD-A:</strong> ${result.flujoACD} mL/min</p>
          <p class="result-big">Tasa de citrato: ${result.tasaCitrato} mg/kg/min</p>
          <p class="param"><strong>Riesgo:</strong> ${result.riesgo.label}</p>
          <p class="param"><strong>Vol. total ACD-A:</strong> ${result.volumenTotalACD} mL</p>
        </div>
        <div class="summary"><strong>Calcio:</strong> ${result.riesgo.recomendacionCalcio}</div>
        ${footer(['Weinstein R. Prevention of citrate reactions during therapeutic plasma exchange. J Clin Apher. 1996;11(4):195-7.'])}
      `,

      dli: () => `
        ${header}
        <h2>DLI - Infusión de Linfocitos del Donante</h2>
        <div class="section">
          <div class="params">
            <p class="param"><strong>Volumen producto:</strong> <span class="value">${data.volumenProducto} mL</span></p>
            <p class="param"><strong>Concentración CD3+:</strong> <span class="value">${data.concentracionCD3} /μL</span></p>
            <p class="param"><strong>Peso receptor:</strong> <span class="value">${data.pesoReceptor} kg</span></p>
            <p class="param"><strong>CD3+ total:</strong> <span class="value">${result.celulasTotalProducto} ×10⁶</span></p>
          </div>
        </div>
        <div class="section">
          <p class="param" style="margin-bottom:8px"><strong>Dosis administrables:</strong> ${result.dosisAdministrables} de ${result.totalDosis}</p>
          <table>
            <thead>
              <tr>
                <th>Dosis</th>
                <th class="center">CD3+/kg</th>
                <th class="center">CD3+ total</th>
                <th class="center">Volumen</th>
                <th class="center">Vol. acum.</th>
                <th class="center">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${result.tabla.map(f => `
                <tr${f.disponible ? '' : ' class="muted"'}>
                  <td>${f.numeroDosis}</td>
                  <td class="center">${f.dosisCD3PorKgFormateada}</td>
                  <td class="center">${f.cd3TotalFormateada}</td>
                  <td class="center">${f.volumenML} mL</td>
                  <td class="center">${f.volumenAcumulado} mL</td>
                  <td class="center">${f.disponible ? 'Disponible' : 'Insuficiente'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ${footer(['Kolb HJ, et al. Donor leukocyte transfusions for treatment of recurrent chronic myelogenous leukemia. Blood. 1990;76(12):2462-5.'])}
      `,

      cryopreservation: () => {
        const volEfectivo = data.concentrar
          ? data.volumenConcentrado
          : data.volumenInicial;

        return `
          ${header}
          <h2>Programación de Congelaciones</h2>
          <div class="section">
            <div class="params">
              <p class="param"><strong>Tipo de producto:</strong> <span class="value">${data.tipoProducto}</span></p>
              <p class="param"><strong>Volumen inicial:</strong> <span class="value">${data.volumenInicial} ml</span></p>
              <p class="param"><strong>Conc. ${data.tipoProducto}:</strong> <span class="value">${data.concentracionCelulas} células/μL</span></p>
              <p class="param"><strong>Conc. leucocitos:</strong> <span class="value">${data.concentracionLeucocitos} células/mm³</span></p>
              <p class="param"><strong>Peso receptor:</strong> <span class="value">${data.pesoReceptor} kg</span></p>
              <p class="param"><strong>Conc. máx. permitida:</strong> <span class="value">${data.concentracionMaxima} células/mm³</span></p>
            </div>
          </div>

          <h2>Concentración</h2>
          <div class="result-box">
            <div class="params">
              <p class="param"><strong>Volumen mínimo:</strong> ${result.volumenMinimo} ml</p>
              <p class="param"><strong>Volumen efectivo:</strong> ${volEfectivo} ml${result.concentrar ? '' : ' (sin concentrar)'}</p>
              <p class="param"><strong>Factor:</strong> ${result.factorConcentracion}x</p>
              <p class="param"><strong>Conc. final ${data.tipoProducto}:</strong> ${result.concentracionFinal} células/μL</p>
            </div>
          </div>

          <h2>Solución Criopreservante</h2>
          <div class="result-box">
            <div class="params">
              <p class="param"><strong>DMSO (20%):</strong> ${result.dmso} ml</p>
              <p class="param"><strong>Plasma (80%):</strong> ${result.plasma} ml</p>
              <p class="param"><strong>Volumen total:</strong> ${result.volumenTotal} ml</p>
              <p class="param"><strong>DMSO final:</strong> ${result.concentracionDMSO}%</p>
            </div>
          </div>

          <h2>Distribución en Contenedores</h2>
          <table>
            <thead>
              <tr>
                <th>Contenedor</th>
                <th class="center">Cantidad</th>
                <th class="center">Vol/ud (ml)</th>
                <th class="center">Conc. (cél/μL)</th>
                <th class="center">${data.tipoProducto} (×10⁶)</th>
                <th class="center">${data.tipoProducto}/kg (×10⁶)</th>
              </tr>
            </thead>
            <tbody>
              ${result.distribucion.map(item => `
                <tr${item.tipo === 'Controles' || item.tipo === 'Hemocultivos' ? ' class="muted"' : ''}>
                  <td>${item.tipo}</td>
                  <td class="center">${item.cantidad}</td>
                  <td class="center">${item.volumenUnitario}</td>
                  <td class="center">${item.concentracionFinal}</td>
                  <td class="center">${item.celulasTotal}</td>
                  <td class="center">${item.celulasPorKg}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary">
            <strong>Distribuido:</strong> ${result.volumenDistribuido} ml
            &nbsp;|&nbsp;
            <strong>Restante:</strong> ${result.volumenRestante} ml
          </div>
          ${footer([
            'Lecchi L, et al. An update on methods for cryopreservation and thawing of hemopoietic stem cells. Transfus Apher Sci. 2016;54(3):324-36.',
            'Hornberger K, et al. Cryopreservation of Hematopoietic Stem Cells. Transfus Med Hemother. 2019;46(3):188-196.'
          ])}
        `;
      },
    };

    const generator = generators[tipo];
    return generator ? generator() : '';
  };

  const handlePrint = () => {
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`<!DOCTYPE html>
<html><head>
  <title> </title>
  <meta charset="utf-8">
  <style>${CSS}</style>
</head><body>
  <div class="page">${generateReportHTML()}</div>
</body></html>`);
    reportWindow.document.close();
    reportWindow.onload = () => reportWindow.print();
  };

  if (!result) return null;

  return (
    <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ mt: 2 }}>
      Generar Reporte
    </Button>
  );
}
