import AsyncStorage from "@react-native-async-storage/async-storage";

export const RECIPES_KEY = "@recipes";

export interface Recipe {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  cookingTime?: string;
  image?: string;
  quantities?: string;
  notes?: string;
}

export const saveRecipe = async (
  recipe: Omit<Recipe, "id">
): Promise<Recipe | null> => {
  try {
    const current = await getRecipes();
    const newRecipe: Recipe = { id: Date.now().toString(), ...recipe };
    const updated = [...current, newRecipe];
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(updated));
    return newRecipe;
  } catch (error) {
    return null;
  }
};

export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const json = await AsyncStorage.getItem(RECIPES_KEY);
    return json ? (JSON.parse(json) as Recipe[]) : [];
  } catch (error) {
    return [];
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const recipes = await getRecipes();
    return recipes.find((r) => r.id === id) ?? null;
  } catch (error) {
    return null;
  }
};

export const deleteRecipe = async (id: string): Promise<boolean> => {
  try {
    const storedRecipes = await getRecipes();
    const updatedRecipes = storedRecipes.filter(recipe => recipe.id !== id);
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
    return true;
  } catch (error) {
    return false;
  }
};

