import AsyncStorage from "@react-native-async-storage/async-storage";

const LISTS_KEY = "@recipe_lists";

export interface RecipeList {
  id: string;
  name: string;
  recipeIds: string[];
  createdAt: string;
}

export const getLists = async (): Promise<RecipeList[]> => {
  try {
    const json = await AsyncStorage.getItem(LISTS_KEY);
    return json ? (JSON.parse(json) as RecipeList[]) : [];
  } catch (error) {
    return [];
  }
};

export const saveList = async (list: RecipeList): Promise<boolean> => {
  try {
    const lists = await getLists();
    const existingIndex = lists.findIndex(l => l.id === list.id);
    
    if (existingIndex >= 0) {
      lists[existingIndex] = list;
    } else {
      lists.push(list);
    }
    
    await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(lists));
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteList = async (listId: string): Promise<boolean> => {
  try {
    const lists = await getLists();
    const updatedLists = lists.filter(list => list.id !== listId);
    await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(updatedLists));
    return true;
  } catch (error) {
    return false;
  }
};

export const getListById = async (listId: string): Promise<RecipeList | null> => {
  try {
    const lists = await getLists();
    return lists.find(list => list.id === listId) || null;
  } catch (error) {
    return null;
  }
};