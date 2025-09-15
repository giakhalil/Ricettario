import { getRatings } from "@/utils/RatingStorage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LogoutButton from '../../components/LogoutButtn';
import { getFavorites } from "../../utils/FavoriteStorage";
import { getFridgeItems } from "../../utils/FridgeStorage";
import { getLists } from "../../utils/ListeStorage";
import { getRecipes } from "../../utils/recipeStorage";
import { getShoppingList } from "../../utils/ShopppingListStorage";

export default function Profile() {
  const router = useRouter();
   const [stats, setStats] = useState({
    recipes: 0,
    favorites: 0,
    fridgeItems: 0,
    lists: 0,
    shoppingItems: 0,
    averageRating: 0,
  });

   useEffect(() => {
    const loadStats = async () => {
      const [recipes, favorites, fridgeItems, lists, shoppingItems, ratings] = await Promise.all([
        getRecipes(),
        getFavorites(),
        getFridgeItems(),
        getLists(),
        getShoppingList(),
        getRatings(),
      ]);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating.stars, 0) / ratings.length
        : 0;

      setStats({
        recipes: recipes.length,
        favorites: favorites.length,
        fridgeItems: fridgeItems.length,
        lists: lists.length,
        shoppingItems: shoppingItems.length,
        averageRating: Number(averageRating.toFixed(1)) 
      });
    };

    loadStats();
  }, []);

return (
  <View style={styles.container}>
     <View style={styles.header}>
            <View style={styles.ImageContainer}>
              <Image
                source={require('@/assets/icons/user.png')}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View>
    <LogoutButton />

    <View style={styles.credentialsCard}>
        <Text style={styles.credentialsTitle}>Profilo Utente</Text>
        <TouchableOpacity
          style={styles.credentialsButton}
          onPress={() => router.push("../credentials")}
        >
          <Text style={styles.credentialsText}>Gestici Profilo</Text>
        </TouchableOpacity>
      </View>
        <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Riepilogo Attività</Text>
        
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.recipes}</Text>
            <Text style={styles.statLabel}>Ricette</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.favorites}</Text>
            <Text style={styles.statLabel}>Preferiti</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.fridgeItems}</Text>
            <Text style={styles.statLabel}>Nel frigo</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.lists}</Text>
            <Text style={styles.statLabel}>Liste</Text>
          </View>
        </View>
         <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.shoppingItems}</Text>
            <Text style={styles.statLabel}>Lista spesa</Text>
          </View>
          
          <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.averageRating}</Text>
            <Text style={styles.statLabel}>Voto medio</Text>
          </View>
        </View>
        
      </View>
     </View>
);
}

const styles = StyleSheet.create({
   container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginTop:-100, marginBottom: 20},
   buttonContainer: { marginVertical: 20},
   image: {
    width: 150,
    height: 150,
    marginBottom: 10,
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
  
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },    
  credentialsCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "80%",
  },
  credentialsTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: -40,
  },
  credentialsButton: {
    backgroundColor: "#Bc4749", 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  credentialsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
   statsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    width: "100%",
    alignItems: "center"
  },
  statsTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#386641"
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15
  },
    statItem: {
    alignItems: "center",
    minWidth: 80
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#bc4749"
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5
  }
});

