import { Button, StyleSheet, Text, View } from 'react-native';
import { pickImage } from '../../utils/imagePicker';

type PhotoSet = {
  antes: string | null;
  durante: string | null;
  despues: string | null;
};

type Props = {
  data: {
    filtros: PhotoSet;
    serpentines: PhotoSet;
    turbina: PhotoSet;
    ventilador: PhotoSet;
  };
  onChange: (data: Props['data']) => void;
};

export default function EvidencePhotos({ data, onChange }: Props) {

  async function handlePick(
    section: keyof Props['data'],
    stage: keyof PhotoSet,
    fromCamera: boolean
  ) {
    const uri = await pickImage(fromCamera);
    if (!uri) return;

    onChange({
      ...data,
      [section]: {
        ...data[section],
        [stage]: uri
      }
    });
  }

  function renderStage(
    section: keyof Props['data'],
    stage: keyof PhotoSet,
    label: string
  ) {
    const hasPhoto = !!data[section][stage];

    return (
      <View style={styles.stage}>
        <Text style={styles.stageLabel}>
          {label} {hasPhoto ? '✅' : '❌'}
        </Text>

        <View style={styles.buttons}>
          <Button
            title="Cámara 📷"
            onPress={() => handlePick(section, stage, true)}
          />

          <Button
            title="Galería 🖼️"
            onPress={() => handlePick(section, stage, false)}
          />
        </View>
      </View>
    );
  }

  function renderSection(label: string, key: keyof Props['data']) {
    return (
      <View style={styles.block}>
        <Text style={styles.sectionTitle}>{label}</Text>

        {renderStage(key, 'antes', 'Antes')}
        {renderStage(key, 'durante', 'Durante')}
        {renderStage(key, 'despues', 'Después')}
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Evidencia fotográfica</Text>

      {renderSection('Filtros', 'filtros')}
      {renderSection('Serpentines', 'serpentines')}
      {renderSection('Turbina', 'turbina')}
      {renderSection('Ventilador', 'ventilador')}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },

  block: {
    marginBottom: 20
  },

  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8
  },

  stage: {
    marginBottom: 10
  },

  stageLabel: {
    color: '#ddd',
    marginBottom: 4
  },

  buttons: {
    flexDirection: 'row',
    gap: 8
  }
});