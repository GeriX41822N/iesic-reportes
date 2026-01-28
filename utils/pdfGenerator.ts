// utils/pdfGenerator.ts
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { IESIC_LOGO_BASE64 } from './logoBase64';
import { Report } from './reportStorage';

export async function generateAndSharePDF(report: Report) {
  try {
    const html = generateHTML(report);

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Compartir REPORTE_${report.id}`,
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('Error generando PDF', error);
  }
}

function generateHTML(report: Report) {
  // 🧠 OBSERVACIONES INTELIGENTES
  const observationsAuto: string[] = [];

  const corriente = Number(report.measurements.corriente);
  if (!isNaN(corriente) && corriente > 6) {
    observationsAuto.push(
      'Se detecta consumo de corriente por encima del valor nominal del equipo, lo cual puede indicar desgaste en componentes internos.'
    );
  }

  if (report.observations.plantillas.obstruccionDrenaje) {
    observationsAuto.push(
      'Se detectó obstrucción en la línea de drenaje debido a acumulación de residuos.'
    );
  }

  if (report.observations.plantillas.recomendacionPreventivo) {
    observationsAuto.push(
      'Se recomienda realizar mantenimiento preventivo cada 3 meses para conservar la eficiencia del sistema.'
    );
  }

  const observationsText = [
    ...observationsAuto,
    report.observations.comentarioLibre,
  ]
    .filter(Boolean)
    .join('<br/><br/>');

  // 📷 FOTOS
  const photos = Object.values(report.evidencePhotos).filter(Boolean) as string[];

  // 🖋️ FIRMAS (BASE64 DESDE CANVAS)
  const { tecnico, encargado } = report.signatures;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, sans-serif; padding: 24px; font-size: 12px; }
  h3 { margin-top: 18px; color: #1e5fa3; }
  table { border-collapse: collapse; }
</style>
</head>

<body>

<table width="100%" cellspacing="0" cellpadding="6">
<tr>
<td width="20%"><img src="${IESIC_LOGO_BASE64}" style="width:90px;" /></td>
<td width="60%" align="center" style="font-size:16px;font-weight:bold;color:#1e5fa3;">
REPORTE DE MANTENIMIENTO PREVENTIVO
</td>
<td width="20%" align="right">
<div style="border:2px solid #c62828;padding:6px;font-weight:bold;">
FOLIO: ${report.id}
</div>
</td>
</tr>
</table>

<h3>Datos Generales</h3>
<table width="100%" border="1" cellpadding="4">
<tr><td>Cliente</td><td>${report.generalData.cliente}</td></tr>
<tr><td>Fecha</td><td>${report.generalData.fecha}</td></tr>
<tr><td>Técnico</td><td>${report.generalData.tecnico}</td></tr>
</table>

<h3>Evidencia Fotográfica</h3>
<table width="100%" cellspacing="6">
<tr>
${
  photos.length
    ? photos.map(p => `<td width="25%"><img src="${p}" style="width:100%;max-height:180px;" /></td>`).join('')
    : `<td>No se adjuntaron fotografías</td>`
}
</tr>
</table>

<h3>Observaciones</h3>
<div style="border:1px solid #000;padding:8px;">
${observationsText || 'Sin observaciones'}
</div>

<table width="100%" style="margin-top:40px;">
<tr>
<td align="center">
${tecnico ? `<img src="${tecnico}" style="width:180px;" />` : ''}
<div style="border-top:1px solid #000;width:80%;margin:auto;"></div>
Firma del Técnico
</td>

<td align="center">
${encargado ? `<img src="${encargado}" style="width:180px;" />` : ''}
<div style="border-top:1px solid #000;width:80%;margin:auto;"></div>
Firma del Cliente
</td>
</tr>
</table>

</body>
</html>
`;
}
