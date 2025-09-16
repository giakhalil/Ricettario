import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type Props = { recipeId: string };

const EditButton: React.FC<Props> = ({ recipeId }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() =>
        router.push({ pathname: "/ricette/EditRecipe", params: { id: recipeId } })
      }
      accessibilityLabel="Modifica ricetta"
    >
      <MaterialIcons name="edit" size={22} color="#64994E" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 6,
  },
});

export default EditButton;

