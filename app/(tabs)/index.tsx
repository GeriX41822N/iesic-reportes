import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, ScrollView } from 'react-native';

import Activities from '../../components/report/Activities';
import EquipmentData from '../../components/report/EquipmentData';
import EvidencePhotos from '../../components/report/EvidencePhotos';
import GeneralData from '../../components/report/GeneralData';
import Measurements from '../../components/report/Measurements';
import Observations from '../../components/report/Observations';

import { saveReport } from '../../utils/reportStorage';
// updateReport lo haremos en el siguiente paso 😉

export default function NewReportScreen() {
  const params = useLocalSearchParams();

  const editingReport = params.report
    ? JSON.parse(params.report as string)
    : null;

  const [report, setReport] = useState(
    editingReport ?? {
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
    }
  );

  const isReportValid = () => {
    const { generalData, evidencePhotos } = report;

    const generalDataValid =
      generalData.cliente.trim() !== '' &&
      generalData.fecha.trim() !== '' &&
      generalData.tecnico.trim() !== '';

    const photosValid =
      !!evidencePhotos.filtros &&
      !!evidencePhotos.serpentines &&
      !!evidencePhotos.turbina &&
      !!evidencePhotos.ventilador;

    return generalDataValid && photosValid;
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <GeneralData
        data={report.generalData}
        onChange={(updatedData) =>
          setReport({ ...report, generalData: updatedData })
        }
      />

      <EquipmentData />
      <Measurements />

      <EvidencePhotos
        data={report.evidencePhotos}
        onChange={(updatedPhotos) =>
          setReport({ ...report, evidencePhotos: updatedPhotos })
        }
      />

      <Activities />
      <Observations />

      <Button
        title={editingReport ? 'Actualizar reporte ✏️' : 'Guardar reporte'}
        disabled={!isReportValid()}
        onPress={async () => {
          if (editingReport) {
            // updateReport(report) ← siguiente paso
            Alert.alert('Reporte actualizado ✏️');
          } else {
            await saveReport(report);
            Alert.alert('Reporte guardado ✅');
          }

          router.replace('/history');
        }}
      />
    </ScrollView>
  );
}
