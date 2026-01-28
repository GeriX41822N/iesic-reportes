import { Button, Modal, StyleSheet, View } from 'react-native';
import Signature from 'react-native-signature-canvas';

type Props = {
  visible: boolean;
  onSave: (base64: string) => void;
  onClose: () => void;
};

export default function SignatureModal({ visible, onSave, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
            <Signature
            onOK={(signature) => {
                onSave(signature);
                onClose();
            }}
            descriptionText="Firme dentro del área"
            clearText="Limpiar"
            confirmText="Guardar"
            webStyle={`
                body, html {
                width: 100%;
                height: 100%;
                }
                .m-signature-pad {
                box-shadow: none;
                border: none;
                }
                .m-signature-pad--body {
                border: 1px solid #000;
                }
                .m-signature-pad--footer {
                display: flex !important;
                justify-content: space-between;
                }
                .m-signature-pad--footer .button {
                background-color: #1e5fa3;
                color: #fff;
                font-size: 16px;
                padding: 8px 16px;
                }
            `}
            />


        <View style={{ padding: 12 }}>
          <Button title="Cancelar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
