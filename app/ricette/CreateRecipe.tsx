import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveRecipe } from "../../utils/recipeStorage";

const CreateRecipe = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [quantities, setQuantities] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permesso necessario', 'Abbiamo bisogno del permesso per accedere alle tue foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Errore", "Inserisci un titolo per la ricetta.");
      return;
    }
    setSaving(true);
    try {
      const saved = await saveRecipe({ 
        title: title.trim(), 
        ingredients, 
        instructions,
        cookingTime: cookingTime.trim(),
        quantities: quantities.trim(),
        notes: notes.trim(),
        image: imageUri || undefined
      });
      if (!saved) throw new Error("Salvataggio fallito");
      router.back();
    } catch (error) {
      console.error("CreateRecipe - save error:", error);
      Alert.alert("Errore", "Impossibile salvare la ricetta. Riprova.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Crea una nuova ricetta</Text>

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>📷 Scegli foto dalla galleria</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Titolo della ricetta *</Text>
        <TextInput
          style={styles.input}
          placeholder="Inserisci il titolo"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Tempo di cottura</Text>
        <TextInput
          style={styles.input}
          placeholder="Es. 30 minuti, 1 ora"
          value={cookingTime}
          onChangeText={setCookingTime}
        />

        <Text style={styles.label}>Ingredienti</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Inserisci gli ingredienti (uno per riga)"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />

        <Text style={styles.label}>Quantità</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Inserisci le quantità (corrispondenti agli ingredienti)"
          value={quantities}
          onChangeText={setQuantities}
          multiline
        />

        <Text style={styles.label}>Preparazione</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Descrivi i passaggi della preparazione"
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />

        <Text style={styles.label}>Note</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Note aggiuntive (opzionale)"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {saving ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <Button title="💾 Salva ricetta" onPress={handleSave} color="#4CAF50" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover'
  },
  imageButton: {
    backgroundColor: '#386641',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    marginVertical: 20
  }
});

export default CreateRecipe;

