import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FolderCard } from '../components/FolderCard';
import { theme } from '../constants/theme';
import { Folder } from '../types';
import { getFolders, createFolder } from '../services/db';
import { Ionicons } from '@expo/vector-icons';
// Basic modal for new folder would be nice, but using prompt or simple input handling for speed.
// React Native Alert.prompt works on iOS, but Android needs custom modal.
// I will implement a quick inline "Add" button logic or mock it since simpler.

export const FolderListScreen = () => {
    const navigation = useNavigation();
    const [folders, setFolders] = useState<Folder[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadFolders();
        }, [])
    );

    const loadFolders = async () => {
        const data = await getFolders();
        setFolders(data);
    };

    const handleCreate = async () => {
        // For MVP, just creating a generic "New Folder" or random 
        // In production, navigate to a small creation modal or show input
        const newName = `Folder ${folders.length + 1}`;
        await createFolder(newName);
        loadFolders();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Folders</Text>
                <Pressable onPress={handleCreate}>
                    <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
                </Pressable>
            </View>

            <FlatList
                data={folders}
                keyExtractor={(item: Folder) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }: { item: Folder }) => (
                    <FolderCard
                        folder={item}
                        onPress={() => {
                            // Navigate to Detail, passing folder info
                            // We need to implement FolderDetailScreen next or just assume it
                            (navigation as any).navigate('FolderDetail', { folder: item });
                        }}
                    />
                )}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: theme.spacing.xl,
        paddingHorizontal: theme.spacing.m,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    list: {
        paddingBottom: theme.spacing.xl,
    },
    row: {
        justifyContent: 'space-between',
    }
});
