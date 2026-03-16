import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export type DiagnosticoData = {
  operando: boolean;
  mantenimientoMayor: boolean;
  requiereRefacciones: boolean;
  cambioEquipo: boolean;
  fueraServicio: boolean;
  comentario: string;
};

type Props = {
  data: DiagnosticoData;
  onChange: (data: DiagnosticoData) => void;
};

export default function Diagnostico({ data, onChange }: Props) {

  const toggle = (key: keyof DiagnosticoData) => {
    if (key === "comentario") return;

    onChange({
      ...data,
      [key]: !data[key],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnóstico general</Text>

      {Object.entries(data).map(([key, value]) => {

        if (key === "comentario") return null;

        return (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{key}</Text>
            <Switch
              value={value as boolean}
              onValueChange={() => toggle(key as keyof DiagnosticoData)}
            />
          </View>
        );
      })}

      <TextInput
        style={styles.input}
        placeholder="Comentario diagnóstico"
        placeholderTextColor="#888"
        value={data.comentario}
        onChangeText={(text) =>
          onChange({ ...data, comentario: text })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },

  title: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  label: {
    color: '#ddd',
  },

  input: {
    backgroundColor: '#111',
    color: '#fff',
    marginTop: 10,
    padding: 8,
    borderRadius: 6,
  },
});