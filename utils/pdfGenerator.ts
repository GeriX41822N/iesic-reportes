import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { IESIC_LOGO_BASE64 } from './logoBase64';
import { Report } from './reportStorage';

let isSharing = false;

// 🔄 file:// → base64
async function fileToBase64(uri: string) {
  return await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

export async function generateAndSharePDF(report: Report) {
  if (isSharing) return;
  isSharing = true;

  try {
    const html = await generateHTML(report);
    const { uri } = await Print.printToFileAsync({ html });

    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Compartir REPORTE_${report.id}`,
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('Error generando PDF', error);
  } finally {
    isSharing = false;
  }
}

async function generateHTML(report: Report) {
  /* ================= OBSERVACIONES INTELIGENTES ================= */
  const observationsAuto: string[] = [];

  const corriente = Number(report.measurements.corriente);
  if (!isNaN(corriente) && corriente > 6) {
    observationsAuto.push(
      'Se detecta consumo de corriente por encima del valor nominal especificado por el fabricante.'
    );
  }

  if (report.observations.plantillas.obstruccionDrenaje) {
    observationsAuto.push(
      'Se detectó obstrucción en la manguera de drenaje por acumulación de suciedad.'
    );
  }

  if (report.observations.plantillas.recomendacionPreventivo) {
    observationsAuto.push(
      'Se recomienda programar mantenimiento preventivo cada 3 meses.'
    );
  }

  const observationsText = [
    ...observationsAuto,
    report.observations.comentarioLibre,
  ]
    .filter(Boolean)
    .join('<br/><br/>');

  /* ================= FOTOS ================= */
  const photos = await Promise.all(
    Object.values(report.evidencePhotos)
      .filter(Boolean)
      .map(async (uri) => {
        const b64 = await fileToBase64(uri as string);
        return `data:image/jpeg;base64,${b64}`;
      })
  );

  /* ================= FIRMAS ================= */
  const tecnico = report.signatures.tecnico
    ? `data:image/png;base64,${await fileToBase64(report.signatures.tecnico)}`
    : '';

  const encargado = report.signatures.encargado
    ? `data:image/png;base64,${await fileToBase64(report.signatures.encargado)}`
    : '';

  /* ================= ACTIVIDADES ================= */
  const activitiesMap: Record<string, string> = {
    limpiezaFiltros: 'Limpieza de filtros de aire',
    limpiezaEvaporador: 'Limpieza de serpentín evaporador',
    limpiezaCondensador: 'Limpieza de serpentín condensador',
    limpiezaDrenaje: 'Limpieza de charola de drenaje',
    ajusteTornilleria: 'Ajuste de tornillería y piezas sueltas',
    revisionGas: 'Revisión de carga de gas refrigerante',
    medicionElectrica: 'Medición de amperaje y voltaje',
    revisionControlRemoto: 'Revisión de controles remotos',
    verificacionGeneral: 'Verificación de funcionamiento general',
  };

  const activitiesHTML = Object.entries(activitiesMap)
    .map(
      ([key, label]) =>
        `[${report.activities[key as keyof typeof report.activities] ? 'x' : ' '}] ${label}`
    )
    .join('<br/>');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial; font-size: 12px; padding: 24px; }
  h3 { color: #1e5fa3; margin-top: 20px; }
  table { border-collapse: collapse; width: 100%; }
  td { padding: 6px; }
</style>
</head>

<body>

<table>
<tr>
<td width="20%"><img src="${IESIC_LOGO_BASE64}" style="width:90px;" /></td>
<td width="60%" align="center" style="font-size:16px;font-weight:bold;color:#1e5fa3;">
REPORTE DE MANTENIMIENTO PREVENTIVO – MINISPLIT
</td>
<td width="20%" align="right">
<strong>FOLIO:</strong> ${report.id}
</td>
</tr>
</table>

<h3>Datos Generales</h3>
<table border="1">
<tr><td>Cliente</td><td>${report.generalData.cliente}</td></tr>
<tr><td>Fecha</td><td>${report.generalData.fecha}</td></tr>
<tr><td>Técnico</td><td>${report.generalData.tecnico}</td></tr>
</table>

<h3>Datos del Equipo</h3>
<table border="1">
<tr><td>Ubicación</td><td>${report.equipmentData.ubicacion}</td></tr>
<tr><td>Marca</td><td>${report.equipmentData.marca}</td></tr>
<tr><td>Modelo</td><td>${report.equipmentData.modelo}</td></tr>
<tr><td>Capacidad (BTU)</td><td>${report.equipmentData.capacidadBTU}</td></tr>
<tr><td>Número de serie</td><td>${report.equipmentData.numeroSerie}</td></tr>
</table>

<h3>Mediciones</h3>
<table border="1">
<tr><td>Presión de gas</td><td>${report.measurements.presionGas} psi</td></tr>
<tr><td>Corriente eléctrica</td><td>${report.measurements.corriente} A</td></tr>
<tr><td>Voltaje</td><td>${report.measurements.voltaje} V</td></tr>
</table>

<h3>Actividades Realizadas</h3>
<div>${activitiesHTML}</div>

<h3>Evidencia Fotográfica</h3>
<table>
<tr>
${photos.map(p => `<td><img src="${p}" style="width:100%;max-height:180px;" /></td>`).join('')}
</tr>
</table>

<h3>Observaciones / Recomendaciones</h3>
<div style="border:1px solid #000;padding:8px;">
${observationsText || 'Sin observaciones'}
</div>

<table style="margin-top:40px;">
<tr>
<td align="center">
${tecnico ? `<img src="${tecnico}" style="width:160px;" />` : ''}
<br/>Firma del Técnico
</td>
<td align="center">
${encargado ? `<img src="${encargado}" style="width:160px;" />` : ''}
<br/>Firma del Cliente / Responsable
</td>
</tr>
</table>

</body>
</html>
`;
}
