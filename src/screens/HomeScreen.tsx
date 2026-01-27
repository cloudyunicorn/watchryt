import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { VideoCard } from '../components/VideoCard';
import { theme } from '../constants/theme';
import { Video } from '../types';
import { getVideos, deleteVideo } from '../services/db';
import { Ionicons } from '@expo/vector-icons';

type FilterType = 'All' | 'Today' | 'Upcoming';

export const HomeScreen = () => {
    const navigation = useNavigation();
    const [videos, setVideos] = useState<Video[]>([]);
    const [filter, setFilter] = useState<FilterType>('All');

    const loadVideos = async () => {
        const allVideos = await getVideos();
        setVideos(allVideos);
    };

    useFocusEffect(
        useCallback(() => {
            loadVideos();
        }, [])
    );

    const handleDelete = async (id: number) => {
        await deleteVideo(id);
        loadVideos();
    };

    const getFilteredVideos = () => {
        return videos.filter((v: Video) => {
            if (filter === 'All') return true;
            if (!v.reminderTime) return false;

            const reminderDate = new Date(v.reminderTime);
            const now = new Date();
            const isToday = reminderDate.getDate() === now.getDate() &&
                reminderDate.getMonth() === now.getMonth() &&
                reminderDate.getFullYear() === now.getFullYear();

            if (filter === 'Today') return isToday;
            if (filter === 'Upcoming') return reminderDate > now;

            return true;
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>WatchRyt</Text>
            </View>

            <View style={styles.tabs}>
                {(['All', 'Today', 'Upcoming'] as FilterType[]).map(t => (
                    <Pressable
                        key={t}
                        style={[styles.tab, filter === t && styles.tabActive]}
                        onPress={() => setFilter(t)}
                    >
                        <Text style={[styles.tabText, filter === t && styles.tabTextActive]}>{t}</Text>
                    </Pressable>
                ))}
            </View>

            <FlatList
                data={getFilteredVideos()}
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
                        <Text style={styles.emptyText}>No videos found</Text>
                    </View>
                }
            />

            <Pressable
                onPress={() => (navigation as any).navigate('AddVideo')}
                style={styles.fab}
            >
                <Ionicons name="add" size={32} color="#FFF" />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: theme.spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        marginBottom: theme.spacing.m,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: theme.colors.primary,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.m,
        marginBottom: theme.spacing.m,
    },
    tab: {
        marginRight: theme.spacing.m,
        paddingBottom: 4,
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
    tabTextActive: {
        color: theme.colors.textPrimary,
    },
    list: {
        paddingHorizontal: theme.spacing.m,
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
