import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DeleteButton from "../../components/DeleteButton";
import { getRecipeRating, saveRating } from "../../utils/RatingStorage";
import { getRecipeById, Recipe } from "../../utils/recipeStorage";


const RecipeDetail = () => {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0); 

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

   useEffect(() => {
    const loadRating = async () => {
      if (recipe) {
        const userRating = await getRecipeRating(recipe.id);
        setRating(userRating);
      }
    };
    loadRating();
  }, [recipe]);

  const handleRate = async (stars: number) => {
    if (recipe) {
      const success = await saveRating(recipe.id, stars);
      if (success) {
        setRating(stars);
        Alert.alert("Grazie!", "La tua valutazione è stata salvata");
      }
    }
  };


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
        <SafeAreaView style={styles.ratingSection}>
        <Text style={styles.ratingTitle}>Valuta questa ricetta:</Text>
        <SafeAreaView style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleRate(star)}
              style={styles.starButton}
            >
              <Text style={styles.star}>
                {star <= rating ? "⭐" : "☆"}
              </Text>
            </TouchableOpacity>
          ))}
        </SafeAreaView>
        <Text style={styles.ratingText}>
          {rating > 0 ? `Hai valutato ${rating} stelle` : "Seleziona le stelle"}
        </Text>
      </SafeAreaView>
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
  },
    ratingSection: {
    marginVertical: 20,
    alignItems: "center",
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 32,
  },
  ratingText: {
    fontSize: 16,
    color: "#666",
  },
});

export default RecipeDetail;


