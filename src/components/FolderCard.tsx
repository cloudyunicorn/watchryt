import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Folder } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    folder: Folder;
    onPress: () => void;
}

export const FolderCard = ({ folder, onPress }: Props) => {
    const { colors, borderRadius, spacing } = useTheme();

    const styles = StyleSheet.create({
        card: {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.l,
            padding: spacing.m,
            width: '48%',
            marginBottom: spacing.m,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.surfaceHighlight,
        },
        iconContainer: {
            marginBottom: spacing.s,
            padding: spacing.s,
            backgroundColor: colors.surfaceHighlight,
            borderRadius: 50,
        },
        name: {
            color: colors.textPrimary,
            fontWeight: '600',
            fontSize: 16,
            marginBottom: 4,
        },
        count: {
            color: colors.textSecondary,
            fontSize: 12,
        }
    });

    return (
        <Pressable style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Ionicons name="folder-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.name}>{folder.name}</Text>
            <Text style={styles.count}>{folder.videoCount || 0} videos</Text>
        </Pressable>
    );
};
