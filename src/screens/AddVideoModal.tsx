import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, Alert, Image as RNImage } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { Video, Platform, Folder } from '../types';
import { isValidLink, getVideoMetadata } from '../services/linkHandler';
import { saveVideo, getFolders } from '../services/db';
import { scheduleReminder } from '../services/reminders';
import { Ionicons } from '@expo/vector-icons';

export const AddVideoModal = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [creator, setCreator] = useState('');
    const [platform, setPlatform] = useState<Platform>(Platform.Unknown);
    const [loading, setLoading] = useState(false);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [reminderPreset, setReminderPreset] = useState<string | null>(null);

    useEffect(() => {
        loadFolders();

        // Check for shared URL from navigation params first
        const sharedUrl = route.params?.sharedUrl;
        if (sharedUrl && isValidLink(sharedUrl)) {
            console.log('[AddVideoModal] Received shared URL:', sharedUrl);
            setUrl(sharedUrl);
            fetchMetadata(sharedUrl);
        } else {
            // Fall back to clipboard check
            checkClipboard();
        }
    }, [route.params?.sharedUrl]);

    const loadFolders = async () => {
        const f = await getFolders();
        setFolders(f);
    }

    const checkClipboard = async () => {
        const content = await Clipboard.getStringAsync();
        if (content && isValidLink(content)) {
            setUrl(content);
            fetchMetadata(content);
        }
    };

    const fetchMetadata = async (link: string) => {
        if (!isValidLink(link)) return;
        setLoading(true);
        try {
            const meta = await getVideoMetadata(link);
            setTitle(meta.title);
            setPlatform(meta.platform);
            setThumbnailUrl(meta.thumbnailUrl || '');
            setCreator(meta.creator || '');
        } catch (e) {
            console.warn('Metadata fetch error', e);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        if (!url) return;

        let reminderTimeStr = null;
        if (reminderPreset) {
            const now = new Date();
            if (reminderPreset === '1h') now.setHours(now.getHours() + 1);
            if (reminderPreset === 'tonight') now.setHours(20, 0, 0, 0); // 8 PM
            if (reminderPreset === 'tomorrow') { now.setDate(now.getDate() + 1); now.setHours(9, 0, 0, 0); }

            // If tonight is in past, set for tomorrow night? Simple logic for now.
            if (now.getTime() < Date.now()) now.setDate(now.getDate() + 1);

            reminderTimeStr = now.toISOString();
        }

        await saveVideo({
            url,
            title,
            thumbnailUrl,
            creator,
            platform,
            folderId: selectedFolderId || undefined,
            reminderTime: reminderTimeStr || undefined,
        });

        if (reminderTimeStr) {
            const diffSeconds = (new Date(reminderTimeStr).getTime() - Date.now()) / 1000;
            await scheduleReminder(
                "Time to watch!",
                `Watch your saved ${platform} video: ${title}`,
                Math.round(diffSeconds),
                { url }
            );
        }

        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Save Video</Text>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Link</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={url}
                        onChangeText={(t: string) => { setUrl(t); if (isValidLink(t)) fetchMetadata(t); }}
                        placeholder="Paste link here..."
                        placeholderTextColor={theme.colors.placeholder}
                    />
                    {loading && <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginLeft: 8 }} />}
                </View>

                {thumbnailUrl ? (
                    <View style={styles.previewContainer}>
                        <RNImage source={{ uri: thumbnailUrl }} style={styles.previewImage} />
                    </View>
                ) : null}

                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Video Title"
                    placeholderTextColor={theme.colors.placeholder}
                />

                <Text style={styles.label}>Folder</Text>
                <View style={styles.folderRow}>
                    <Pressable
                        style={[styles.chip, selectedFolderId === null && styles.chipSelected]}
                        onPress={() => setSelectedFolderId(null)}
                    >
                        <Text style={[styles.chipText, selectedFolderId === null && styles.chipTextSelected]}>None</Text>
                    </Pressable>
                    {folders.map((f: Folder) => (
                        <Pressable
                            key={f.id}
                            style={[styles.chip, selectedFolderId === f.id && styles.chipSelected]}
                            onPress={() => setSelectedFolderId(f.id)}
                        >
                            <Text style={[styles.chipText, selectedFolderId === f.id && styles.chipTextSelected]}>{f.name}</Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.label}>Remind me</Text>
                <View style={styles.folderRow}>
                    {[
                        { id: '1h', label: 'In 1 hr' },
                        { id: 'tonight', label: 'Tonight' },
                        { id: 'tomorrow', label: 'Tomorrow' },
                    ].map(p => (
                        <Pressable
                            key={p.id}
                            style={[styles.chip, reminderPreset === p.id && styles.chipSelected]}
                            onPress={() => setReminderPreset(reminderPreset === p.id ? null : p.id)}
                        >
                            <Text style={[styles.chipText, reminderPreset === p.id && styles.chipTextSelected]}>{p.label}</Text>
                        </Pressable>
                    ))}
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Pressable style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Save Video</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surfaceHighlight,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    content: {
        padding: theme.spacing.m,
    },
    label: {
        color: theme.colors.textSecondary,
        marginBottom: 8,
        marginTop: 16,
        fontSize: 14,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        paddingHorizontal: theme.spacing.s,
    },
    input: {
        flex: 1,
        color: theme.colors.textPrimary,
        padding: 12,
        borderRadius: theme.borderRadius.m,
        backgroundColor: theme.colors.surface,
    },
    folderRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    chipSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    chipTextSelected: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    footer: {
        padding: theme.spacing.m,
        borderTopWidth: 1,
        borderTopColor: theme.colors.surfaceHighlight,
    },
    saveBtn: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    previewContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: theme.borderRadius.m,
        backgroundColor: theme.colors.surface,
    }
});
