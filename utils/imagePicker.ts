import * as ImagePicker from 'expo-image-picker';

export async function pickImage(fromCamera: boolean) {
  const permission = fromCamera
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    alert('Permiso denegado 😕');
    return null;
  }

  const result = fromCamera
    ? await ImagePicker.launchCameraAsync({
        quality: 0.7,
      })
    : await ImagePicker.launchImageLibraryAsync({
        quality: 0.7,
      });

  if (result.canceled) return null;

  return result.assets[0].uri;
}
