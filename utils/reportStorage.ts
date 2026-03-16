import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'reports';

export type Report = {
  id: string;

  serviceType: "Preventivo" | "Correctivo" | "Diagnostico";

  generalData: {
    cliente: string;
    direccion: string;
    ciudad: string;
    contacto: string;
    telefono: string;

    fecha: string;
    horaInicio: string;
    horaFin: string;

    tecnico: string;
    ayudante: string;
  };

  equipmentData: {
    ubicacion: string;
    marca: string;
    modelo: string;
    capacidadBTU: string;
    numeroSerie: string;
  };

  evaporadora: {
    limpiezaFiltros: boolean;
    limpiezaSerpentin: boolean;
    revisionTurbina: boolean;
    limpiezaDrenaje: boolean;
    revisionTarjeta: boolean;
    revisionSensores: boolean;
    revisionCableado: boolean;
    pruebaEncendido: boolean;
    medicionTemperatura: boolean;
    observaciones: string;
  };

  condensadora: {
    limpiezaSerpentin: boolean;
    revisionVentilador: boolean;
    revisionCompresor: boolean;
    revisionContactor: boolean;
    revisionCapacitor: boolean;
    revisionPresiones: boolean;
    revisionFugas: boolean;
    ajusteConexiones: boolean;
    revisionElectrica: boolean;
    observaciones: string;
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

  refacciones: {
    gas: boolean;
    capacitor: boolean;
    contactor: boolean;
    tarjeta: boolean;
    motorVentilador: boolean;
    compresor: boolean;
    otro: string;
  };

  diagnostico: {
    operando: boolean;
    mantenimientoMayor: boolean;
    requiereRefacciones: boolean;
    cambioEquipo: boolean;
    fueraServicio: boolean;
    comentario: string;
  };

  evidencePhotos: {
    filtros: string | null;
    serpentines: string | null;
    turbina: string | null;
    ventilador: string | null;
  };

  signatures: {
    tecnico: string;
    encargado: string;
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

      serviceType: report.serviceType ?? "Preventivo",

      generalData: {
        cliente: report.generalData?.cliente ?? "",
        direccion: report.generalData?.direccion ?? "",
        ciudad: report.generalData?.ciudad ?? "",
        contacto: report.generalData?.contacto ?? "",
        telefono: report.generalData?.telefono ?? "",

        fecha: report.generalData?.fecha ?? "",
        horaInicio: report.generalData?.horaInicio ?? "",
        horaFin: report.generalData?.horaFin ?? "",

        tecnico: report.generalData?.tecnico ?? "",
        ayudante: report.generalData?.ayudante ?? ""
      },

      equipmentData: report.equipmentData ?? {
        ubicacion: "",
        marca: "",
        modelo: "",
        capacidadBTU: "",
        numeroSerie: ""
      },

      evaporadora: report.evaporadora ?? {
        limpiezaFiltros: false,
        limpiezaSerpentin: false,
        revisionTurbina: false,
        limpiezaDrenaje: false,
        revisionTarjeta: false,
        revisionSensores: false,
        revisionCableado: false,
        pruebaEncendido: false,
        medicionTemperatura: false,
        observaciones: ""
      },

      condensadora: report.condensadora ?? {
        limpiezaSerpentin: false,
        revisionVentilador: false,
        revisionCompresor: false,
        revisionContactor: false,
        revisionCapacitor: false,
        revisionPresiones: false,
        revisionFugas: false,
        ajusteConexiones: false,
        revisionElectrica: false,
        observaciones: ""
      },

      measurements: report.measurements ?? {
        presionGas: "",
        corriente: "",
        voltaje: ""
      },

      observations: report.observations ?? {
        plantillas: {
          parametrosNormales: false,
          consumoElevado: false,
          obstruccionDrenaje: false,
          recomendacionPreventivo: false
        },
        comentarioLibre: ""
      },

      refacciones: report.refacciones ?? {
        gas: false,
        capacitor: false,
        contactor: false,
        tarjeta: false,
        motorVentilador: false,
        compresor: false,
        otro: ""
      },

      diagnostico: report.diagnostico ?? {
        operando: false,
        mantenimientoMayor: false,
        requiereRefacciones: false,
        cambioEquipo: false,
        fueraServicio: false,
        comentario: ""
      },

      evidencePhotos: report.evidencePhotos ?? {
        filtros: null,
        serpentines: null,
        turbina: null,
        ventilador: null
      },

      signatures: report.signatures ?? {
        tecnico: "",
        encargado: "",
        fechaFirma: ""
      },

      id: generateReportId(report.generalData.tecnico),

      createdAt: new Date().toISOString()
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