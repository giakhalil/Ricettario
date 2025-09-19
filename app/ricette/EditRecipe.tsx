import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { getRecipeById, getRecipes, Recipe } from "../../utils/recipeStorage";

const EditRecipe = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [cookingTime, setCookingTime] = useState("");
  const [quantities, setQuantities] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImageUri] = useState<string | null>(null);
  const navigation = useNavigation();

    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false
      });
    }, [navigation]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (!id) return;

        const recipe = await getRecipeById(id);
        if (recipe) {
          setTitle(recipe.title);
          setIngredients(recipe.ingredients);
          setInstructions(recipe.instructions);
          setCookingTime(recipe.cookingTime || "");
          setQuantities(recipe.quantities || "");
          setNotes(recipe.notes || "");
          setImageUri(recipe.image || null);

        } else {
          Alert.alert("Errore", "Ricetta non trovata");
          router.back();
        }
      } catch (error) {
        Alert.alert("Errore", "Impossibile caricare la ricetta");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

    const pickImage = async () => {
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Errore", "Impossibile accedere alla galleria");
    }
    };

  const handleSave = async () => {
    try {
      if (!id) return;

      const recipes = await getRecipes();

      const updatedRecipes: Recipe[] = recipes.map((r) =>
        r.id === id ? { ...r, title, ingredients, instructions, cookingTime, quantities, notes, image: image || undefined} : r
      );

      await AsyncStorage.setItem("@recipes", JSON.stringify(updatedRecipes));

      Alert.alert("Successo", "Ricetta modificata!");
      router.back(); 
    } catch (error) {
      Alert.alert("Errore", "Impossibile salvare la ricetta");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Caricamento ricetta...</Text>
      </View>
    );
  }

 return (
    <ScrollView style={styles.container}>
      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>📷 Scegli foto dalla galleria</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Titolo ricetta</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Inserisci titolo"
      />

      <Text style={styles.label}>Tempo di cottura</Text>
      <TextInput
        style={styles.input}
        value={cookingTime}
        onChangeText={setCookingTime}
        placeholder="Es. 30 minuti, 1 ora"
      />

      <Text style={styles.label}>Ingredienti</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={ingredients}
        onChangeText={setIngredients}
        multiline
        placeholder="Inserisci ingredienti (uno per riga)"
      />

      <Text style={styles.label}>Quantità</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={quantities}
        onChangeText={setQuantities}
        multiline
        placeholder="Inserisci quantità (corrispondenti agli ingredienti)"
      />

      <Text style={styles.label}>Preparazione</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={instructions}
        onChangeText={setInstructions}
        multiline
        placeholder="Inserisci preparazione"
      />

      <Text style={styles.label}>Note</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder="Inserisci note (opzionale)"
      />

      <Button title="💾 Salva modifiche" onPress={handleSave} color="#2196F3" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  }
});

export default EditRecipe;