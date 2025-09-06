import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import LogoutButton from '../../components/LogoutButtn';

export default function Profile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profilo Utente</Text>
       <LogoutButton /> 
      <Button
        title="👤 Vedi credenziali"
        onPress={() => router.push("../credentials")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});

