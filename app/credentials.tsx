import { useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
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
      <View style={styles.content}>
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

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Aggiorna password</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  content: {
    padding: 20,
    marginTop: 40
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center",
    color: "#386641"
  },
  subtitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginTop: 20, 
    marginBottom: 15,
    color: "#386641"
  },
  label: { 
    fontSize: 16, 
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#386641",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10
  },
  buttonDisabled: {
    backgroundColor: "#a5a5a5"
  },
  buttonText: {
    color: "white", 
    fontSize: 16,
    fontWeight: "600"
  }
});
