import { StyleSheet, Text, TextInput, View } from 'react-native';

export type EquipmentDataType = {
  ubicacion: string;
  marca: string;
  modelo: string;
  capacidadBTU: string;
  numeroSerie: string;
};

type Props = {
  data: EquipmentDataType;
  onChange: (data: EquipmentDataType) => void;
};

export default function EquipmentData({ data, onChange }: Props) {
  function updateField(
    key: keyof EquipmentDataType,
    value: string
  ) {
    onChange({
      ...data,
      [key]: value,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos del equipo</Text>

      <TextInput
        style={styles.input}
        placeholder="Ubicación"
        placeholderTextColor="#777"
        value={data.ubicacion}
        onChangeText={(v) => updateField('ubicacion', v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Marca"
        placeholderTextColor="#777"
        value={data.marca}
        onChangeText={(v) => updateField('marca', v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Modelo / Número"
        placeholderTextColor="#777"
        value={data.modelo}
        onChangeText={(v) => updateField('modelo', v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Capacidad (BTU)"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={data.capacidadBTU}
        onChangeText={(v) =>
          updateField('capacidadBTU', v.replace(/[^0-9]/g, ''))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Número de serie"
        placeholderTextColor="#777"
        value={data.numeroSerie}
        onChangeText={(v) => updateField('numeroSerie', v)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
});
