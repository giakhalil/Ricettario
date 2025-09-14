import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LogoutButton from '../../components/LogoutButtn';

export default function Profile() {
  const router = useRouter();

return (
  <View style={styles.container}>
    <Text style={styles.title}>Profilo Utente</Text>
    <LogoutButton />
    
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/ricette/recipes")}
      >
        <Text style={styles.buttonText}>🍴 Vai alle Ricette</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#386641" }]} 
        onPress={() => router.push("/shoppingList")}
      >
        <Text style={styles.buttonText}>🛒 Lista della Spesa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4CAF50" }]}
        onPress={() => router.push("../fridge")}
      >
        <Text style={styles.buttonText}>❄️ Il Mio Frigo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#6A4C93" }]}
        onPress={() => router.push("/ricette/liste")}
      >
        <Text style={styles.buttonText}>📋 Le Mie Liste</Text>
      </TouchableOpacity>
    
    <TouchableOpacity
      style={[styles.button, { backgroundColor: "#6A4C93" }]}
      onPress={() => router.push("../credentials")}
      >
      <Text style={styles.buttonText}>👤 Vedi Credenziali</Text>
    </TouchableOpacity>
     </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
   buttonContainer: { marginVertical: 20},
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
}});

