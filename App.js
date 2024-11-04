import React, {useState} from 'react';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { Alert, Button, PermissionsAndroid, Platform, Image, View, StyleSheet, Text } from 'react-native';
import { exists } from 'react-native-fs';

const App = () => {
  const [scannedImageUri, setScannedImageUri] = useState('');


  const handleScanDocument = async () => {
    if (Platform.OS === 'android' && await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
    ) !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Erro', 'O usuário deve permitir o acesso à câmera para usar o scanner.');
      return;
    }

    try {
      const { scannedImages } = await DocumentScanner.scanDocument();

      if (scannedImages.length > 0) {
        const imageFilePath = scannedImages[0];
        const fileExists = await exists(imageFilePath);
        if (fileExists) {
          setScannedImageUri(imageFilePath);
        } else {
          console.error('O arquivo escaneado não foi encontrado.');
        }
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
      <View style={styles.container}>
        <Button title="Escanear documento" onPress={handleScanDocument} />
          <Text style={styles.title}>Imagem escaneada:</Text>
          { scannedImageUri ? (
              <Image source={{ uri: scannedImageUri }} style={styles.image} resizeMode="contain" />
          ) : (
              <Text>Nenhuma imagem escaneada.</Text>
          )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 50,
  },
  button: {
    marginTop: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  image: {
    width: '80%',
    height: '80%',
  },
});

export default App;
