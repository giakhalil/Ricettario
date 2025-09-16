import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFridgeItems } from './FridgeStorage';

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
    return null;
  }
};

export const getShoppingList = async (): Promise<ShoppingListItem[]> => {
  try {
    const json = await AsyncStorage.getItem(SHOPPING_LIST_KEY);
    return json ? (JSON.parse(json) as ShoppingListItem[]) : [];
  } catch (error) {
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
    return false;
  }
};

export const getFilteredShoppingList = async (): Promise<ShoppingListItem[]> => {
  try {
    const shoppingList = await getShoppingList();
    const fridgeItems = await getFridgeItems();
    const fridgeItemNames = fridgeItems.map(item => item.name.toLowerCase());
    
    return shoppingList.filter(item => 
      !fridgeItemNames.includes(item.name.toLowerCase())
    );
  } catch (error) {
    return [];
  }
};