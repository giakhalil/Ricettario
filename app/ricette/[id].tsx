import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.Container2}>
          {recipe.image && (
            <Image 
              source={{ uri: recipe.image }} 
              style={styles.image} 
            />
          )}
          <View style={styles.overlay} />
          <Text style={styles.title}>{recipe.title}</Text>
        </View>
        <View style={styles.contentContainer}>
      
          {recipe.cookingTime && (
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>⏱️</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Tempo di cottura</Text>
                <Text style={styles.infoValue}>{recipe.cookingTime}</Text>
              </View>
            </View>
          )}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🍴 Ingredienti</Text>
            <View style={styles.card}>
              <Text style={styles.ingredientsText}>
                {getIngredientsWithQuantities().split('\n').map((line, index) => (
                  <Text key={index}>
                    • {line}{'\n'}
                  </Text>
                ))}
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👨‍🍳 Preparazione</Text>
            <View style={styles.card}>
              <Text style={styles.instructionsText}>
                {recipe.instructions.split('\n').map((line, index) => (
                  <Text key={index}>
                    {index + 1}. {line}{'\n\n'}
                  </Text>
                ))}
              </Text>
            </View>
          </View>
          {recipe.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 Note</Text>
              <View style={styles.card}>
                <Text style={styles.notesText}>{recipe.notes}</Text>
              </View>
            </View>
          )}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Valuta questa ricetta</Text>
            <View style={styles.card}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleRate(star)}
                    style={styles.starButton}
                  >
                    <Text style={[styles.star, star <= rating && styles.starFilled]}>
                      {star <= rating ? "⭐" : "☆"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingText}>
                {rating > 0 ? `Hai valutato ${rating} stelle` : "Tocca una stella per votare"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <DeleteButton recipeId={recipe.id} recipeTitle={recipe.title} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  Container2: {
    position: 'relative',
    height: 300,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  contentContainer: {
    padding: 20,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#386641',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#386641",
    marginBottom: 12,
    marginLeft: 5,
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  ingredientsText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  notesText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: "#666",
    lineHeight: 22,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: 'center',
    marginBottom: 20,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 36,
    color: '#ccc',
  },
  starFilled: {
    color: '#ffd700',
  },
  ratingText: {
    fontSize: 16,
    color: "#666",
    textAlign: 'center',
  },
});

export default RecipeDetail;


