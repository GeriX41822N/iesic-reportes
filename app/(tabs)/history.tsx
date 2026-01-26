import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { getReports, Report } from '../../utils/reportStorage';

export default function HistoryScreen() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

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
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/history/[id]',
                  params: {
                    id: index.toString(),
                    report: JSON.stringify(item),
                  },
                })
              }
            >
              <Text style={styles.cardTitle}>
                Cliente: {item.generalData.cliente}
              </Text>
              <Text style={styles.text}>Fecha: {item.generalData.fecha}</Text>
              <Text style={styles.text}>Técnico: {item.generalData.tecnico}</Text>
              <Text style={styles.date}>
                Guardado: {new Date(item.createdAt).toLocaleString()}
              </Text>
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
});
