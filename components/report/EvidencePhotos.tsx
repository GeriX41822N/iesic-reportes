import { View, Text, Button } from 'react-native';

type EvidencePhotosType = {
  filtros: string | null;
  serpentines: string | null;
  turbina: string | null;
  ventilador: string | null;
};

type Props = {
  data: EvidencePhotosType;
  onChange: (data: EvidencePhotosType) => void;
};

export default function EvidencePhotos({ data, onChange }: Props) {
  const setPhoto = (key: keyof EvidencePhotosType) => {
    // simulamos una foto por ahora
    onChange({
      ...data,
      [key]: 'foto-capturada',
    });
  };

  const allPhotosReady = Object.values(data).every(Boolean);

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: '#fff', marginBottom: 8 }}>
        Evidencia fotográfica (4 obligatorias)
      </Text>

      <Button title="Foto de filtros" onPress={() => setPhoto('filtros')} />
      <Button title="Foto de serpentines" onPress={() => setPhoto('serpentines')} />
      <Button title="Foto de turbina" onPress={() => setPhoto('turbina')} />
      <Button title="Foto de ventilador" onPress={() => setPhoto('ventilador')} />

      {!allPhotosReady && (
        <Text style={{ color: 'red', marginTop: 12 }}>
          Faltan fotos obligatorias
        </Text>
      )}

      {allPhotosReady && (
        <Text style={{ color: 'lightgreen', marginTop: 12 }}>
          ✔ Evidencia completa
        </Text>
      )}
    </View>
  );
}
