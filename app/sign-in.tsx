import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUser, setCurrentUser } from './../utils/storage';

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
      await setCurrentUser(username); 
      Alert.alert('Successo', 'Login effettuato!');
      router.replace('/(tabs)');
    } else {
      Alert.alert('Errore', 'Credenziali non valide');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}> 
      <Image
        source={require('@/assets/icons/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Accedi</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>Accedi</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.signUpLink}
          onPress={() => router.push('/sign-up')}
        >
          <Text style={styles.linkText}>Non hai un account? Registrati</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
  },
  logo: {
    width: 400,
    height: 200,
    marginBottom: -20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  },
  signInButton: {
    backgroundColor: '#386641',
    padding: 15,
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  },
  signUpLink: {
    padding: 15
  },
  linkText: {
    color: '#386641',
    textAlign: 'center'
  }
});

