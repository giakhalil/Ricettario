import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

const RecipeForm = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = () => {
    console.log({
      title,
      ingredients,
      instructions,
    });
  };

  return (
    <View>
      <TextInput
        placeholder="Titolo ricetta"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Ingredienti"
        style={styles.input}
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />
      <TextInput
        placeholder="Istruzioni"
        style={styles.input}
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />
      <Button title="Salva ricetta" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default RecipeForm;