import { Text, TextInput, View } from 'react-native';

type Props = {
  data: {
    cliente: string;
    fecha: string;
    tecnico: string;
  };
  onChange: (data: Props['data']) => void;
};

export default function GeneralData({ data, onChange }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: '#fff', marginBottom: 4 }}>Cliente</Text>
      <TextInput
        value={data.cliente}
        onChangeText={(text) =>
          onChange({ ...data, cliente: text })
        }
        placeholder="Nombre del cliente"
        placeholderTextColor="#aaa"
        style={{
          borderWidth: 1,
          borderColor: '#555',
          borderRadius: 8,
          padding: 10,
          color: '#fff',
          marginBottom: 12,
        }}
      />

      <Text style={{ color: '#fff', marginBottom: 4 }}>Fecha del reporte</Text>
      <TextInput
        value={data.fecha}
        onChangeText={(text) =>
          onChange({ ...data, fecha: text })
        }
        placeholder="DD/MM/AAAA"
        placeholderTextColor="#aaa"
        style={{
          borderWidth: 1,
          borderColor: '#555',
          borderRadius: 8,
          padding: 10,
          color: '#fff',
          marginBottom: 12,
        }}
      />

      <Text style={{ color: '#fff', marginBottom: 4 }}>Técnico</Text>
      <TextInput
        value={data.tecnico}
        onChangeText={(text) =>
          onChange({ ...data, tecnico: text })
        }
        placeholder="Nombre del técnico"
        placeholderTextColor="#aaa"
        style={{
          borderWidth: 1,
          borderColor: '#555',
          borderRadius: 8,
          padding: 10,
          color: '#fff',
        }}
      />
    </View>
  );
}
