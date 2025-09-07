import AsyncStorage from "@react-native-async-storage/async-storage";

const SHOPPING_LIST_KEY = "@shoppingList";

export interface ShoppingListItem {
  id: string;
  name: string;
  completed: boolean;
  fromRecipe?: string;
}

export const saveShoppingListItem = async (item: Omit<ShoppingListItem, "id">): Promise<ShoppingListItem | null> => {
  try {
    const currentItems = await getShoppingList();
    const newItem: ShoppingListItem = { 
      id: Date.now().toString(), 
      ...item 
    };
    const updatedItems = [...currentItems, newItem];
    await AsyncStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(updatedItems));
    return newItem;
  } catch (error) {
    console.error("Error saving shopping list item:", error);
    return null;
  }
};

export const getShoppingList = async (): Promise<ShoppingListItem[]> => {
  try {
    const json = await AsyncStorage.getItem(SHOPPING_LIST_KEY);
    return json ? (JSON.parse(json) as ShoppingListItem[]) : [];
  } catch (error) {
    console.error("Error getting shopping list:", error);
    return [];
  }
};

export const toggleShoppingListItem = async (id: string): Promise<boolean> => {
  try {
    const items = await getShoppingList();
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    await AsyncStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(updatedItems));
    return true;
  } catch (error) {
    console.error("Error toggling shopping list item:", error);
    return false;
  }
};

export const deleteShoppingListItem = async (id: string): Promise<boolean> => {
  try {
    const items = await getShoppingList();
    const updatedItems = items.filter(item => item.id !== id);
    await AsyncStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(updatedItems));
    return true;
  } catch (error) {
    console.error("Error deleting shopping list item:", error);
    return false;
  }
};

export const clearCompletedItems = async (): Promise<boolean> => {
  try {
    const items = await getShoppingList();
    const updatedItems = items.filter(item => !item.completed);
    await AsyncStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(updatedItems));
    return true;
  } catch (error) {
    console.error("Error clearing completed items:", error);
    return false;
  }
};