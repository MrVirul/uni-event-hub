import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🎓</Text>
          </View>
          <Text style={styles.title}>Uni Event Hub</Text>
          <Text style={styles.subtitle}>
            Connect with your campus community. Discover, join, and manage student clubs in one place.
          </Text>
        </View>
        
        <View style={styles.actionSection}>
          <Button 
            onPress={() => router.push('/login')} 
            size="lg" 
            style={styles.primaryButton}
          >
            Get Started
          </Button>
          <Button 
            onPress={() => router.push('/signup')} 
            size="lg" 
            variant="outline" 
            style={styles.secondaryButton}
          >
            Create Account
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made for students, by students.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
  },
  heroSection: {
    marginTop: 60,
    alignItems: 'center',
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 26,
    paddingHorizontal: 12,
  },
  actionSection: {
    gap: 12,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  footer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  }
});
