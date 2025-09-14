import { router, useLocalSearchParams, } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { getListById, RecipeList } from "../../utils/ListeStorage";
import { getRecipeById, Recipe } from "../../utils/recipeStorage";

const ListDetail = () => {
  const { id } = useLocalSearchParams();
  const [list, setList] = useState<RecipeList | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListData = async () => {
      if (id) {
        const listData = await getListById(id as string);
        setList(listData);
        
        if (listData) {
          const recipePromises = listData.recipeIds.map(recipeId => 
            getRecipeById(recipeId)
          );
          const recipeResults = await Promise.all(recipePromises);
          setRecipes(recipeResults.filter(recipe => recipe !== null) as Recipe[]);
        }
      }
      setLoading(false);
    };
    
    loadListData();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Caricamento...</Text>
      </SafeAreaView>
    );
  }

  if (!list) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Lista non trovata</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{list.name}</Text>
      <Text style={styles.subtitle}>
        {recipes.length} ricetta{recipes.length !== 1 ? 'e' : ''} in questa lista
      </Text>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeItem}
            onPress={() => router.push(`/ricette/liste/${item.id}`)}
          >
            <Text style={styles.recipeName}>{item.title}</Text>
            <Text style={styles.recipeArrow}>→</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nessuna ricetta in questa lista
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  recipeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  recipeArrow: {
    fontSize: 18,
    color: '#6A4C93',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
  },
});

export default ListDetail;