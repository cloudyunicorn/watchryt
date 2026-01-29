import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Linking, Modal, TouchableWithoutFeedback } from 'react-native';
import { Video, Platform } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

interface Props {
    video: Video;
    onPress: () => void;
    onDelete: () => void;
}

const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
        case Platform.Instagram: return 'instagram';
        case Platform.TikTok: return 'music';
        case Platform.YouTube: return 'youtube-play';
        case Platform.Facebook: return 'facebook';
        default: return 'link';
    }
};

export const VideoCard = ({ video, onPress, onDelete }: Props) => {
    const { colors, borderRadius, spacing, typography } = useTheme();
    const [previewVisible, setPreviewVisible] = React.useState(false);

    const handleOpen = async () => {
        try {
            await Linking.openURL(video.url);
        } catch (e) {
            console.warn('Cannot open URL', e);
        }
    };

    const styles = StyleSheet.create({
        card: {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.m,
            marginBottom: spacing.m,
            flexDirection: 'row',
            padding: spacing.s,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.surfaceHighlight,
        },
        thumbnailContainer: {
            position: 'relative',
        },
        thumbnail: {
            width: 80,
            height: 100,
            borderRadius: borderRadius.s,
            backgroundColor: colors.surfaceHighlight,
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
            marginLeft: spacing.m,
            justifyContent: 'center',
        },
        title: {
            color: colors.textPrimary,
            fontSize: typography.body.fontSize,
            fontWeight: '600',
            marginBottom: 4,
        },
        creator: {
            color: colors.textSecondary,
            fontSize: typography.caption.fontSize,
            fontWeight: '600',
        },
        creatorRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
            gap: 8,
        },
        platformTag: {
            backgroundColor: colors.surfaceHighlight,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
        },
        platformTagText: {
            color: colors.textSecondary,
            fontSize: 10,
            fontWeight: '600',
            textTransform: 'uppercase',
        },
        reminderContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 8,
        },
        reminderText: {
            color: colors.primary,
            fontSize: 11,
            marginLeft: 3,
        },
        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
        },
        dateText: {
            color: colors.textSecondary,
            fontSize: 11,
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
            backgroundColor: colors.surface,
            borderRadius: borderRadius.l,
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
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: 15,
            textAlign: 'center',
            paddingHorizontal: 15,
        }
    });

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
                                    <FontAwesome name="play-circle" size={80} color={colors.textSecondary} />
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
                        <FontAwesome name="play-circle" size={32} color={colors.textSecondary} />
                    </View>
                )}
                <View style={styles.platformBadge}>
                    <FontAwesome name={getPlatformIcon(video.platform)} size={12} color="#FFF" />
                </View>
            </View>

            <View style={styles.content}>
                {/* Creator/Username at top */}
                {video.creator ? (
                    <View style={styles.creatorRow}>
                        <Text style={styles.creator}>{video.creator}</Text>
                        <View style={styles.platformTag}>
                            <Text style={styles.platformTagText}>{video.platform}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.platformTag}>
                        <Text style={styles.platformTagText}>{video.platform}</Text>
                    </View>
                )}

                {/* Title/Caption */}
                <Text style={styles.title} numberOfLines={2}>{video.title}</Text>

                {/* Bottom row with date and reminder */}
                <View style={styles.metaRow}>
                    <Text style={styles.dateText}>
                        {new Date(video.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </Text>

                    {video.reminderTime && (
                        <View style={styles.reminderContainer}>
                            <Ionicons name="alarm-outline" size={12} color={colors.primary} />
                            <Text style={styles.reminderText}>
                                {new Date(video.reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <Pressable onPress={onDelete} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
            </Pressable>
        </Pressable>
    );
};
