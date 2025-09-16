import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@favorites";

export const addToFavorites = async (recipeId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const cleanedFavorites = [...new Set(favorites)];
    
    if (!cleanedFavorites.includes(recipeId)) {
      cleanedFavorites.push(recipeId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(cleanedFavorites));
    }
    return true;
  } catch (error) {
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
    return false;
  }
};

export const getFavorites = async (): Promise<string[]> => {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!json) return [];
    
    const favorites = JSON.parse(json) as string[];
    return [...new Set(favorites)].filter(id => id && typeof id === 'string');
  } catch (error) {
    return [];
  }
};

export const isFavorite = async (recipeId: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.includes(recipeId);
};

export const cleanupFavorites = async (): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const cleanedFavorites = [...new Set(favorites)].filter(id => 
      id && typeof id === 'string' && id.trim() !== ''
    );
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(cleanedFavorites));
    return true;
  } catch (error) {
    return false;
  }
};