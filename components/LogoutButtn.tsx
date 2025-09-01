import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface LogoutButtonProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  color?: string;
}

export default function LogoutButton({ 
  position = 'top-right', 
  color = '#BC4749' 
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Sei sicuro di voler uscire?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Esci', onPress: () => router.replace('/sign-in') }
    ]);
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'top-left':
        return { top: 50, left: 20 };
      case 'bottom-right':
        return { bottom: 20, right: 20 };
      case 'bottom-left':
        return { bottom: 20, left: 20 };
      default: // top-right
        return { top: 50, right: 20 };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getPositionStyle(), { backgroundColor: color }]}
      onPress={handleLogout}
    >
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000
  },
  text: {
    color: 'white',
    fontWeight: 'bold'
  }
});


