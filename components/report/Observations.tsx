import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export type ObservationsData = {
  plantillas: {
    parametrosNormales: boolean;
    consumoElevado: boolean;
    obstruccionDrenaje: boolean;
    recomendacionPreventivo: boolean;
  };
  comentarioLibre: string;
};

type Props = {
  data: ObservationsData;
  onChange: (data: ObservationsData) => void;
};

export const EMPTY_OBSERVATIONS: ObservationsData = {
  plantillas: {
    parametrosNormales: true,
    consumoElevado: false,
    obstruccionDrenaje: false,
    recomendacionPreventivo: true,
  },
  comentarioLibre: '',
};

export default function Observations({ data, onChange }: Props) {
  function toggle(key: keyof ObservationsData['plantillas']) {
    onChange({
      ...data,
      plantillas: {
        ...data.plantillas,
        [key]: !data.plantillas[key],
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Observaciones / Recomendaciones</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Parámetros normales</Text>
        <Switch
          value={data.plantillas.parametrosNormales}
          onValueChange={() => toggle('parametrosNormales')}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Consumo de corriente elevado</Text>
        <Switch
          value={data.plantillas.consumoElevado}
          onValueChange={() => toggle('consumoElevado')}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Obstrucción en drenaje</Text>
        <Switch
          value={data.plantillas.obstruccionDrenaje}
          onValueChange={() => toggle('obstruccionDrenaje')}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Recomendar mantenimiento cada 3 meses</Text>
        <Switch
          value={data.plantillas.recomendacionPreventivo}
          onValueChange={() => toggle('recomendacionPreventivo')}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Comentario adicional (opcional)"
        placeholderTextColor="#888"
        multiline
        value={data.comentarioLibre}
        onChangeText={(text) =>
          onChange({ ...data, comentarioLibre: text })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: { color: '#ddd', flex: 1, marginRight: 8 },
  input: {
    marginTop: 12,
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 6,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
