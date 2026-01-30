import { Button, Modal, StyleSheet, View } from 'react-native';
import Signature from 'react-native-signature-canvas';

type Props = {
  visible: boolean;
  onSave: (base64: string) => void; // ⚠️ base64 SOLO temporal
  onClose: () => void;
};

export default function SignatureModal({ visible, onSave, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>

        {/* Contenedor para que el canvas tenga altura real */}
        <View style={{ flex: 1 }}>
          <Signature
            onOK={(signature) => {
              // signature = data:image/png;base64,...
              onSave(signature);
            }}
            descriptionText="Firme dentro del área"
            clearText="Limpiar"
            confirmText="Guardar"
            webStyle={`
              body, html {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
              }

              .m-signature-pad {
                position: relative;
                width: 100%;
                height: 100%;
                box-shadow: none;
                border: none;
              }

              .m-signature-pad--body {
                position: absolute;
                top: 0;
                bottom: 60px;
                left: 0;
                right: 0;
                border: 1px solid #000;
              }

              .m-signature-pad--footer {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 60px;

                display: flex;
                justify-content: space-evenly;
                align-items: center;

                background-color: #f2f2f2;
                border-top: 1px solid #ccc;
              }

              .m-signature-pad--footer .button {
                min-width: 120px;
                height: 42px;
                background-color: #1e5fa3;
                color: #fff;
                font-size: 16px;
                font-weight: 600;
                border-radius: 8px;
                border: none;
              }
            `}
          />
        </View>

        {/* Botón nativo */}
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
