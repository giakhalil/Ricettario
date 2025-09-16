import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { deleteFridgeItem, FridgeItem, getFridgeItems, saveFridgeItem } from '../utils/FridgeStorage';
import { getRecipes, Recipe } from '../utils/recipeStorage';

const Fridge = () => {
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [matchingRecipes, setMatchingRecipes] = useState<Recipe[]>([]);
  const [showRecipesModal, setShowRecipesModal] = useState(false);
  const navigation = useNavigation();

  const loadFridgeItems = useCallback(async () => {
    const items = await getFridgeItems();
    setFridgeItems(items);
  }, []);

  useEffect(() => {
    loadFridgeItems();
  }, [loadFridgeItems]);

  useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false
      });
    }, [navigation]);

  const addFridgeItem = async () => {
    if (newItem.trim()) {
      await saveFridgeItem({
        name: newItem.trim(),
        quantity: newQuantity.trim() || '1',
        category: 'Altro'
      });
      setNewItem('');
      setNewQuantity('');
      loadFridgeItems();
    }
  };

  const handleDeleteItem = async (id: string) => {
  
  Alert.alert(
    "Elimina ingrediente",
    `Sei sicuro di voler eliminare l'ingrediente dal frigo?`,
    [
      {
        text: "Annulla",
        style: "cancel"
      },
      {
        text: "Elimina",
        style: "destructive",
        onPress: async () => {
          await deleteFridgeItem(id);
          loadFridgeItems();
        }
      }
    ]
  );
};

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const findRecipesWithSelectedIngredients = async () => {
    if (selectedItems.length === 0) {
      Alert.alert("Seleziona almeno un ingrediente");
      return;
    }

    const selectedIngredientNames = selectedItems.map(id => {
      const item = fridgeItems.find(i => i.id === id);
      return item?.name.toLowerCase() || '';
    });

    const allRecipes = await getRecipes();
    const matching = allRecipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.toLowerCase();
      return selectedIngredientNames.some(ingredient => 
        recipeIngredients.includes(ingredient)
      );
    });

    setMatchingRecipes(matching);
    setShowRecipesModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Il Mio Frigo</Text>

      <View style={styles.addContainer}>
        <TextInput
          style={[styles.input, { flex: 2 }]}
          placeholder="Ingrediente..."
          value={newItem}
          onChangeText={setNewItem}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginHorizontal: 5 }]}
          placeholder="Qtà"
          value={newQuantity}
          onChangeText={setNewQuantity}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={addFridgeItem}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {selectedItems.length > 0 && (
        <TouchableOpacity 
          style={styles.findRecipesButton}
          onPress={findRecipesWithSelectedIngredients}
        >
          <Text style={styles.findRecipesText}>
            🍳 Trova ricette ({selectedItems.length} ingredienti selezionati)
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={fridgeItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.listItem, 
              selectedItems.includes(item.id) && styles.selectedItem
            ]}
            onPress={() => toggleItemSelection(item.id)}
            onLongPress={() => handleDeleteItem(item.id)}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>{item.quantity}</Text>
            </View>
            {selectedItems.includes(item.id) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Il frigo è vuoto</Text>
        }
      />
      
      <Modal visible={showRecipesModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ricette Trovate</Text>
          
          <FlatList
            data={matchingRecipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.recipeItem}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeIngredients}>{item.ingredients}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nessuna ricetta trovata</Text>
            }
          />

          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowRecipesModal(false)}
          >
            <Text style={styles.closeButtonText}>Chiudi</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
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
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  addButton: {
    backgroundColor: '#386641',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  findRecipesButton: {
    backgroundColor: '#bc4749',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  findRecipesText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "#386641",
  },
  recipeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeIngredients: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  closeButton: {
    backgroundColor: '#386641',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Fridge;