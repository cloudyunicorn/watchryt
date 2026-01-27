import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Linking, Modal, TouchableWithoutFeedback } from 'react-native';
import { Video, Platform } from '../types';
import { theme } from '../constants/theme';
// Icons could be from @expo/vector-icons, assuming standard Expo setup includes them or we use text for now
import { Ionicons, FontAwesome } from '@expo/vector-icons';

interface Props {
    video: Video;
    onPress: () => void;
    onDelete: () => void;
}

const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
        case Platform.Instagram: return 'instagram';
        case Platform.TikTok: return 'music'; // FontAwesome doesn't have tiktok in older versions, using music or similar
        case Platform.YouTube: return 'youtube-play';
        case Platform.Facebook: return 'facebook';
        default: return 'link';
    }
};

const getPlatformColor = (platform: Platform) => {
    switch (platform) {
        case Platform.Instagram: return theme.colors.instagram;
        case Platform.TikTok: return theme.colors.tiktok;
        case Platform.YouTube: return theme.colors.youtube;
        case Platform.Facebook: return theme.colors.facebook;
        default: return theme.colors.textSecondary;
    }
}

export const VideoCard = ({ video, onPress, onDelete }: Props) => {
    const [previewVisible, setPreviewVisible] = React.useState(false);

    const handleOpen = async () => {
        try {
            await Linking.openURL(video.url);
        } catch (e) {
            console.warn('Cannot open URL', e);
        }
    };

    return (
        <Pressable
            style={styles.card}
            onPress={handleOpen}
            onLongPress={() => setPreviewVisible(true)}
        >
            <Modal
                visible={previewVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setPreviewVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setPreviewVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.previewContainer}>
                            {video.thumbnailUrl ? (
                                <Image
                                    source={{ uri: video.thumbnailUrl }}
                                    style={styles.enlargedThumbnail}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View style={[styles.enlargedThumbnail, styles.placeholderEnlarged]}>
                                    <FontAwesome name="play-circle" size={80} color={theme.colors.textSecondary} />
                                </View>
                            )}
                            <Text style={styles.previewTitle} numberOfLines={2}>{video.title}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <View style={styles.thumbnailContainer}>
                {video.thumbnailUrl ? (
                    <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
                ) : (
                    <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
                        <FontAwesome name="play-circle" size={32} color={theme.colors.textSecondary} />
                    </View>
                )}
                <View style={styles.platformBadge}>
                    <FontAwesome name={getPlatformIcon(video.platform)} size={12} color="#FFF" />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
                {video.creator ? <Text style={styles.creator}>{video.creator}</Text> : null}

                {video.reminderTime && (
                    <View style={styles.reminderContainer}>
                        <Ionicons name="alarm-outline" size={14} color={theme.colors.primary} />
                        <Text style={styles.reminderText}>
                            {new Date(video.reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                )}
            </View>

            <Pressable onPress={onDelete} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color={theme.colors.textSecondary} />
            </Pressable>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
        flexDirection: 'row',
        padding: theme.spacing.s,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    thumbnailContainer: {
        position: 'relative',
    },
    thumbnail: {
        width: 80,
        height: 100,
        borderRadius: theme.borderRadius.s,
        backgroundColor: theme.colors.surfaceHighlight,
    },
    placeholderThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    platformBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 4,
        borderRadius: 4,
    },
    content: {
        flex: 1,
        marginLeft: theme.spacing.m,
        justifyContent: 'center',
    },
    title: {
        color: theme.colors.textPrimary,
        fontSize: theme.typography.body.fontSize,
        fontWeight: '600',
        marginBottom: 4,
    },
    creator: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.caption.fontSize,
    },
    reminderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    reminderText: {
        color: theme.colors.primary,
        fontSize: 12,
        marginLeft: 4,
    },
    deleteBtn: {
        padding: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    previewContainer: {
        width: '90%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        overflow: 'hidden',
        alignItems: 'center',
        paddingBottom: 20,
    },
    enlargedThumbnail: {
        width: '100%',
        height: 400,
        backgroundColor: '#000',
    },
    placeholderEnlarged: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewTitle: {
        color: theme.colors.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        textAlign: 'center',
        paddingHorizontal: 15,
    }
});
