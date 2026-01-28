import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value?: string;
  onPress: () => void;
};

export default function SignaturePreview({ label, value, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {value ? (
        <Image source={{ uri: value }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text>Sin firma</Text>
        </View>
      )}

      <Pressable onPress={onPress}>
        <Text style={styles.button}>
          {value ? 'Cambiar firma' : 'Capturar firma'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginBottom: 6 },
  image: { height: 80, resizeMode: 'contain', backgroundColor: '#eee' },
  placeholder: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  button: {
    marginTop: 6,
    color: '#4da6ff',
    fontWeight: 'bold',
  },
});
