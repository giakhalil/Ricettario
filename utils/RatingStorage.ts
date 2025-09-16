import AsyncStorage from "@react-native-async-storage/async-storage";

const RATINGS_KEY = "@recipe_ratings";

export interface Rating {
  recipeId: string;
  stars: number;
  ratedAt: string;
}

export const saveRating = async (recipeId: string, stars: number): Promise<boolean> => {
  try {
    const ratings = await getRatings();
    const existingIndex = ratings.findIndex(r => r.recipeId === recipeId);
    
    if (existingIndex >= 0) {
      ratings[existingIndex] = { recipeId, stars, ratedAt: new Date().toISOString() };
    } else {
      ratings.push({ recipeId, stars, ratedAt: new Date().toISOString() });
    }
    
    await AsyncStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    return true;
  } catch (error) {
    return false;
  }
};

export const getRatings = async (): Promise<Rating[]> => {
  try {
    const json = await AsyncStorage.getItem(RATINGS_KEY);
    return json ? (JSON.parse(json) as Rating[]) : [];
  } catch (error) {
    return [];
  }
};

export const getRecipeRating = async (recipeId: string): Promise<number> => {
  const ratings = await getRatings();
  const rating = ratings.find(r => r.recipeId === recipeId);
  return rating ? rating.stars : 0;
};

export const getAverageRating = async (recipeId: string): Promise<number> => {
  const ratings = await getRatings();
  const recipeRatings = ratings.filter(r => r.recipeId === recipeId);
  if (recipeRatings.length === 0) return 0;
  
  const sum = recipeRatings.reduce((total, r) => total + r.stars, 0);
  return sum / recipeRatings.length;
};