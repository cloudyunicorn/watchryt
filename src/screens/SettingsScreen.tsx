import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="moon-outline" size={20} color={theme.colors.textPrimary} style={{ marginRight: 12 }} />
                        <Text style={styles.rowText}>Dark Mode</Text>
                    </View>
                    <Switch value={true} trackColor={{ false: '#767577', true: theme.colors.primary }} thumbColor="#f4f3f4" />
                </View>

                <Pressable style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="notifications-outline" size={20} color={theme.colors.textPrimary} style={{ marginRight: 12 }} />
                        <Text style={styles.rowText}>Notifications</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                </Pressable>
            </View>

            <View style={styles.proCard}>
                <Text style={styles.proTitle}>Upgrade to Pro</Text>
                <Text style={styles.proText}>Unlock unlimited folders, cloud sync, and custom themes.</Text>
                <Pressable style={styles.proBtn}>
                    <Text style={styles.proBtnText}>Get Pro</Text>
                </Pressable>
            </View>

            <View style={styles.footer}>
                <Text style={styles.version}>Version 1.0.0</Text>
            </View>
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
        marginBottom: theme.spacing.l,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    section: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.l,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    rowText: {
        color: theme.colors.textPrimary,
        fontSize: 16,
    },
    proCard: {
        backgroundColor: 'rgba(187, 134, 252, 0.1)',
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.l,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    proTitle: {
        color: theme.colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    proText: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    proBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 20,
    },
    proBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    version: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    }
});
