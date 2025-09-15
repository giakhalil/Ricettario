import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getRecipes, Recipe } from "../../utils/recipeStorage";

const Iniziale = () => {
  const router = useRouter();
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const getRandomRecipe = async () => {
      try {
        const recipes = await getRecipes();
        if (recipes.length > 0) {
          const today = new Date().getDate();
          const randomIndex = today % recipes.length;
          setRecipeOfTheDay(recipes[randomIndex]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Errore caricamento ricetta del giorno:", error);
        setLoading(false);
      }
    };
    
    getRandomRecipe();
  }, []);

  return (
    
    <ScrollView contentContainerStyle={styles.container}> 
      <Image
      source={require('@/assets/icons/logo.png')}
      style={styles.image}
      resizeMode="contain"
      />
      <Text style={styles.title}>Benvenuto 👋</Text>
      <Text style={styles.subtitle}>Gestisci le tue ricette facilmente</Text>

       {!loading && recipeOfTheDay && (
        <View style={styles.recipeOfTheDay}>
          <Text style={styles.recipeTitle}>🍳 Ricetta del Giorno</Text>
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => router.push(`/ricette/${recipeOfTheDay.id}`)}
          >
            {recipeOfTheDay.image && (
              <Image 
                source={{ uri: recipeOfTheDay.image }} 
                style={styles.recipeImage}
              />
            )}
            <Text style={styles.recipeName}>{recipeOfTheDay.title}</Text>
            <Text style={styles.recipeHint}>Tocca per vedere la ricetta →</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !recipeOfTheDay && (
        <View style={styles.recipeOfTheDay}>
          <Text style={styles.recipeTitle}>🍳 Ricetta del Giorno</Text>
          <View style={styles.emptyRecipeCard}>
            <Text style={styles.emptyText}>Nessuna ricetta disponibile</Text>
            <Text style={styles.emptySubtext}>Crea la tua prima ricetta!</Text>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/ricette/recipes")}
        >
          <Text style={styles.buttonText}>🍴 Vai alle Ricette</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#386641" }]} 
          onPress={() => router.push("/shoppingList")}
        >
          <Text style={styles.buttonText}>🛒 Lista della Spesa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
          onPress={() => router.push("../fridge")}
        >
          <Text style={styles.buttonText}> ❄️ Il Mio Frigo</Text>
      </TouchableOpacity>

      <TouchableOpacity
      style={[styles.button, { backgroundColor: "#6A4C93" }]}
      onPress={() => router.push("/ricette/liste")}
      >
      <Text style={styles.buttonText}>📋 Le Mie Liste</Text>
     </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  button: {
    backgroundColor: "#64994E",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
   image: {
    width: 400,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
   },
    recipeOfTheDay: {
    width: '100%',
    marginBottom: 25,
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#bc4749',
  },
  recipeCard: {
    width: '90%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover'
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
    color: '#2d4a2f',
  },
  recipeHint: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  emptyRecipeCard: {
    width: '90%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 5,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  }
});

export default Iniziale;
