import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Wiikard POC</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/(client)')}>
          <Text style={styles.buttonText}>Espace Client (B2C)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.partnerButton]} onPress={() => router.push('/(partner)')}>
          <Text style={[styles.buttonText, {color: '#0D0D0D'}]}>Espace Partenaire (B2B)</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F8F6', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0D0D0D', marginBottom: 40 },
  button: { backgroundColor: '#FF4F30', padding: 18, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 15 },
  partnerButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});