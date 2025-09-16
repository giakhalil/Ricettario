import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { deleteShoppingListItem, getFilteredShoppingList, saveShoppingListItem, ShoppingListItem, toggleShoppingListItem } from '../utils/ShopppingListStorage';
const ShoppingList = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const navigation = useNavigation();

 const loadShoppingList = useCallback(async () => {
  const items = await getFilteredShoppingList(); 
  setShoppingList(items);
}, []);

  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);

  const addManualItem = async () => {
    if (newItem.trim()) {
      await saveShoppingListItem({
        name: newItem.trim(),
        completed: false
      });
      setNewItem('');
      loadShoppingList();
    }
  };

  const handleToggleItem = async (id: string) => {
    await toggleShoppingListItem(id);
    loadShoppingList();
  };

  const handleDeleteItem = async (id: string) => {
    await deleteShoppingListItem(id);
    loadShoppingList();
  };

     useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: false
        });
      }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista della Spesa</Text>

      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Aggiungi ingrediente..."
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={addManualItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addManualItem}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={shoppingList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.listItem, item.completed && styles.completedItem]}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => handleToggleItem(item.id)}
            >
              <Text>{item.completed ? '✓' : '○'}</Text>
            </TouchableOpacity>
            <Text style={[styles.itemText, item.completed && styles.completedText]}>
              {item.name}
              {item.fromRecipe && <Text style={styles.recipeSource}> ({item.fromRecipe})</Text>}
            </Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Text>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>La lista della spesa è vuota</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "#386641",
  },
  addContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#386641',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  completedItem: {
    backgroundColor: '#f0f0f0',
  },
  checkbox: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  recipeSource: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default ShoppingList;