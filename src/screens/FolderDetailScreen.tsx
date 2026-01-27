import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { VideoCard } from '../components/VideoCard';
import { theme } from '../constants/theme';
import { Video } from '../types';
import { getVideos, deleteVideo } from '../services/db';
import { Ionicons } from '@expo/vector-icons';

export const FolderDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { folder } = (route.params as any) || {};
    const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
        if (folder) loadVideos();
    }, [folder]);

    const loadVideos = async () => {
        const data = await getVideos(folder.id);
        setVideos(data);
    };

    const handleDelete = async (id: number) => {
        await deleteVideo(id);
        loadVideos();
    };

    if (!folder) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                </Pressable>
                <Text style={styles.title}>{folder.name}</Text>
            </View>

            <FlatList
                data={videos}
                keyExtractor={(item: Video) => item.id.toString()}
                renderItem={({ item }: { item: Video }) => (
                    <VideoCard
                        video={item}
                        onPress={() => { }}
                        onDelete={() => handleDelete(item.id)}
                    />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No videos in this folder</Text>
                    </View>
                }
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
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    list: {
        paddingBottom: theme.spacing.xl,
    },
    empty: {
        marginTop: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.textSecondary,
    }
});
