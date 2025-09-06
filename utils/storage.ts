import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@users';
const CURRENT_USER_KEY = '@currentUser'; // Aggiungi questa costante

export interface User {
  username: string;
  password: string;
}

// Aggiungi queste funzioni:
export const setCurrentUser = async (username: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, username);
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

export const getCurrentUser = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const clearCurrentUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Error clearing current user:', error);
  }
};

export const saveUser = async (username: string, password: string): Promise<void> => {
  try {
    const existingUsers = await getUsers();
    const newUser = { username, password };
    const updatedUsers = { ...existingUsers, [username]: newUser };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const updateUserPassword = async (username: string, newPassword: string): Promise<boolean> => {
  try {
    const existingUsers = await getUsers();
    if (!existingUsers[username]) {
      return false;
    }
    
    const updatedUsers = {
      ...existingUsers,
      [username]: { username, password: newPassword }
    };
    
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
};

export const getUsers = async (): Promise<Record<string, User>> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : {};
  } catch (error) {
    console.error('Error getting users:', error);
    return {};
  }
};

export const getUser = async (username: string): Promise<User | null> => {
  const users = await getUsers();
  return users[username] || null;
};
