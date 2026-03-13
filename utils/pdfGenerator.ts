import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COPPEL_LOGO_BASE64 } from "../utils/logoCoppelBase64";
import { ILUMILED_LOGO_BASE64 } from './logoIlumiledBase64';
import { Report } from './reportStorage';

let isSharing = false;

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

  async function buildPhotoSet(title: string, photos: any) {

    const antes = photos.antes
      ? `data:image/jpeg;base64,${await fileToBase64(photos.antes)}`
      : '';

    const durante = photos.durante
      ? `data:image/jpeg;base64,${await fileToBase64(photos.durante)}`
      : '';

    const despues = photos.despues
      ? `data:image/jpeg;base64,${await fileToBase64(photos.despues)}`
      : '';

    return `
      <h3>${title}</h3>

      <table class="photos" border="1">
        <tr>
          <td align="center"><strong>Antes</strong></td>
          <td align="center"><strong>Durante</strong></td>
          <td align="center"><strong>Después</strong></td>
        </tr>

        <tr>
          <td>${antes ? `<img src="${antes}" />` : ''}</td>
          <td>${durante ? `<img src="${durante}" />` : ''}</td>
          <td>${despues ? `<img src="${despues}" />` : ''}</td>
        </tr>
      </table>
    `;
  }

  const filtrosHTML = await buildPhotoSet("Filtros", report.evidencePhotos.filtros);
  const serpentinesHTML = await buildPhotoSet("Serpentines", report.evidencePhotos.serpentines);
  const turbinaHTML = await buildPhotoSet("Turbina", report.evidencePhotos.turbina);
  const ventiladorHTML = await buildPhotoSet("Ventilador", report.evidencePhotos.ventilador);


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

@page {
  size: letter;
  margin: 15mm;
}

body {
  font-family: Arial;
  font-size: 10px;
  line-height: 1.2;
}

h3 {
  color: #1e5fa3;
  font-size: 13px;
  margin: 10px 0 4px 0;
}

table {
  border-collapse: collapse;
  width: 100%;
}

td {
  padding: 4px;
  vertical-align: top;
}

.box {
  border: 1px solid #000;
  padding: 6px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #1e5fa3;
  text-align: center;
  margin-top: 5px;
  margin-bottom: 10px;
}

.photos img {
  width: 100%;
  max-height: 120px;
  object-fit: cover;
}

.signatures img {
  width: 140px;
}

.no-break {
  page-break-inside: avoid;
}

</style>
</head>

<body>

<!-- HEADER -->

<table>
<tr>

<td width="25%">
<img src="${ILUMILED_LOGO_BASE64}" style="width:90px;" />
</td>

<td width="25%" align="center">
<img src="${COPPEL_LOGO_BASE64}" style="width:90px;" />
</td>

<td width="50%" align="right">
<strong>FOLIO:</strong> ${report.id}
</td>

</tr>
</table>

<div class="header-title">
REPORTE DE MANTENIMIENTO DE AIRE ACONDICIONADO
</div>


<!-- DATOS GENERALES -->

<h3>Datos Generales</h3>

<table border="1">

<tr><td>Cliente</td><td>${report.generalData.cliente}</td></tr>

<tr><td>Fecha</td><td>${report.generalData.fecha}</td></tr>

<tr><td>Técnico</td><td>${report.generalData.tecnico}</td></tr>

</table>


<!-- DATOS DEL EQUIPO -->

<h3>Datos del Equipo</h3>

<table border="1">

<tr><td>Ubicación</td><td>${report.equipmentData.ubicacion}</td></tr>

<tr><td>Marca</td><td>${report.equipmentData.marca}</td></tr>

<tr><td>Modelo</td><td>${report.equipmentData.modelo}</td></tr>

<tr><td>Capacidad (BTU)</td><td>${report.equipmentData.capacidadBTU}</td></tr>

<tr><td>Número de serie</td><td>${report.equipmentData.numeroSerie}</td></tr>

</table>


<!-- MEDICIONES -->

<h3>Mediciones</h3>

<table border="1">

<tr><td>Presión de gas</td><td>${report.measurements.presionGas} psi</td></tr>

<tr><td>Corriente eléctrica</td><td>${report.measurements.corriente} A</td></tr>

<tr><td>Voltaje</td><td>${report.measurements.voltaje} V</td></tr>

</table>


<!-- ACTIVIDADES -->

<h3>Actividades Realizadas</h3>

<div class="box">
${activitiesHTML}
</div>


<!-- FOTOS -->

<h3>Evidencia Fotográfica</h3>

${filtrosHTML}
${serpentinesHTML}
${turbinaHTML}
${ventiladorHTML}


<!-- OBSERVACIONES -->

<h3>Observaciones / Recomendaciones</h3>

<div class="box">
${observationsText || 'Sin observaciones'}
</div>


<!-- FIRMAS -->

<table class="signatures no-break" style="margin-top:20px;">

<tr>

<td align="center">

${tecnico ? `<img src="${tecnico}" style="width:160px;" />` : ''}

<div style="border-top:1px solid #000;width:80%;margin:auto;"></div>

Firma del Técnico

</td>

<td align="center">

${encargado ? `<img src="${encargado}" style="width:160px;" />` : ''}

<div style="border-top:1px solid #000;width:80%;margin:auto;"></div>

Firma del Cliente / Responsable

</td>

</tr>

</table>

</body>
</html>
`;
}