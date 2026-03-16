import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export type RefaccionesData = {
  gas: boolean;
  capacitor: boolean;
  contactor: boolean;
  tarjeta: boolean;
  motorVentilador: boolean;
  compresor: boolean;
  otro: string;
};

type Props = {
  data: RefaccionesData;
  onChange: (data: RefaccionesData) => void;
};

export default function Refacciones({ data, onChange }: Props) {

  const toggle = (key: keyof RefaccionesData) => {
    if (key === "otro") return;

    onChange({
      ...data,
      [key]: !data[key],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refacciones necesarias</Text>

      {Object.entries(data).map(([key, value]) => {

        if (key === "otro") return null;

        return (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{key}</Text>
            <Switch
              value={value as boolean}
              onValueChange={() => toggle(key as keyof RefaccionesData)}
            />
          </View>
        );
      })}

      <TextInput
        style={styles.input}
        placeholder="Otra refacción"
        placeholderTextColor="#888"
        value={data.otro}
        onChangeText={(text) =>
          onChange({ ...data, otro: text })
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