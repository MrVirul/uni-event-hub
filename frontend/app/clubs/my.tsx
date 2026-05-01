import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function MyClubsScreen() {
    const router = useRouter();
    const [clubs, setClubs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyClubs();
    }, []);

    const fetchMyClubs = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                router.replace('/login');
                return;
            }

            const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
            const response = await fetch(`${API_URL}/api/clubs/my/all`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch clubs');
            }

            const data = await response.json();
            setClubs(data.clubs);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClub = async (id: string) => {
        Alert.alert(
            'Delete Club',
            'Are you sure you want to delete this club?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
                            const response = await fetch(`${API_URL}/api/clubs/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (!response.ok) {
                                throw new Error('Failed to delete club');
                            }

                            setClubs(prev => prev.filter(club => club._id !== id));
                            Alert.alert('Success', 'Club deleted successfully');
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#09090b" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>My Clubs</Text>
                    <Button size="sm" onPress={() => router.push('/clubs/create')}>
                        Create Club
                    </Button>
                </View>

                {clubs.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>You haven't created any clubs yet.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={clubs}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <Card style={styles.clubCard}>
                                <CardHeader style={styles.cardHeader}>
                                    <Image source={{ uri: item.image }} style={styles.clubImage} />
                                    <View>
                                        <CardTitle>{item.name}</CardTitle>
                                        <CardDescription numberOfLines={1}>{item.description}</CardDescription>
                                    </View>
                                </CardHeader>
                                <CardFooter style={styles.cardFooter}>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        style={styles.actionButton}
                                        onPress={() => router.push(`/clubs/${item._id}`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        style={styles.actionButton}
                                        onPress={() => handleDeleteClub(item._id)}
                                    >
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                    />
                )}
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
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#09090b',
    },
    listContent: {
        gap: 16,
    },
    clubCard: {
        marginBottom: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        padding: 16,
    },
    clubImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    cardFooter: {
        justifyContent: 'flex-end',
        gap: 8,
        padding: 12,
    },
    actionButton: {
        minWidth: 80,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#71717a',
        fontSize: 16,
    }
});
