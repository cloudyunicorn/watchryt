import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VideoCard } from '../components/VideoCard';
import { useTheme } from '../context/ThemeContext';
import { Video } from '../types';
import { getVideos, deleteVideo } from '../services/db';
import { Ionicons } from '@expo/vector-icons';

type FilterType = 'All' | 'Today' | 'Earlier';

export const HomeScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
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

    const isToday = (date: Date) => {
        const now = new Date();
        return date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
    };

    const getFilteredVideos = () => {
        return videos.filter((v: Video) => {
            if (filter === 'All') return true;

            const saveDate = new Date(v.createdAt);

            if (filter === 'Today') return isToday(saveDate);
            if (filter === 'Earlier') return !isToday(saveDate);

            return true;
        });
    };

    const getFilterCount = (filterType: FilterType) => {
        if (filterType === 'All') return videos.length;

        return videos.filter((v: Video) => {
            const saveDate = new Date(v.createdAt);
            if (filterType === 'Today') return isToday(saveDate);
            if (filterType === 'Earlier') return !isToday(saveDate);
            return false;
        }).length;
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingHorizontal: 20,
            marginBottom: 24,
        },
        greeting: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 4,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        statsContainer: {
            alignItems: 'flex-end',
        },
        statBadge: {
            backgroundColor: colors.surfaceHighlight,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
            alignItems: 'center',
        },
        statNumber: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.primary,
        },
        statLabel: {
            fontSize: 11,
            color: colors.textSecondary,
            marginTop: 2,
        },
        tabs: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginBottom: 20,
            gap: 12,
        },
        tab: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 24,
            backgroundColor: colors.surface,
            gap: 8,
        },
        tabActive: {
            backgroundColor: colors.primary,
        },
        tabText: {
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: '600',
        },
        tabTextActive: {
            color: '#FFF',
        },
        tabBadge: {
            backgroundColor: colors.surfaceHighlight,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 10,
            minWidth: 24,
            alignItems: 'center',
        },
        tabBadgeActive: {
            backgroundColor: 'rgba(255,255,255,0.2)',
        },
        tabBadgeText: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.textSecondary,
        },
        tabBadgeTextActive: {
            color: '#FFF',
        },
        list: {
            paddingHorizontal: 20,
            paddingBottom: 100,
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
        fab: {
            position: 'absolute',
            bottom: 24,
            right: 20,
            backgroundColor: colors.primary,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
        },
        fabPressed: {
            transform: [{ scale: 0.95 }],
            opacity: 0.9,
        },
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back</Text>
                    <Text style={styles.title}>WatchRyt</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statBadge}>
                        <Text style={styles.statNumber}>{videos.length}</Text>
                        <Text style={styles.statLabel}>Saved</Text>
                    </View>
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabs}>
                {(['All', 'Today', 'Earlier'] as FilterType[]).map(t => (
                    <Pressable
                        key={t}
                        style={[styles.tab, filter === t && styles.tabActive]}
                        onPress={() => setFilter(t)}
                    >
                        <Text style={[styles.tabText, filter === t && styles.tabTextActive]}>
                            {t}
                        </Text>
                        <View style={[styles.tabBadge, filter === t && styles.tabBadgeActive]}>
                            <Text style={[styles.tabBadgeText, filter === t && styles.tabBadgeTextActive]}>
                                {getFilterCount(t)}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </View>

            {/* Video List */}
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
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="videocam-outline" size={64} color={colors.textSecondary} />
                        <Text style={styles.emptyTitle}>No videos yet</Text>
                        <Text style={styles.emptyText}>
                            {filter === 'Today'
                                ? "You haven't saved any videos today"
                                : filter === 'Earlier'
                                    ? "No videos from earlier days"
                                    : "Tap + to save your first video"}
                        </Text>
                    </View>
                }
            />

            {/* FAB */}
            <Pressable
                onPress={() => (navigation as any).navigate('AddVideo')}
                style={({ pressed }) => [
                    styles.fab,
                    pressed && styles.fabPressed
                ]}
            >
                <Ionicons name="add" size={28} color="#FFF" />
            </Pressable>
        </View>
    );
};
