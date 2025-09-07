import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import AddButton from "../../components/AddButton";
import EditButton from "../../components/EditButton";
import FavoriteButton from "../../components/FavoriteButton";
import { getRecipes, Recipe } from "../../utils/recipeStorage";

const Home = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation()
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchText, setSearchText] = useState("");
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    const stored = await getRecipes();
    setRecipes(stored);
    setFilteredRecipes(stored);
    setLoading(false);
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === "") {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(text.toLowerCase()) ||
        recipe.ingredients.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [loadRecipes]) 
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Le tue ricette</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca ricette o ingredienti..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <Text>Caricamento...</Text>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.recipeRow}>
              <Text
                style={styles.recipe}
                onPress={() => router.push(`/ricette/${item.id}`)}
              >
                🍴 {item.title}
              </Text>
              <View style={styles.buttonContainer}>
                <FavoriteButton recipeId={item.id} />
                <EditButton recipeId={item.id} />
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchText ? "Nessuna ricetta trovata" : "Nessuna ricetta ancora"}
            </Text>
          }
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
    textAlign: "center",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  recipeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  recipe: {
    fontSize: 18,
    flex: 1,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, 
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 16,
  },
});

export default Home;



