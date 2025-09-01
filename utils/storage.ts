import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@users';

export interface User {
  username: string;
  password: string;
}

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
