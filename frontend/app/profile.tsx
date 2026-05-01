import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SvgUri } from 'react-native-svg';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error(error);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    router.replace('/');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#09090b" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <CardHeader style={styles.header}>
            <View style={styles.avatarContainer}>
              <SvgUri uri={avatarUrl} width={80} height={80} />
            </View>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.role === 'admin' ? 'Administrator' : 'Student'}</CardDescription>
          </CardHeader>
          
          <CardContent style={styles.content}>
            <View style={styles.infoRow}>
              <Label>Email</Label>
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Label>Student Number</Label>
              <Text style={styles.infoText}>{user.studentNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Label>Phone Number</Label>
              <Text style={styles.infoText}>{user.phoneNumber}</Text>
            </View>
          </CardContent>
          
          <CardFooter>
            <Button variant="destructive" style={styles.logoutButton} onPress={handleLogout}>
              Log Out
            </Button>
          </CardFooter>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e4e4e7',
    backgroundColor: '#f4f4f5',
  },
  content: {
    gap: 16,
    marginTop: 8,
  },
  infoRow: {
    gap: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#09090b',
  },
  logoutButton: {
    width: '100%',
  }
});
