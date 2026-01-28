import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView } from 'react-native';
import Activities, { ActivitiesData } from '../../components/report/Activities';
import EquipmentData from '../../components/report/EquipmentData';
import EvidencePhotos from '../../components/report/EvidencePhotos';
import GeneralData from '../../components/report/GeneralData';
import Measurements from '../../components/report/Measurements';
import Observations, {
  EMPTY_OBSERVATIONS,
} from '../../components/report/Observations';
import Signatures from '../../components/report/Signatures';
import { generateAndSharePDF } from '../../utils/pdfGenerator';
import { getReports, Report, saveReport, updateReport, } from '../../utils/reportStorage';
/* 🔧 Estado inicial correcto */
const EMPTY_ACTIVITIES: ActivitiesData = {
  limpiezaFiltros: false,
  limpiezaEvaporador: false,
  limpiezaCondensador: false,
  limpiezaDrenaje: false,
  ajusteTornilleria: false,
  revisionGas: false,
  medicionElectrica: false,
  revisionControlRemoto: false,
  verificacionGeneral: false,
};
const EMPTY_MEASUREMENTS = {
  presionGas: '',
  corriente: '',
  voltaje: '',
};

const EMPTY_REPORT: Omit<Report, 'id' | 'createdAt'> = {
  generalData: {
    cliente: '',
    fecha: '',
    tecnico: '',
  },
  equipmentData: {
    ubicacion: '',
    marca: '',
    modelo: '',
    capacidadBTU: '',
    numeroSerie: '',
  },
  evidencePhotos: {
    filtros: null,
    serpentines: null,
    turbina: null,
    ventilador: null,
  },
  activities: EMPTY_ACTIVITIES,
  measurements: EMPTY_MEASUREMENTS,
  observations: EMPTY_OBSERVATIONS,
  signatures: {
    tecnico: '',
    encargado: '',
    fechaFirma: '',
  },
};

export default function NewReportScreen() {
  const params = useLocalSearchParams();

  const editingReport: Report | null = params.report
    ? JSON.parse(params.report as string)
    : null;

  const isEditing = !!editingReport;

  const [report, setReport] =
    useState<Omit<Report, 'id' | 'createdAt'> | Report>(EMPTY_REPORT);

useEffect(() => {
  if (editingReport) {
    setReport({
      ...editingReport,
      activities: editingReport.activities ?? EMPTY_ACTIVITIES,
      measurements: editingReport.measurements ?? EMPTY_MEASUREMENTS,
      observations: editingReport.observations ?? EMPTY_OBSERVATIONS,
      signatures: editingReport.signatures ?? {
        tecnico: '',
        encargado: '',
        fechaFirma: '',
      },
    });
  } else {
    setReport(EMPTY_REPORT);
  }
}, [editingReport]);


  const isReportValid = () => {
    const { generalData, evidencePhotos } = report as Report;

    const generalDataValid =
      generalData.cliente.trim() !== '' &&
      generalData.fecha.trim() !== '' &&
      generalData.tecnico.trim() !== '';

    if (isEditing) return generalDataValid;

    const photosValid =
      !!evidencePhotos.filtros &&
      !!evidencePhotos.serpentines &&
      !!evidencePhotos.turbina &&
      !!evidencePhotos.ventilador;

    return generalDataValid && photosValid;
  };

const handleSave = async () => {
  if (isEditing) {
    await updateReport(report as Report);
    Alert.alert(
      'Reporte actualizado ✏️',
      '¿Deseas compartir el PDF?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Compartir PDF 📄',
          onPress: () =>
            generateAndSharePDF(report as Report),
        },
      ]
    );
  } else {
    await saveReport(report as Omit<Report, 'id' | 'createdAt'>);

    const reports = await getReports();
    const savedReport = reports.at(-1);

    Alert.alert(
      'Reporte guardado ✅',
      '¿Deseas compartir el PDF?',
      [
        { text: 'Después', style: 'cancel' },
        {
          text: 'Compartir PDF 📄',
          onPress: () =>
            savedReport &&
            generateAndSharePDF(savedReport),
        },
      ]
    );
  }

  setReport(EMPTY_REPORT);
  router.replace('/history');
};

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <GeneralData
        data={(report as Report).generalData}
        onChange={(generalData) =>
          setReport({ ...(report as any), generalData })
        }
      />

      <EquipmentData
        data={(report as Report).equipmentData}
        onChange={(equipmentData) =>
          setReport({ ...(report as any), equipmentData })
        }
      />

      <Measurements
        data={(report as Report).measurements}
        onChange={(measurements) =>
          setReport({ ...(report as any), measurements })
        }
      />

      <EvidencePhotos
        data={(report as Report).evidencePhotos}
        onChange={(evidencePhotos) =>
          setReport({ ...(report as any), evidencePhotos })
        }
      />

      <Activities
        data={(report as Report).activities}
        onChange={(activities) =>
          setReport({ ...(report as any), activities })
        }
      />

      <Observations
        data={(report as Report).observations}
        onChange={(observations) =>
          setReport({ ...(report as any), observations })
        }
      />

      <Signatures
        data={(report as Report).signatures}
        onChange={(signatures) =>
          setReport({ ...(report as any), signatures })
        }
      />

      <Button
        title={isEditing ? 'Actualizar reporte ✏️' : 'Guardar reporte'}
        disabled={!isReportValid()}
        onPress={handleSave}
      />


    </ScrollView>
  );
}
