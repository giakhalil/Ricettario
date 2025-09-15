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
      style={styles.logo}
      resizeMode="contain"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#386641" }]} 
          onPress={() => router.push("/ricette/recipes")}
        >
           <View style={styles.buttonContent}>
            <Image
              source={require('@/assets/icons/ricette.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>Che mangiamo?</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#64994E" }]} 
          onPress={() => router.push("/shoppingList")}
        >
        <View style={styles.buttonContent}>
            <Image
              source={require('@/assets/icons/carrello.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>Lista della spesa</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#A7C957" }]}
          onPress={() => router.push("../fridge")}
        >
          <View style={styles.buttonContent}>
            <Image
              source={require('@/assets/icons/fridge.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>Cosa Ho in Frigo?</Text>
          </View>
        
      </TouchableOpacity>

      <TouchableOpacity
      style={[styles.button, { backgroundColor: "#BC4749" }]}
      onPress={() => router.push("/ricette/liste")}
      >
        <View style={styles.buttonContent}>
            <Image
              source={require('@/assets/icons/liste.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>Le Mie Liste</Text>
          </View>
     </TouchableOpacity>

        {!loading && recipeOfTheDay && (
        <View style={styles.recipeOfTheDay}>
          <View style={styles.buttonContent}>
            <Image
              source={require('@/assets/icons/calendar.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.recipeTitle}> Ricetta del Giorno</Text>
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

  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
   buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
   },
   image: {
    width: 60,
    height: 60,
   },
    logo: {
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
    color: '#577590',
  },
  recipeCard: {
    width: '90%',
    backgroundColor: '#f2e8cf',
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
    color: '#577590',
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
    color: '#577590',
    marginBottom: 5,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#577590',
    textAlign: 'center',
  }
});

export default Iniziale;
