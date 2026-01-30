import * as FileSystem from 'expo-file-system/legacy';
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
    ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
    : await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });

  if (result.canceled) return null;

  const asset = result.assets[0];
  const fileName = asset.uri.split('/').pop();
  const targetDir = `${FileSystem.documentDirectory}images`;
  const targetPath = `${targetDir}/${fileName}`;

  // crear carpeta si no existe
  await FileSystem.makeDirectoryAsync(targetDir, {
    intermediates: true,
  });

  await FileSystem.copyAsync({
    from: asset.uri,
    to: targetPath,
  });

  return targetPath; // file://...
}
