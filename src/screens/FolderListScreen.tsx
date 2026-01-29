import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FolderCard } from '../components/FolderCard';
import { useTheme } from '../context/ThemeContext';
import { Folder } from '../types';
import { getFolders, createFolder } from '../services/db';
import { Ionicons } from '@expo/vector-icons';

export const FolderListScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [folderName, setFolderName] = useState('');

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
        if (!folderName.trim()) return;
        await createFolder(folderName.trim());
        setFolderName('');
        setModalVisible(false);
        loadFolders();
    };

    const openModal = () => {
        setFolderName('');
        setModalVisible(true);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 20,
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
            color: colors.textPrimary,
        },
        subtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 4,
        },
        addButton: {
            backgroundColor: colors.primary,
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
        },
        addButtonPressed: {
            opacity: 0.8,
            transform: [{ scale: 0.95 }],
        },
        list: {
            paddingBottom: 24,
        },
        row: {
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        empty: {
            marginTop: 80,
            alignItems: 'center',
            paddingHorizontal: 40,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: colors.textPrimary,
            marginTop: 16,
            marginBottom: 8,
        },
        emptyText: {
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
        },
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalBackdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.7)',
        },
        modalContent: {
            width: '85%',
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 24,
        },
        modalTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 8,
        },
        modalSubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 20,
        },
        input: {
            backgroundColor: colors.background,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            color: colors.textPrimary,
            marginBottom: 20,
        },
        modalButtons: {
            flexDirection: 'row',
            gap: 12,
        },
        cancelButton: {
            flex: 1,
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: colors.surfaceHighlight,
            alignItems: 'center',
        },
        cancelButtonText: {
            color: colors.textSecondary,
            fontWeight: '600',
            fontSize: 16,
        },
        createButton: {
            flex: 1,
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: colors.primary,
            alignItems: 'center',
        },
        createButtonDisabled: {
            opacity: 0.5,
        },
        createButtonText: {
            color: '#FFF',
            fontWeight: '600',
            fontSize: 16,
        },
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Folders</Text>
                    <Text style={styles.subtitle}>{folders.length} folder{folders.length !== 1 ? 's' : ''}</Text>
                </View>
                <Pressable
                    onPress={openModal}
                    style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
                >
                    <Ionicons name="add" size={24} color="#FFF" />
                </Pressable>
            </View>

            {/* Folder Grid */}
            <FlatList
                data={folders}
                keyExtractor={(item: Folder) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }: { item: Folder }) => (
                    <FolderCard
                        folder={item}
                        onPress={() => {
                            (navigation as any).navigate('FolderDetail', { folder: item });
                        }}
                    />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="folder-open-outline" size={64} color={colors.textSecondary} />
                        <Text style={styles.emptyTitle}>No folders yet</Text>
                        <Text style={styles.emptyText}>Create folders to organize your saved videos</Text>
                    </View>
                }
            />

            {/* Create Folder Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setModalVisible(false)}
                    />
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>New Folder</Text>
                        <Text style={styles.modalSubtitle}>Enter a name for your folder</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Folder name"
                            placeholderTextColor={colors.textSecondary}
                            value={folderName}
                            onChangeText={setFolderName}
                            autoFocus
                            maxLength={30}
                        />

                        <View style={styles.modalButtons}>
                            <Pressable
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.createButton, !folderName.trim() && styles.createButtonDisabled]}
                                onPress={handleCreate}
                                disabled={!folderName.trim()}
                            >
                                <Text style={styles.createButtonText}>Create</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};
