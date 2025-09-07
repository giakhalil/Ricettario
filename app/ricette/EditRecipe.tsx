import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getRecipeById, getRecipes, Recipe } from "../../utils/recipeStorage";

const EditRecipe = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (!id) return;

        const recipe = await getRecipeById(id);
        if (recipe) {
          setTitle(recipe.title);
          setIngredients(recipe.ingredients);
          setInstructions(recipe.instructions);
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

  const handleSave = async () => {
    try {
      if (!id) return;

      const recipes = await getRecipes();

      const updatedRecipes: Recipe[] = recipes.map((r) =>
        r.id === id ? { ...r, title, ingredients, instructions } : r
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
    <View style={styles.container}>
      <Text style={styles.label}>Titolo ricetta</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Inserisci titolo"
      />

      <Text style={styles.label}>Ingredienti</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={ingredients}
        onChangeText={setIngredients}
        multiline
        placeholder="Inserisci ingredienti"
      />

      <Text style={styles.label}>Preparazione</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        value={instructions}
        onChangeText={setInstructions}
        multiline
        placeholder="Inserisci preparazione"
      />

      <Button title="💾 Salva modifiche" onPress={handleSave} color="#2196F3" />
    </View>
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
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditRecipe;
