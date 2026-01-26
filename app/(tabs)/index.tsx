import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView } from 'react-native';

import Activities from '../../components/report/Activities';
import EquipmentData from '../../components/report/EquipmentData';
import EvidencePhotos from '../../components/report/EvidencePhotos';
import GeneralData from '../../components/report/GeneralData';
import Measurements from '../../components/report/Measurements';
import Observations from '../../components/report/Observations';

import { Report, saveReport, updateReport } from '../../utils/reportStorage';

const EMPTY_REPORT: Omit<Report, 'id' | 'createdAt'> = {
  generalData: {
    cliente: '',
    fecha: '',
    tecnico: '',
  },
  evidencePhotos: {
    filtros: null,
    serpentines: null,
    turbina: null,
    ventilador: null,
  },
};

export default function NewReportScreen() {
  const params = useLocalSearchParams();

  const editingReport: Report | null = params.report
    ? JSON.parse(params.report as string)
    : null;

  const isEditing = !!editingReport;

  const [report, setReport] = useState<
    Omit<Report, 'id' | 'createdAt'> | Report
  >(editingReport ?? EMPTY_REPORT);

  // 🧼 Si entras sin params → formulario limpio
  useEffect(() => {
    if (!editingReport) {
      setReport(EMPTY_REPORT);
    }
  }, [params.report]);

  // ✅ VALIDACIÓN INTELIGENTE
  const isReportValid = () => {
    const { generalData, evidencePhotos } = report as any;

    const generalDataValid =
      generalData.cliente.trim() !== '' &&
      generalData.fecha.trim() !== '' &&
      generalData.tecnico.trim() !== '';

    if (isEditing) {
      // ✏️ en edición NO obligamos a rehacer fotos
      return generalDataValid;
    }

    // 🆕 nuevo reporte → todo obligatorio
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
      Alert.alert('Reporte actualizado ✏️');
    } else {
      await saveReport(report as Omit<Report, 'id' | 'createdAt'>);
      Alert.alert('Reporte guardado ✅');
    }

    // 🧼 limpiar formulario
    setReport(EMPTY_REPORT);

    // 🔄 cerrar ciclo → historial
    router.replace('/history');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <GeneralData
        data={(report as any).generalData}
        onChange={(updatedData) =>
          setReport({
            ...(report as any),
            generalData: updatedData,
          })
        }
      />

      <EquipmentData />
      <Measurements />

      <EvidencePhotos
        data={(report as any).evidencePhotos}
        onChange={(updatedPhotos) =>
          setReport({
            ...(report as any),
            evidencePhotos: updatedPhotos,
          })
        }
      />

      <Activities />
      <Observations />

      <Button
        title={isEditing ? 'Actualizar reporte ✏️' : 'Guardar reporte'}
        disabled={!isReportValid()}
        onPress={handleSave}
      />
    </ScrollView>
  );
}
