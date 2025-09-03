import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import AddButton from "../../components/AddButton";
import { getRecipes, Recipe } from "../../utils/recipeStorage";

const Home = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

const loadRecipes = useCallback(async () => {
    setLoading(true);
    const stored = await getRecipes();
    setRecipes(stored);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [loadRecipes]) 
  );


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Le tue ricette</Text>

      {loading ? (
        <Text>Caricamento...</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text
              style={styles.recipe}
              onPress={() => router.push(`/ricette/${item.id}`)}
            >
              🍴 {item.title}
            </Text>
          )}
          ListEmptyComponent={<Text>Nessuna ricetta ancora</Text>}
        />
      )}

      <AddButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  recipe: {
    fontSize: 18,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default Home;


