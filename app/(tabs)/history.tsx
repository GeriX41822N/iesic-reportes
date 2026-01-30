import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { generateAndSharePDF } from '../../utils/pdfGenerator';
import { getReports, Report } from '../../utils/reportStorage';

export default function HistoryScreen() {
  const [reports, setReports] = useState<Report[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const loadReports = async () => {
    const data = await getReports();
    setReports(data.reverse());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de reportes</Text>

      {reports.length === 0 ? (
        <Text style={styles.empty}>No hay reportes guardados 📭</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/history/[id]',
                  params: { id: item.id }, // ✅ SOLO ID
                })
              }
            >
              {/* INFO */}
              <View style={styles.info}>
                <Text style={styles.cardTitle}>
                  Cliente: {item.generalData.cliente}
                </Text>
                <Text style={styles.text}>
                  Fecha: {item.generalData.fecha}
                </Text>
                <Text style={styles.text}>
                  Técnico: {item.generalData.tecnico}
                </Text>
                <Text style={styles.date}>
                  Guardado:{' '}
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>

              {/* BOTÓN COMPARTIR */}
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => generateAndSharePDF(item)}
              >
                <Text style={styles.shareIcon}>📄</Text>
              </TouchableOpacity>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff',
  },
  empty: {
    color: '#aaa',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    color: '#ddd',
  },
  date: {
    color: '#999',
    marginTop: 6,
    fontSize: 12,
  },
  shareButton: {
    padding: 10,
    backgroundColor: '#1e5fa3',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: 18,
    color: '#fff',
  },
});
