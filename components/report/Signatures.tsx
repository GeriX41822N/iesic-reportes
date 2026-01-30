import * as FileSystem from 'expo-file-system/legacy';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import SignatureModal from '../SignatureModal';
import SignaturePreview from '../SignaturePreview';

export type SignaturesData = {
  tecnico?: string;    // file://...
  encargado?: string; // file://...
  fechaFirma?: string;
};

type Props = {
  data?: SignaturesData;
  onChange: (data: SignaturesData) => void;
};

// 💾 guarda base64 como archivo PNG y regresa la ruta file://
export async function saveSignatureToFile(
  base64Data: string,
  name: string
): Promise<string> {

  // 🚫 Web no soporta filesystem nativo
  if (Platform.OS === 'web') {
    throw new Error('Guardado de firmas no soportado en web');
  }

  const dir = `${FileSystem.documentDirectory}signatures`;
  const path = `${dir}/${name}`;

  // crear carpeta si no existe
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

  // quitar encabezado data:image/png;base64,
  const base64 = base64Data.replace(
    /^data:image\/png;base64,/,
    ''
  );

  await FileSystem.writeAsStringAsync(path, base64, {
    encoding: 'base64', // ✅ CLAVE: string, NO enum
  });

  return path; // file://...
}

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
        onSave={async (base64) => {
          const filePath = await saveSignatureToFile(
            base64,
            `firma_${modalFor}_${Date.now()}.png`
          );

          onChange({
            ...data,
            [modalFor!]: filePath, // ✅ SOLO file://
            fechaFirma: new Date().toISOString(),
          });

          setModalFor(null);
        }}
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
