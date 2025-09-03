import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DeleteButton from "../../components/DeleteButton";
import { getRecipeById, Recipe } from "../../utils/recipeStorage";

const RecipeDetail = () => {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      if (id) {
        const found = await getRecipeById(id as string);
        setRecipe(found);
      }
      setLoading(false);
    };
    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Ricetta non trovata</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.subtitle}>Ingredienti:</Text>
      <Text style={styles.text}>{recipe.ingredients}</Text>
      <Text style={styles.subtitle}>Istruzioni:</Text>
      <Text style={styles.text}>{recipe.instructions}</Text>
      <DeleteButton recipeId={recipe.id} recipeTitle={recipe.title} />
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 4,
  },
});

export default RecipeDetail;


