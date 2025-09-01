import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUser } from './../utils/storage';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert('Errore', 'Inserisci username e password');
      return;
    }

    const user = await getUser(username);
    
    if (user && user.password === password) {
      Alert.alert('Successo', 'Login effettuato!');
      router.replace('/(tabs)');
    } else {
      Alert.alert('Errore', 'Credenziali non valide');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Accedi
      </Text>
      
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity
        style={{ backgroundColor: 'blue', padding: 15, borderRadius: 5 }}
        onPress={handleSignIn}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Accedi</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={{ padding: 15 }}
        onPress={() => router.push('/sign-up')}
      >
        <Text style={{ color: 'blue', textAlign: 'center' }}>Non hai un account? Registrati</Text>
      </TouchableOpacity>
    </View>
  );
}