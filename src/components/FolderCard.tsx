import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Folder } from '../types';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    folder: Folder;
    onPress: () => void;
}

export const FolderCard = ({ folder, onPress }: Props) => {
    return (
        <Pressable style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Ionicons name="folder-outline" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.name}>{folder.name}</Text>
            <Text style={styles.count}>{folder.videoCount || 0} videos</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        width: '48%',
        marginBottom: theme.spacing.m,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    iconContainer: {
        marginBottom: theme.spacing.s,
        padding: theme.spacing.s,
        backgroundColor: theme.colors.surfaceHighlight,
        borderRadius: 50,
    },
    name: {
        color: theme.colors.textPrimary,
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 4,
    },
    count: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    }
});
