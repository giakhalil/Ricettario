import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput } from "react-native";
import { getCurrentUser, getUser, updateUserPassword } from "../utils/storage";

export default function Credentials() {
  const [username, setUsername] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

 useEffect(() => {
    const loadUser = async () => {
      const currentUsername = await getCurrentUser();
      if (currentUsername) {
        setUsername(currentUsername);
      }
    };
    loadUser();
  }, []);

  useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false
      });
    }, [navigation]);

   const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Errore", "Compila tutti i campi");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Errore", "Le password non coincidono");
      return;
    }

    setLoading(true);
    try {
      if (!username) {
        Alert.alert("Errore", "Utente non trovato");
        return;
      }

      const user = await getUser(username);
      if (!user) {
        Alert.alert("Errore", "Utente non trovato");
        return;
      }

      if (user.password !== oldPassword) {
        Alert.alert("Errore", "Vecchia password non corretta");
        return;
      }

      const success = await updateUserPassword(username, newPassword);
      if (success) {
        Alert.alert("Successo", "Password modificata!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Errore", "Impossibile aggiornare la password");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Errore", "Qualcosa è andato storto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Credenziali Utente</Text>
      {username ? (
        <Text style={styles.label}>Username: {username}</Text>
      ) : (
        <Text style={styles.label}>Caricamento...</Text>
      )}

      <Text style={styles.subtitle}>Modifica password</Text>
      <TextInput
        style={styles.input}
        placeholder="Vecchia password"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Nuova password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Conferma nuova password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button
        title={loading ? "⏳ Aggiornamento..." : "🔒 Aggiorna password"}
        onPress={handleChangePassword}
        disabled={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 10 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
});



