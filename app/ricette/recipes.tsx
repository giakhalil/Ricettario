import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import AddButton from "../../components/AddButton";
import EditButton from "../../components/EditButton";
import { getRecipes, Recipe } from "../../utils/recipeStorage";


const Home = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation()

    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false
      });
    }, [navigation]);

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
            <SafeAreaView style={styles.riga}>
            <Text
              style={styles.recipe}
              onPress={() => router.push(`/ricette/${item.id}`)}
            >
              🍴 {item.title}
            </Text>
            <EditButton recipeId={item.id} />
            </SafeAreaView>
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
  riga: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
  paddingVertical: 8,
},
});

export default Home;


