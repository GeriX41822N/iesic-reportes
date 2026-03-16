import { StyleSheet, Text, TextInput, View } from 'react-native';

export type MeasurementsData = {
  presionGas: string;
  corriente: string;
  voltaje: string;
};

type Props = {
  data: MeasurementsData;
  onChange: (data: MeasurementsData) => void;
};

export default function Measurements({ data, onChange }: Props) {
  function updateField(
    key: keyof MeasurementsData,
    value: string
  ) {
    // 🔢 solo números y punto decimal
    const sanitized = value.replace(/[^0-9.]/g, '');

    onChange({
      ...data,
      [key]: sanitized,
    });
  }   

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mediciones</Text>

      <TextInput
        style={styles.input}
        placeholder="Presión de gas (psi)"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={data.presionGas}
        onChangeText={(v) => updateField('presionGas', v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Corriente eléctrica (A)"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={data.corriente}
        onChangeText={(v) => updateField('corriente', v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Voltaje de alimentación (V)"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={data.voltaje}
        onChangeText={(v) => updateField('voltaje', v)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
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
