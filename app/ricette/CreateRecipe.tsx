import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveRecipe } from "../../utils/recipeStorage";

const CreateRecipe = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Errore", "Inserisci un titolo per la ricetta.");
      return;
    }
    setSaving(true);
    try {
      const saved = await saveRecipe({ title: title.trim(), ingredients, instructions });
      if (!saved) throw new Error("Salvataggio fallito");
      router.back();
    } catch (error) {
      console.error("CreateRecipe - save error:", error);
      Alert.alert("Errore", "Impossibile salvare la ricetta. Riprova.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Crea una nuova ricetta</Text>

      <TextInput
        style={styles.input}
        placeholder="Titolo"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Ingredienti (una riga o separati da virgola)"
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Preparazione"
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />

      {saving ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Salva" onPress={handleSave} />
      )}
 </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});

export default CreateRecipe;

