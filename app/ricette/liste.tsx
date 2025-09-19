import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { Alert, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { deleteList, getLists, RecipeList, saveList } from "../../utils/ListeStorage";
import { getRecipes, Recipe } from "../../utils/recipeStorage";

const Lists = () => {
  const router = useRouter();
  const [lists, setLists] = useState<RecipeList[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const navigation = useNavigation();

    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false
      });
    }, [navigation]);

  const loadData = useCallback(async () => {
    const [listsData, recipesData] = await Promise.all([
      getLists(),
      getRecipes()
    ]);
    setLists(listsData);
    setRecipes(recipesData);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const createNewList = async () => {
    if (!newListName.trim()) {
      Alert.alert("Errore", "Inserisci un nome per la lista");
      return;
    }

    if (selectedRecipes.length === 0) {
      Alert.alert("Errore", "Seleziona almeno una ricetta");
      return;
    }

    await saveList({
      id: Date.now().toString(),
      name: newListName,
      recipeIds: selectedRecipes,
      createdAt: new Date().toISOString()
    });

    setNewListName("");
    setSelectedRecipes([]);
    setShowCreateModal(false);
    loadData();
  };

  const toggleRecipeSelection = (recipeId: string) => {
    setSelectedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId) 
        : [...prev, recipeId]
    );
  };

  const handleDeleteList = async (listId: string) => {
    Alert.alert(
      "Elimina lista",
      "Sei sicuro di voler eliminare questa lista?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          style: "destructive",
          onPress: async () => {
            await deleteList(listId);
            loadData();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Le Mie Liste</Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.createButtonText}>+ Crea Nuova Lista</Text>
      </TouchableOpacity>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity 
              style={styles.listContent}
              onPress={() => router.push(`/lists/${item.id}`)}
            >
              <Text style={styles.listName}>{item.name}</Text>
              <Text style={styles.recipeCount}>
                {item.recipeIds.length} ricetta{item.recipeIds.length !== 1 ? 'e' : ''}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteList(item.id)}
            >
              <Text style={styles.deleteButtonText}>Elimina</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Non hai ancora creato nessuna lista
          </Text>
        }
      />

      <Modal visible={showCreateModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Crea Nuova Lista</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nome della lista"
            value={newListName}
            onChangeText={setNewListName}
          />
          
          <Text style={styles.subtitle}>Seleziona ricette:</Text>
          
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.recipeItem,
                  selectedRecipes.includes(item.id) && styles.selectedRecipe
                ]}
                onPress={() => toggleRecipeSelection(item.id)}
              >
                <Text style={styles.recipeName}>{item.title}</Text>
                {selectedRecipes.includes(item.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setShowCreateModal(false);
                setSelectedRecipes([]);
                setNewListName("");
              }}
            >
              <Text style={styles.modalButtonText}>Annulla</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.createListButton]}
              onPress={createNewList}
            >
              <Text style={styles.modalButtonText}>Crea Lista</Text>
            </TouchableOpacity>
          </View>
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
    color: "#386641"
  },
  createButton: {
    backgroundColor: '#64994E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  listContent: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: '600',
  },
  recipeCount: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#BC4749',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
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
    color: "#386641"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: "#64994e",
    marginLeft: 11,
  },
  recipeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedRecipe: {
    backgroundColor: '#e3f2fd',
  },
  recipeName: {
    fontSize: 16,
  },
  checkmark: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  createListButton: {
    backgroundColor: '#BC4749',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Lists;