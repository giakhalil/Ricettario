import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { deleteRecipe } from "../utils/recipeStorage";

interface DeleteButtonProps {
  recipeId: string;
  recipeTitle: string;
}

const DeleteButton = ({ recipeId, recipeTitle }: DeleteButtonProps) => {
  const router = useRouter();

  const handleDelete = () => {
    Alert.alert(
      "Conferma eliminazione",
      `Sei sicuro di voler eliminare "${recipeTitle}"?`,
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await deleteRecipe(recipeId);
              if (success) {
                Alert.alert("Successo", "Ricetta eliminata con successo");
                router.back();
              } else {
                Alert.alert("Errore", "Impossibile eliminare la ricetta");
              }
            } catch (error) {
              console.error("Errore eliminazione:", error);
              Alert.alert(
                "Errore",
                "Si è verificato un errore durante l'eliminazione"
              );
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleDelete}>
      <Text style={{ color: "#fff", fontWeight: "bold" }}>X</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#BC4749",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default DeleteButton;

