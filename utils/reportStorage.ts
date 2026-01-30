import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'reports';

export type Report = {
  id: string;

  generalData: {
    cliente: string;
    fecha: string;
    tecnico: string;
  };

  equipmentData: {
    ubicacion: string;
    marca: string;
    modelo: string;
    capacidadBTU: string;
    numeroSerie: string;
  };

  evidencePhotos: {
    filtros: string | null;       // 👈 rutas a archivos
    serpentines: string | null;
    turbina: string | null;
    ventilador: string | null;
  };

  activities: {
    limpiezaFiltros: boolean;
    limpiezaEvaporador: boolean;
    limpiezaCondensador: boolean;
    limpiezaDrenaje: boolean;
    ajusteTornilleria: boolean;
    revisionGas: boolean;
    medicionElectrica: boolean;
    revisionControlRemoto: boolean;
    verificacionGeneral: boolean;
  };

  measurements: {
    presionGas: string;
    corriente: string;
    voltaje: string;
  };

  observations: {
    plantillas: {
      parametrosNormales: boolean;
      consumoElevado: boolean;
      obstruccionDrenaje: boolean;
      recomendacionPreventivo: boolean;
    };
    comentarioLibre: string;
  };

  // 🖋️ ahora SOLO rutas
  signatures: {
    tecnico: string;    // file://...
    encargado: string; // file://...
    fechaFirma: string;
  };

  createdAt: string;
};

// 🆔 GENERADOR DE ID
function generateReportId(tecnico: string) {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const timestamp =
    now.getFullYear().toString().slice(2) +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());

  const initials = tecnico
    .trim()
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

  return `${timestamp}-${initials}`;
}

// 🆕 CREAR REPORTE
export async function saveReport(
  report: Omit<Report, 'id' | 'createdAt'>
): Promise<Report> {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const reports: Report[] = existing ? JSON.parse(existing) : [];

    const newReport: Report = {
      ...report,
      id: generateReportId(report.generalData.tecnico),
      createdAt: new Date().toISOString(),
    };

    reports.push(newReport);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

    return newReport;
  } catch (error) {
    console.error('Error guardando reporte', error);
    throw error;
  }
}

// ✏️ ACTUALIZAR REPORTE
export async function updateReport(updatedReport: Report): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const reports: Report[] = existing ? JSON.parse(existing) : [];

    const updated = reports.map(r =>
      r.id === updatedReport.id ? updatedReport : r
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error actualizando reporte', error);
    throw error;
  }
}

// 📖 LEER REPORTES
export async function getReports(): Promise<Report[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error leyendo reportes', error);
    return [];
  }
}

// 🗑️ ELIMINAR REPORTE
export async function deleteReport(id: string): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const reports: Report[] = existing ? JSON.parse(existing) : [];

    const filtered = reports.filter(r => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error eliminando reporte', error);
    throw error;
  }
}
