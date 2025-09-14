import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text } from "react-native";
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

  const getIngredientsWithQuantities = () => {
    if (!recipe.quantities) return recipe.ingredients;
    
    const ingredientsList = recipe.ingredients.split('\n');
    const quantitiesList = recipe.quantities.split('\n');
    
    return ingredientsList.map((ingredient, index) => {
      const quantity = quantitiesList[index] || '';
      return quantity ? `${quantity} ${ingredient}` : ingredient;
    }).join('\n');
  };

return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {recipe.image && (
          <Image source={{ uri: recipe.image }} style={styles.image} />
        )}
        
        <Text style={styles.title}>{recipe.title}</Text>
        
        {recipe.cookingTime && (
          <>
            <Text style={styles.subtitle}>Tempo di cottura:</Text>
            <Text style={styles.text}>{recipe.cookingTime}</Text>
          </>
        )}

        <Text style={styles.subtitle}>Ingredienti:</Text>
        <Text style={styles.text}>{getIngredientsWithQuantities()}</Text>

        <Text style={styles.subtitle}>Preparazione:</Text>
        <Text style={styles.text}>{recipe.instructions}</Text>

        {recipe.notes && (
          <>
            <Text style={styles.subtitle}>Note:</Text>
            <Text style={styles.text}>{recipe.notes}</Text>
          </>
        )}

        <DeleteButton recipeId={recipe.id} recipeTitle={recipe.title} />
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

  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: 'cover'
  }
});

export default RecipeDetail;


