import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUser, saveUser } from './../utils/storage';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (!username || !password) {
      Alert.alert('Errore', 'Inserisci username e password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Errore', 'Le password non coincidono');
      return;
    }

    const existingUser = await getUser(username);
    if (existingUser) {
      Alert.alert('Errore', 'Username già esistente');
      return;
    }

    await saveUser(username, password);
    Alert.alert('Successo', 'Account creato!');
    router.replace('/sign-in');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Registrati
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
      
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }}
        placeholder="Conferma Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      
      <TouchableOpacity
        style={{ backgroundColor: 'green', padding: 15, borderRadius: 5 }}
        onPress={handleSignUp}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Registrati</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={{ padding: 15 }}
        onPress={() => router.push('/sign-in')}
      >
        <Text style={{ color: 'blue', textAlign: 'center' }}>Hai già un account? Accedi</Text>
      </TouchableOpacity>
    </View>
  );
}