import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SignatureModal from '../SignatureModal';
import SignaturePreview from '../SignaturePreview';

export type SignaturesData = {
  tecnico?: string;
  encargado?: string;
  fechaFirma?: string;
};

type Props = {
  data?: SignaturesData;
  onChange: (data: SignaturesData) => void;
};

export default function Signatures({ data, onChange }: Props) {
  const [modalFor, setModalFor] =
    useState<'tecnico' | 'encargado' | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firmas</Text>

      <SignaturePreview
        label="Firma del Técnico"
        value={data?.tecnico}
        onPress={() => setModalFor('tecnico')}
      />

      <SignaturePreview
        label="Firma del Cliente / Encargado"
        value={data?.encargado}
        onPress={() => setModalFor('encargado')}
      />

      <SignatureModal
        visible={modalFor !== null}
        onClose={() => setModalFor(null)}
        onSave={(base64) =>
          onChange({
            ...data,
            [modalFor!]: base64,
            fechaFirma: new Date().toISOString(),
          })
        }
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
});
