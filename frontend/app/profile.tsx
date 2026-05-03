import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, StatusBar, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../constants/Config';
import { Sidebar } from '../components/ui/Sidebar';


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    studentNumber: '',
    phoneNumber: ''
  });

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
      setEditForm({
        name: data.user.name,
        email: data.user.email,
        studentNumber: data.user.studentNumber,
        phoneNumber: data.user.phoneNumber
      });
    } catch (error) {
      console.error(error);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdateLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setUser(data.user);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUpdateLoading(false);
    }
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
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={28} color="#09090b" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Card style={styles.card}>
          <CardHeader style={styles.header}>
            <View style={styles.avatarContainer}>
              <SvgUri uri={avatarUrl} width={80} height={80} />
            </View>
            {isEditing ? (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <TextInput
                  style={[styles.infoText, styles.editInput, { textAlign: 'center', fontWeight: 'bold', fontSize: 20 }]}
                  value={editForm.name}
                  onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                  placeholder="Your Name"
                />
              </View>
            ) : (
              <CardTitle>{user.name}</CardTitle>
            )}
            <CardDescription>{user.role === 'admin' ? 'Administrator' : 'Student'}</CardDescription>
          </CardHeader>
          
          <CardContent style={styles.content}>
            <View style={styles.infoRow}>
              <Label>Email</Label>
              {isEditing ? (
                <TextInput
                  style={[styles.infoText, styles.editInput]}
                  value={editForm.email}
                  onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.infoText}>{user.email}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Label>Student Number</Label>
              {isEditing ? (
                <TextInput
                  style={[styles.infoText, styles.editInput]}
                  value={editForm.studentNumber}
                  onChangeText={(text) => setEditForm({ ...editForm, studentNumber: text })}
                />
              ) : (
                <Text style={styles.infoText}>{user.studentNumber}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Label>Phone Number</Label>
              {isEditing ? (
                <TextInput
                  style={[styles.infoText, styles.editInput]}
                  value={editForm.phoneNumber}
                  onChangeText={(text) => setEditForm({ ...editForm, phoneNumber: text })}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoText}>{user.phoneNumber}</Text>
              )}
            </View>
          </CardContent>
          
          <CardFooter style={styles.footer}>
            <Button 
              variant="default" 
              style={styles.manageButton} 
              onPress={() => router.push('/clubs/my')}
            >
              Manage My Clubs
            </Button>
            {isEditing ? (
              <View style={{ gap: 8, width: '100%' }}>
                <Button 
                  variant="default" 
                  style={styles.actionButton} 
                  onPress={handleUpdate}
                  loading={updateLoading}
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  style={styles.actionButton} 
                  onPress={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: user.name,
                      email: user.email,
                      studentNumber: user.studentNumber,
                      phoneNumber: user.phoneNumber
                    });
                  }}
                >
                  Cancel
                </Button>
              </View>
            ) : (
              <Button 
                variant="outline" 
                style={styles.actionButton} 
                onPress={() => setIsEditing(true)}
              >
                Edit Details
              </Button>
            )}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#09090b',
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
  editInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingVertical: 4,
    color: '#09090b',
  },
  footer: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 16,
  },
  manageButton: {
    width: '100%',
  },
  actionButton: {
    width: '100%',
  }
});
