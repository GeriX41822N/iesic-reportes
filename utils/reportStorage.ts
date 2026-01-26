import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'reports';

export type Report = {
  id: string;
  generalData: {
    cliente: string;
    fecha: string;
    tecnico: string;
  };
  evidencePhotos: {
    filtros: string | null;
    serpentines: string | null;
    turbina: string | null;
    ventilador: string | null;
  };
  createdAt: string;
};

// 🆔 GENERADOR DE ID PROFESIONAL
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
) {
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
  } catch (error) {
    console.error('Error guardando reporte', error);
  }
}

// ✏️ ACTUALIZAR REPORTE (NO toca ID)
export async function updateReport(updatedReport: Report) {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const reports: Report[] = existing ? JSON.parse(existing) : [];

    const updated = reports.map((report) =>
      report.id === updatedReport.id ? updatedReport : report
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error actualizando reporte', error);
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
