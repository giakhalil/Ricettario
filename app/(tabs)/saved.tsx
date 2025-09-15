import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFavorites } from '../../utils/FavoriteStorage';
import { getRecipes, Recipe } from '../../utils/recipeStorage';
import { saveShoppingListItem } from '../../utils/ShopppingListStorage';

const Saved = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    const favoriteIds = await getFavorites();
    const allRecipes = await getRecipes();
    const favorites = allRecipes.filter(recipe => favoriteIds.includes(recipe.id));
    setFavoriteRecipes(favorites);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const addIngredientsToShoppingList = async (ingredients: string, recipeTitle: string) => {
    const parsedIngredients = parseIngredients(ingredients);
    for (const ingredient of parsedIngredients) {
      await saveShoppingListItem({
        name: ingredient,
        completed: false,
        fromRecipe: recipeTitle
      });
    }
    alert(`Ingredienti di "${recipeTitle}" aggiunti alla lista della spesa!`);
  };

  const parseIngredients = (ingredients: string): string[] => {
    return ingredients
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .flatMap(line => line.split(',').map(item => item.trim()))
      .filter(item => item.length > 0);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Caricamento ricette preferite...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.ImageContainer}>
          <Image
            source={require('@/assets/icons/prossimo.png')}
            style={styles.image}
            resizeMode="contain"
          />
         <Text style={styles.title}>Prossimamente In Tavola</Text>
        </View>
      </View>
      
      <FlatList
        data={favoriteRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recipeContainer}>
            <Text style={styles.recipeTitle}>{item.title}</Text>
            <Text style={styles.ingredientsLabel}>Ingredienti:</Text>
            <Text style={styles.ingredientsText}>{item.ingredients}</Text>
            <TouchableOpacity
              style={styles.addToListButton}
              onPress={() => addIngredientsToShoppingList(item.ingredients, item.title)}
            >
              <Text style={styles.addToListText}>➕ Aggiungi alla Lista Spesa</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyText}>Nessuna ricetta preferita</Text>
            <Text style={[styles.emptyText, { fontSize: 14, marginTop: 8 }]}>
              Aggiungi like alle ricette per vederle qui
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
   header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
  },
  ImageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#386641',
    marginTop: -40,
  },
  recipeContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2d4a2f',
  },
  ingredientsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#6c757d',
  },
  ingredientsText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 15,
    lineHeight: 20,
  },
  addToListButton: {
    backgroundColor: '#386641',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addToListText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6c757d',
    marginTop: 40,
    fontSize: 16,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    color: '#adb5bd',
  },
});

export default Saved;