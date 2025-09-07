import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@favorites";

export const addToFavorites = async (recipeId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(recipeId)) {
      favorites.push(recipeId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
    return true;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return false;
  }
};

export const removeFromFavorites = async (recipeId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(id => id !== recipeId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return false;
  }
};

export const getFavorites = async (): Promise<string[]> => {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? (JSON.parse(json) as string[]) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

export const isFavorite = async (recipeId: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.includes(recipeId);
};