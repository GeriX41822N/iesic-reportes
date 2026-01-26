import { Button, StyleSheet, Text, View } from 'react-native';
import { pickImage } from '../../utils/imagePicker';

type Props = {
  data: {
    filtros: string | null;
    serpentines: string | null;
    turbina: string | null;
    ventilador: string | null;
  };
  onChange: (data: Props['data']) => void;
};

export default function EvidencePhotos({ data, onChange }: Props) {
  async function handlePick(key: keyof Props['data'], fromCamera: boolean) {
    const uri = await pickImage(fromCamera);
    if (!uri) return;

    onChange({
      ...data,
      [key]: uri,
    });
  }

  function renderPhoto(label: string, key: keyof Props['data']) {
    const hasPhoto = !!data[key];

    return (
      <View style={styles.block}>
        <Text style={styles.label}>
          {label} {hasPhoto ? '✅' : '❌'}
        </Text>

        <View style={styles.buttons}>
          <Button
            title={hasPhoto ? 'Cambiar foto 📷' : 'Tomar foto 📷'}
            onPress={() => handlePick(key, true)}
          />
          <Button
            title="Galería 🖼️"
            onPress={() => handlePick(key, false)}
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Evidencia fotográfica</Text>

      {renderPhoto('Filtros', 'filtros')}
      {renderPhoto('Serpentines', 'serpentines')}
      {renderPhoto('Turbina', 'turbina')}
      {renderPhoto('Ventilador', 'ventilador')}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  block: { marginBottom: 16 },
  label: { color: '#ddd', marginBottom: 6 },
  buttons: { flexDirection: 'row', gap: 8 },
});
