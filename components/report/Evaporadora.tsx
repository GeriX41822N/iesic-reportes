import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export type EvaporadoraData = {
  limpiezaFiltros: boolean;
  limpiezaSerpentin: boolean;
  revisionTurbina: boolean;
  limpiezaDrenaje: boolean;
  revisionTarjeta: boolean;
  revisionSensores: boolean;
  revisionCableado: boolean;
  pruebaEncendido: boolean;
  medicionTemperatura: boolean;
  observaciones: string;
};

type Props = {
  data: EvaporadoraData;
  onChange: (data: EvaporadoraData) => void;
};

export default function Evaporadora({ data, onChange }: Props) {

  const toggle = (key: keyof EvaporadoraData) => {
    if (key === "observaciones") return;

    onChange({
      ...data,
      [key]: !data[key],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unidad Evaporadora</Text>

      {Object.entries(data).map(([key, value]) => {

        if (key === "observaciones") return null;

        return (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{key}</Text>
            <Switch
              value={value as boolean}
              onValueChange={() => toggle(key as keyof EvaporadoraData)}
            />
          </View>
        );
      })}

      <TextInput
        style={styles.input}
        placeholder="Observaciones evaporadora"
        placeholderTextColor="#888"
        value={data.observaciones}
        onChangeText={(text) =>
          onChange({ ...data, observaciones: text })
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