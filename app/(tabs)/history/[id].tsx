import { router, useLocalSearchParams } from 'expo-router';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { generateAndSharePDF } from '../../../utils/pdfGenerator';
import { deleteReport, Report } from '../../../utils/reportStorage';

export default function ReportDetailScreen() {
  const { report } = useLocalSearchParams();

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Reporte no encontrado 😕</Text>
      </View>
    );
  }

  const parsed: Report = JSON.parse(report as string);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalle del reporte</Text>

      {/* DATOS GENERALES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos generales</Text>
        <Text style={styles.text}>Cliente: {parsed.generalData.cliente}</Text>
        <Text style={styles.text}>Fecha: {parsed.generalData.fecha}</Text>
        <Text style={styles.text}>Técnico: {parsed.generalData.tecnico}</Text>
        <Text style={styles.text}>Folio: {parsed.id}</Text>
      </View>

      {/* DATOS DEL EQUIPO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos del equipo</Text>
        <Text style={styles.text}>Ubicación: {parsed.equipmentData.ubicacion}</Text>
        <Text style={styles.text}>Marca: {parsed.equipmentData.marca}</Text>
        <Text style={styles.text}>Modelo: {parsed.equipmentData.modelo}</Text>
        <Text style={styles.text}>Capacidad BTU: {parsed.equipmentData.capacidadBTU}</Text>
        <Text style={styles.text}>No. Serie: {parsed.equipmentData.numeroSerie}</Text>
      </View>

      {/* ACTIVIDADES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividades realizadas</Text>
        {Object.entries(parsed.activities).map(([key, value]) => (
          <Text key={key} style={styles.text}>
            {value ? '✅' : '❌'} {key}
          </Text>
        ))}
      </View>

      {/* MEDICIONES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mediciones</Text>
        <Text style={styles.text}>
          Presión gas: {parsed.measurements.presionGas}
        </Text>
        <Text style={styles.text}>
          Corriente: {parsed.measurements.corriente}
        </Text>
        <Text style={styles.text}>
          Voltaje: {parsed.measurements.voltaje}
        </Text>
      </View>

      {/* OBSERVACIONES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Observaciones</Text>
        <Text style={styles.text}>
          {parsed.observations.comentarioLibre || 'Sin observaciones'}
        </Text>
      </View>

      {/* EVIDENCIA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evidencia fotográfica</Text>
        <Text style={styles.text}>
          Filtros: {parsed.evidencePhotos.filtros ? '✅' : '❌'}
        </Text>
        <Text style={styles.text}>
          Serpentines: {parsed.evidencePhotos.serpentines ? '✅' : '❌'}
        </Text>
        <Text style={styles.text}>
          Turbina: {parsed.evidencePhotos.turbina ? '✅' : '❌'}
        </Text>
        <Text style={styles.text}>
          Ventilador: {parsed.evidencePhotos.ventilador ? '✅' : '❌'}
        </Text>
      </View>

      {/* FECHA */}
      <Text style={styles.date}>
        Guardado: {new Date(parsed.createdAt).toLocaleString()}
      </Text>

      {/* BOTONES */}
      <View style={{ marginTop: 16 }}>
        <Button
          title="Compartir PDF 📄"
          onPress={() => generateAndSharePDF(parsed)}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Editar reporte ✏️"
          onPress={() =>
            router.push({
              pathname: '/',
              params: {
                report: JSON.stringify(parsed),
              },
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
                    await deleteReport(parsed.id);
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
