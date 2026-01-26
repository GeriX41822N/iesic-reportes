import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { deleteReport } from '../../../utils/reportStorage';

export default function ReportDetailScreen() {
  const { report } = useLocalSearchParams();

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Reporte no encontrado 😕</Text>
      </View>
    );
  }

  const parsed = JSON.parse(report as string);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalle del reporte</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos generales</Text>
        <Text style={styles.text}>Cliente: {parsed.generalData.cliente}</Text>
        <Text style={styles.text}>Fecha: {parsed.generalData.fecha}</Text>
        <Text style={styles.text}>Técnico: {parsed.generalData.tecnico}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evidencia fotográfica</Text>
        <Text style={styles.text}>Filtros: {parsed.evidencePhotos.filtros ? '✅' : '❌'}</Text>
        <Text style={styles.text}>Serpentines: {parsed.evidencePhotos.serpentines ? '✅' : '❌'}</Text>
        <Text style={styles.text}>Turbina: {parsed.evidencePhotos.turbina ? '✅' : '❌'}</Text>
        <Text style={styles.text}>Ventilador: {parsed.evidencePhotos.ventilador ? '✅' : '❌'}</Text>
      </View>

      <Text style={styles.date}>
        Guardado: {new Date(parsed.createdAt).toLocaleString()}
      </Text>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#000', flexGrow: 1 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  section: { marginBottom: 20, backgroundColor: '#222', padding: 12, borderRadius: 8 },
  sectionTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 8 },
  text: { color: '#ddd', marginBottom: 4 },
  date: { color: '#999', fontSize: 12, marginTop: 12, textAlign: 'center' },
});
