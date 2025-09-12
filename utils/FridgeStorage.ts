import AsyncStorage from "@react-native-async-storage/async-storage";

const FRIDGE_KEY = "@fridge";

export interface FridgeItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
}

export const saveFridgeItem = async (item: Omit<FridgeItem, "id">): Promise<FridgeItem | null> => {
  try {
    const currentItems = await getFridgeItems();
    const newItem: FridgeItem = { 
      id: Date.now().toString(), 
      ...item 
    };
    const updatedItems = [...currentItems, newItem];
    await AsyncStorage.setItem(FRIDGE_KEY, JSON.stringify(updatedItems));
    return newItem;
  } catch (error) {
    console.error("Error saving fridge item:", error);
    return null;
  }
};

export const getFridgeItems = async (): Promise<FridgeItem[]> => {
  try {
    const json = await AsyncStorage.getItem(FRIDGE_KEY);
    return json ? (JSON.parse(json) as FridgeItem[]) : [];
  } catch (error) {
    console.error("Error getting fridge items:", error);
    return [];
  }
};

export const deleteFridgeItem = async (id: string): Promise<boolean> => {
  try {
    const items = await getFridgeItems();
    const updatedItems = items.filter(item => item.id !== id);
    await AsyncStorage.setItem(FRIDGE_KEY, JSON.stringify(updatedItems));
    return true;
  } catch (error) {
    console.error("Error deleting fridge item:", error);
    return false;
  }
};

export const updateFridgeItem = async (id: string, updates: Partial<FridgeItem>): Promise<boolean> => {
  try {
    const items = await getFridgeItems();
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    await AsyncStorage.setItem(FRIDGE_KEY, JSON.stringify(updatedItems));
    return true;
  } catch (error) {
    console.error("Error updating fridge item:", error);
    return false;
  }
};