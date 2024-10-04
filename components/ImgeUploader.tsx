import React, { useState } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from "react-native-paper";

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setIsImageUploading(true);

      // Subir imagen a Cloudinary
      const data = new FormData();
      data.append("file", {
        uri,
        type: "image/jpeg",
        name: "image.jpg",
      } as any);
      data.append("upload_preset", "bei-empl");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/tarija/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const file = await res.json();
        console.log("Cloudinary URL: ", file.secure_url);

        // Establecer la URL de Cloudinary
        setImageUrl(file.secure_url);
        onImageUpload(file.secure_url); // Notifica al componente padre con la URL de la imagen
      } catch (error) {
        console.error("Error al subir la imagen a Cloudinary: ", error);
      }finally {
        setIsImageUploading(false);

      }
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text>Subir comprobante</Text>
      </TouchableOpacity>

      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
      )}

      {isImageUploading && (
        <View style={styles.loadingContainer}>
         <ActivityIndicator size="small" color="#0000ff" />
         </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  imagePreview: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ImageUploader;
