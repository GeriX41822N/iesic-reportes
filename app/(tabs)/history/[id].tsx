import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { generateAndSharePDF } from '../../../utils/pdfGenerator';
import { deleteReport, getReports, Report } from '../../../utils/reportStorage';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    const reports = await getReports();
    const found = reports.find(r => r.id === id);

    setReport(found ?? null);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Cargando reporte… ⏳</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Reporte no encontrado 😕</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalle del reporte</Text>

      {/* DATOS GENERALES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos generales</Text>
        <Text style={styles.text}>Cliente: {report.generalData.cliente}</Text>
        <Text style={styles.text}>Fecha: {report.generalData.fecha}</Text>
        <Text style={styles.text}>Técnico: {report.generalData.tecnico}</Text>
        <Text style={styles.text}>Folio: {report.id}</Text>
      </View>

      {/* DATOS DEL EQUIPO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos del equipo</Text>
        <Text style={styles.text}>Ubicación: {report.equipmentData.ubicacion}</Text>
        <Text style={styles.text}>Marca: {report.equipmentData.marca}</Text>
        <Text style={styles.text}>Modelo: {report.equipmentData.modelo}</Text>
        <Text style={styles.text}>
          Capacidad BTU: {report.equipmentData.capacidadBTU}
        </Text>
        <Text style={styles.text}>
          No. Serie: {report.equipmentData.numeroSerie}
        </Text>
      </View>

      {/* ACTIVIDADES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividades realizadas</Text>
        {Object.entries(report.activities).map(([key, value]) => (
          <Text key={key} style={styles.text}>
            {value ? '✅' : '❌'} {key}
          </Text>
        ))}
      </View>

      {/* MEDICIONES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mediciones</Text>
        <Text style={styles.text}>
          Presión gas: {report.measurements.presionGas}
        </Text>
        <Text style={styles.text}>
          Corriente: {report.measurements.corriente}
        </Text>
        <Text style={styles.text}>
          Voltaje: {report.measurements.voltaje}
        </Text>
      </View>

      {/* OBSERVACIONES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Observaciones</Text>
        <Text style={styles.text}>
          {report.observations.comentarioLibre || 'Sin observaciones'}
        </Text>
      </View>

      {/* EVIDENCIA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evidencia fotográfica</Text>
        <Text style={styles.text}>
          Filtros: {report.evidencePhotos.filtros ? '✅' : '❌'}
        </Text>
        <Text style={styles.text}>
          Serpentines: {report.evidencePhotos.serpentines ? '✅' : '❌'}
        </Text>
        <Text style={styles.text}>
          Turbina: {report.evidencePhotos.turbina ? '✅' : '❌'}
        </Text>
        <Text style={styles.text}>
          Ventilador: {report.evidencePhotos.ventilador ? '✅' : '❌'}
        </Text>
      </View>

      {/* FECHA */}
      <Text style={styles.date}>
        Guardado: {new Date(report.createdAt).toLocaleString()}
      </Text>

      {/* BOTONES */}
      <View style={{ marginTop: 16 }}>
        <Button
          title="Compartir PDF 📄"
          onPress={() => generateAndSharePDF(report)}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Editar reporte ✏️"
          onPress={() =>
            router.push({
              pathname: '/',
              params: { id: report.id }, // 👈 mismo patrón: SOLO ID
            })
          }
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Eliminar reporte 🗑️"
          color="red"
          onPress={() => {
            Alert.alert(
              'Eliminar reporte',
              '¿Seguro que deseas eliminar este reporte? Esta acción no se puede deshacer.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Eliminar',
                  style: 'destructive',
                  onPress: async () => {
                    await deleteReport(report.id);
                    router.replace('/history');
                  },
                },
              ]
            );
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#000',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    color: '#ddd',
    marginBottom: 4,
  },
  date: {
    color: '#999',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
});
