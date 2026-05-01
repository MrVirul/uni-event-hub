import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Uni Event Hub!</Text>
      
      <View style={styles.buttonContainer}>
        <Button onPress={() => router.push('/login')} size="lg" style={styles.button}>
          Log In
        </Button>
        <Button onPress={() => router.push('/signup')} size="lg" variant="outline" style={styles.button}>
          Sign Up
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa', // zinc-50
    padding: 24,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#09090b', // zinc-950
    letterSpacing: -0.5,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  button: {
    width: '100%',
  },
});
