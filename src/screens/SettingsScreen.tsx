import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = () => {
    const insets = useSafeAreaInsets();
    const { colors, isDarkMode, toggleTheme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 20,
        },
        header: {
            marginBottom: 28,
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
        sectionTitle: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 8,
            marginLeft: 4,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        section: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            paddingHorizontal: 16,
            marginBottom: 24,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 14,
        },
        rowLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        iconContainer: {
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: `${colors.primary}25`,
            justifyContent: 'center',
            alignItems: 'center',
        },
        rowText: {
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: '500',
        },
        rowSubtext: {
            color: colors.textSecondary,
            fontSize: 13,
            marginTop: 2,
        },
        divider: {
            height: 1,
            backgroundColor: colors.surfaceHighlight,
        },
        proCard: {
            backgroundColor: `${colors.primary}15`,
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: `${colors.primary}40`,
            marginTop: 8,
        },
        proHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
        },
        proTitle: {
            color: colors.primary,
            fontSize: 20,
            fontWeight: 'bold',
        },
        proText: {
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 20,
            lineHeight: 20,
        },
        proBtn: {
            backgroundColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 40,
            borderRadius: 24,
        },
        proBtnText: {
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: 16,
        },
        footer: {
            marginTop: 'auto',
            alignItems: 'center',
            paddingBottom: 24,
        },
        version: {
            color: colors.textSecondary,
            fontSize: 13,
            marginBottom: 4,
        },
        copyright: {
            color: colors.textSecondary,
            fontSize: 12,
        },
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
                <Text style={styles.subtitle}>Customize your experience</Text>
            </View>

            {/* Appearance Section */}
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.section}>
                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="moon" size={20} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.rowText}>Dark Mode</Text>
                            <Text style={styles.rowSubtext}>{isDarkMode ? 'On' : 'Off'}</Text>
                        </View>
                    </View>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: colors.primary }}
                        thumbColor={isDarkMode ? '#FFF' : '#f4f3f4'}
                    />
                </View>
            </View>

            {/* General Section */}
            <Text style={styles.sectionTitle}>General</Text>
            <View style={styles.section}>
                <Pressable style={styles.row}>
                    <View style={styles.rowLeft}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="notifications" size={20} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.rowText}>Notifications</Text>
                            <Text style={styles.rowSubtext}>Manage reminders</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </Pressable>

                <View style={styles.divider} />

                <Pressable style={styles.row}>
                    <View style={styles.rowLeft}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="trash" size={20} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.rowText}>Clear All Data</Text>
                            <Text style={styles.rowSubtext}>Delete all saved videos</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </Pressable>
            </View>

            {/* Pro Card */}
            <View style={styles.proCard}>
                <View style={styles.proHeader}>
                    <Ionicons name="sparkles" size={24} color={colors.primary} />
                    <Text style={styles.proTitle}>Upgrade to Pro</Text>
                </View>
                <Text style={styles.proText}>Unlock unlimited folders, cloud sync, and custom themes.</Text>
                <Pressable style={styles.proBtn}>
                    <Text style={styles.proBtnText}>Get Pro</Text>
                </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.version}>WatchRyt v1.0.0</Text>
                <Text style={styles.copyright}>Made with ❤️</Text>
            </View>
        </View>
    );
};
