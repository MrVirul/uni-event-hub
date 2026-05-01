import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export default function CreateClubScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleCreate = async () => {
        if (!formData.name || !formData.description) {
            Alert.alert('Error', 'Name and description are required');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
            
            const response = await fetch(`${API_URL}/api/clubs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create club');
            }

            Alert.alert('Success', 'Club created successfully!', [
                { text: 'OK', onPress: () => router.replace('/clubs/my') }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Card style={styles.card}>
                        <CardHeader>
                            <CardTitle>Create New Club</CardTitle>
                            <CardDescription>Launch your new student community</CardDescription>
                        </CardHeader>

                        <CardContent style={styles.cardContent}>
                            <View style={styles.inputGroup}>
                                <Label>Club Name</Label>
                                <Input
                                    placeholder="Enter club name"
                                    value={formData.name}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Label>Description</Label>
                                <Input
                                    placeholder="What is this club about?"
                                    value={formData.description}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                                    multiline
                                    numberOfLines={4}
                                    style={styles.textArea}
                                />
                            </View>

                            <Button 
                                style={styles.submitButton}
                                onPress={handleCreate} 
                                loading={loading}
                            >
                                Create Club
                            </Button>
                            
                            <Button 
                                variant="ghost"
                                textStyle={{ color: '#ef4444' }}
                                onPress={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </CardContent>
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    cardContent: {
        gap: 16,
    },
    inputGroup: {
        gap: 2,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 8,
    },
    submitButton: {
        marginTop: 8,
    },
});
