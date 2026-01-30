import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  data: {
    cliente: string;
    fecha: string;
    tecnico: string;
  };
  onChange: (data: Props['data']) => void;
};

export default function GeneralData({ data, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  // 📅 Fecha del sistema por defecto
  useEffect(() => {
    if (!data.fecha) {
      const today = new Date();
      const formatted = today.toLocaleDateString('es-MX');
      onChange({ ...data, fecha: formatted });
    }
  }, []);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);

    if (selectedDate) {
      const formatted =
        selectedDate.toLocaleDateString('es-MX');
      onChange({ ...data, fecha: formatted });
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      {/* CLIENTE */}
      <Text style={{ color: '#fff', marginBottom: 4 }}>
        Cliente
      </Text>
      <TextInput
        value={data.cliente}
        onChangeText={(text) =>
          onChange({ ...data, cliente: text })
        }
        placeholder="Nombre del cliente"
        placeholderTextColor="#aaa"
        style={inputStyle}
      />

      {/* FECHA */}
      <Text style={{ color: '#fff', marginBottom: 4 }}>
        Fecha del reporte
      </Text>

      <Pressable onPress={() => setShowPicker(true)}>
        <View pointerEvents="none">
          <TextInput
            value={data.fecha}
            placeholder="Seleccionar fecha"
            placeholderTextColor="#aaa"
            style={inputStyle}
          />
        </View>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={handleDateChange}
        />
      )}

      {/* TÉCNICO */}
      <Text style={{ color: '#fff', marginBottom: 4 }}>
        Técnico
      </Text>
      <TextInput
        value={data.tecnico}
        onChangeText={(text) =>
          onChange({ ...data, tecnico: text })
        }
        placeholder="Nombre del técnico"
        placeholderTextColor="#aaa"
        style={inputStyle}
      />
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#555',
  borderRadius: 8,
  padding: 10,
  color: '#fff',
  marginBottom: 12,
};
