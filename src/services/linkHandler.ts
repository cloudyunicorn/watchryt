import { Platform } from '../types';

export const detectPlatform = (url: string): Platform => {
    if (url.includes('instagram.com')) return Platform.Instagram;
    if (url.includes('tiktok.com')) return Platform.TikTok;
    if (url.includes('youtube.com') || url.includes('youtu.be')) return Platform.YouTube;
    if (url.includes('facebook.com') || url.includes('fb.watch')) return Platform.Facebook;
    return Platform.Unknown;
};

// Extract username from Instagram URL
const extractInstagramUsername = (url: string): string | null => {
    // Match patterns like instagram.com/username/reel/... or instagram.com/reel/CODE (shared links)
    const userMatch = url.match(/instagram\.com\/([^/?#]+)\/(?:reel|p|reels)\//i);
    if (userMatch && userMatch[1] && !['reel', 'reels', 'p', 'stories'].includes(userMatch[1].toLowerCase())) {
        return userMatch[1];
    }
    return null;
};

// Extract username from TikTok URL
const extractTikTokUsername = (url: string): string | null => {
    const match = url.match(/tiktok\.com\/@([^/?#]+)/i);
    if (match && match[1]) {
        return match[1];
    }
    return null;
};

// Extract YouTube video ID
const extractYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:shorts\/|v=|be\/|v\/|embed\/|watch\?v=)([^&?/\s]+)/);
    return match ? match[1] : null;
};

// Parse Instagram description to extract clean caption
// Input: "244K likes, 2,485 comments - aryansh_bajaj on January 26, 2026: "Don't Miss End🤑"."
// Output: { caption: "Don't Miss End🤑", likes: "244K", comments: "2,485", date: "January 26, 2026", username: "aryansh_bajaj" }
const parseInstagramDescription = (description: string): { caption?: string; likes?: string; comments?: string; date?: string; username?: string } => {
    if (!description) return {};

    console.log('[Parser] Input description:', description);

    // Try to extract the quoted caption - handle both regular and smart quotes
    // Pattern: ": "caption"." at the end
    const captionMatch = description.match(/:\s*[""\u201C\u201D]([^""\u201C\u201D]+)[""\u201C\u201D]\.?$/);
    const caption = captionMatch ? captionMatch[1].trim() : undefined;

    console.log('[Parser] Caption match result:', caption);

    // Extract likes count
    const likesMatch = description.match(/^([\d,.]+[KMB]?)\s*likes?/i);
    const likes = likesMatch ? likesMatch[1] : undefined;

    // Extract comments count
    const commentsMatch = description.match(/([\d,.]+[KMB]?)\s*comments?/i);
    const comments = commentsMatch ? commentsMatch[1] : undefined;

    // Extract username and date: "username on Month Day, Year:"
    const userDateMatch = description.match(/-\s*(\w+)\s+on\s+([^:]+):/i);
    const username = userDateMatch ? userDateMatch[1] : undefined;
    const date = userDateMatch ? userDateMatch[2].trim() : undefined;

    return { caption, likes, comments, date, username };
};

// Fetch from noembed.com (works well for YouTube and sometimes Instagram)
const fetchFromNoembed = async (url: string): Promise<{ title?: string; author?: string; thumbnail?: string }> => {
    try {
        console.log('[Noembed] Fetching:', url);
        const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        console.log('[Noembed] Response:', JSON.stringify(data));

        if (data && !data.error) {
            return {
                title: data.title || undefined,
                author: data.author_name || undefined,
                thumbnail: data.thumbnail_url || undefined,
            };
        }
    } catch (e) {
        console.warn('[Noembed] Fetch failed:', e);
    }
    return {};
};

// Fetch from YouTube's official oEmbed API
const fetchFromYouTubeOembed = async (url: string): Promise<{ title?: string; author?: string; thumbnail?: string }> => {
    try {
        console.log('[YouTube oEmbed] Fetching:', url);
        const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        const data = await response.json();
        console.log('[YouTube oEmbed] Response:', JSON.stringify(data));

        if (data) {
            return {
                title: data.title || undefined,
                author: data.author_name || undefined,
                thumbnail: data.thumbnail_url || undefined,
            };
        }
    } catch (e) {
        console.warn('[YouTube oEmbed] Fetch failed:', e);
    }
    return {};
};

// Fetch from jsonlink.io (general fallback)
const fetchFromJsonLink = async (url: string): Promise<{ title?: string; description?: string; author?: string; thumbnail?: string }> => {
    try {
        console.log('[JsonLink] Fetching:', url);
        const response = await fetch(`https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        console.log('[JsonLink] Response:', JSON.stringify(data));

        if (data) {
            let thumbnail = '';
            if (data.images && data.images.length > 0) {
                thumbnail = data.images[0];
            } else if (data.image) {
                thumbnail = data.image;
            }

            return {
                title: data.title || undefined,
                description: data.description || undefined,
                author: data.provider_name || data.author || undefined,
                thumbnail,
            };
        }
    } catch (e) {
        console.warn('[JsonLink] Fetch failed:', e);
    }
    return {};
};

// Fetch from microlink.io (another fallback that's good for social media)
const fetchFromMicrolink = async (url: string): Promise<{ title?: string; description?: string; author?: string; thumbnail?: string }> => {
    try {
        console.log('[Microlink] Fetching:', url);
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
        const json = await response.json();
        console.log('[Microlink] Response:', JSON.stringify(json));

        if (json.status === 'success' && json.data) {
            const data = json.data;
            return {
                title: data.title || undefined,
                description: data.description || undefined,
                author: data.author || data.publisher || undefined,
                thumbnail: data.image?.url || data.logo?.url || undefined,
            };
        }
    } catch (e) {
        console.warn('[Microlink] Fetch failed:', e);
    }
    return {};
};

// List of generic names to ignore
const GENERIC_NAMES = [
    'instagram', 'instagram reel', 'instagram video', 'reel', 'reels',
    'tiktok', 'tiktok video', 'tiktok - make your day',
    'youtube', 'youtube short', 'youtube shorts', 'shorts',
    'facebook', 'video', 'watch'
];

const isGenericTitle = (title: string): boolean => {
    if (!title) return true;
    const normalized = title.toLowerCase().trim();
    return GENERIC_NAMES.some(n => normalized === n || normalized.startsWith(n + ' -'));
};

export const getVideoMetadata = async (url: string) => {
    const platform = detectPlatform(url);
    let title = '';
    let creator = '';
    let thumbnailUrl = '';

    console.log('Fetching metadata for:', url);

    // Try multiple sources based on platform
    if (platform === Platform.YouTube) {
        // YouTube: Try official oEmbed first, then noembed
        const youtubeData = await fetchFromYouTubeOembed(url);
        if (youtubeData.title) title = youtubeData.title;
        if (youtubeData.author) creator = youtubeData.author;
        if (youtubeData.thumbnail) thumbnailUrl = youtubeData.thumbnail;

        // Fallback to noembed if needed
        if (!title || isGenericTitle(title)) {
            const noembedData = await fetchFromNoembed(url);
            if (noembedData.title && !isGenericTitle(noembedData.title)) title = noembedData.title;
            if (!creator && noembedData.author) creator = noembedData.author;
            if (!thumbnailUrl && noembedData.thumbnail) thumbnailUrl = noembedData.thumbnail;
        }
    } else {
        // Instagram/TikTok/Facebook: Try noembed first, then jsonlink
        const noembedData = await fetchFromNoembed(url);
        if (noembedData.title && !isGenericTitle(noembedData.title)) title = noembedData.title;
        if (noembedData.author) creator = noembedData.author;
        if (noembedData.thumbnail) thumbnailUrl = noembedData.thumbnail;

        // Fallback to jsonlink
        if (!title || isGenericTitle(title) || !thumbnailUrl) {
            const jsonLinkData = await fetchFromJsonLink(url);

            // Prefer description over generic title for Instagram/TikTok
            if (!title || isGenericTitle(title)) {
                if (jsonLinkData.description && !isGenericTitle(jsonLinkData.description)) {
                    title = jsonLinkData.description;
                } else if (jsonLinkData.title && !isGenericTitle(jsonLinkData.title)) {
                    title = jsonLinkData.title;
                }
            }

            if (!creator && jsonLinkData.author) creator = jsonLinkData.author;
            if (!thumbnailUrl && jsonLinkData.thumbnail) thumbnailUrl = jsonLinkData.thumbnail;
        }

        // Additional fallback to Microlink (good for social media)
        if (!title || isGenericTitle(title) || !thumbnailUrl || !creator) {
            const microlinkData = await fetchFromMicrolink(url);

            // For Instagram, parse the description to extract clean caption
            if (platform === Platform.Instagram && microlinkData.description) {
                const parsed = parseInstagramDescription(microlinkData.description);
                console.log('[Microlink] Parsed Instagram:', JSON.stringify(parsed));

                if (parsed.caption && !isGenericTitle(parsed.caption)) {
                    title = parsed.caption;
                } else if (!title || isGenericTitle(title)) {
                    // Fallback: use raw description if caption parsing failed
                    title = microlinkData.description;
                }
                if (!creator && parsed.username) {
                    creator = `@${parsed.username}`;
                }
            } else {
                // For other platforms, use description as title if available
                if (!title || isGenericTitle(title)) {
                    if (microlinkData.description && !isGenericTitle(microlinkData.description)) {
                        title = microlinkData.description;
                    } else if (microlinkData.title && !isGenericTitle(microlinkData.title)) {
                        title = microlinkData.title;
                    }
                }
            }

            if (!creator && microlinkData.author) creator = microlinkData.author;
            if (!thumbnailUrl && microlinkData.thumbnail) thumbnailUrl = microlinkData.thumbnail;
        }
    }

    // Platform-specific fallbacks and heuristics
    if (platform === Platform.YouTube) {
        const videoId = extractYouTubeVideoId(url);
        if (videoId) {
            if (!thumbnailUrl) thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            if (isGenericTitle(title)) title = 'YouTube Short';
        }
    } else if (platform === Platform.Instagram) {
        const username = extractInstagramUsername(url);
        if (username) {
            if (!creator) creator = `@${username}`;
            if (isGenericTitle(title)) title = `Reel by @${username}`;
        } else if (isGenericTitle(title)) {
            title = 'Instagram Reel';
        }
        // Try Instagram media endpoint for thumbnail
        const reelMatch = url.match(/(?:\/p\/|\/reels\/|\/reel\/)([^/?#&\s]+)/);
        if (reelMatch && reelMatch[1] && !thumbnailUrl) {
            thumbnailUrl = `https://www.instagram.com/p/${reelMatch[1]}/media/?size=l`;
        }
    } else if (platform === Platform.TikTok) {
        const username = extractTikTokUsername(url);
        if (username) {
            if (!creator) creator = `@${username}`;
            if (isGenericTitle(title)) title = `TikTok by @${username}`;
        } else if (isGenericTitle(title)) {
            title = 'TikTok Video';
        }
    }

    // Final fallback
    const resolvedTitle = title.trim() || 'Saved Video';
    console.log('Final metadata resolved:', { resolvedTitle, creator, thumbnailUrl, platform });

    return {
        title: resolvedTitle,
        creator,
        thumbnailUrl,
        platform
    };
};

export const isValidLink = (url: string): boolean => {
    return detectPlatform(url) !== Platform.Unknown;
}
