import { Platform } from '../types';

export const detectPlatform = (url: string): Platform => {
    if (url.includes('instagram.com')) return Platform.Instagram;
    if (url.includes('tiktok.com')) return Platform.TikTok;
    if (url.includes('youtube.com') || url.includes('youtu.be')) return Platform.YouTube;
    if (url.includes('facebook.com') || url.includes('fb.watch')) return Platform.Facebook;
    return Platform.Unknown;
};

export const getVideoMetadata = async (url: string) => {
    const platform = detectPlatform(url);
    let title = '';
    let creator = '';
    let thumbnailUrl = '';

    console.log('Fetching metadata for:', url);

    try {
        const response = await fetch(`https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        console.log('Metadata API response:', data);

        if (data) {
            // Attempt to get the best title
            const rawTitle = (data.title || '').trim();
            const rawDesc = (data.description || '').trim();

            // List of generic names to ignore
            const genericNames = [
                'Instagram', 'Instagram Reel', 'Instagram Video', 'Reel',
                'TikTok', 'TikTok Video', 'YouTube', 'YouTube Short', 'Facebook', 'Video'
            ];

            const isGeneric = !rawTitle || genericNames.some(n => rawTitle.toLowerCase() === n.toLowerCase());

            if (isGeneric && rawDesc) {
                title = rawDesc;
            } else {
                title = rawTitle;
            }

            creator = data.provider_name || data.author || '';
            if (data.images && data.images.length > 0) {
                thumbnailUrl = data.images[0];
            } else if (data.image) {
                thumbnailUrl = data.image;
            }
        }
    } catch (e) {
        console.warn('Metadata Proxy call failed:', e);
    }

    // 2. Fail-safe Patterns / Heuristics
    const finalTitle = title.trim();
    const isTitleMissing = !finalTitle || finalTitle.toLowerCase() === 'instagram' || finalTitle.toLowerCase() === 'tiktok';

    if (!thumbnailUrl || isTitleMissing) {
        if (platform === Platform.YouTube) {
            const match = url.match(/(?:shorts\/|v=|be\/|v\/|embed\/|watch\?v=)([^&?/\s]+)/);
            if (match && match[1]) {
                if (!thumbnailUrl) thumbnailUrl = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
                if (isTitleMissing) title = 'YouTube Short';
            }
        } else if (platform === Platform.Instagram) {
            const match = url.match(/(?:\/p\/|\/reels\/|\/reel\/)([^/?#&\s]+)/);
            if (match && match[1]) {
                if (!thumbnailUrl) thumbnailUrl = `https://www.instagram.com/p/${match[1]}/media/?size=l`;
                if (isTitleMissing) title = 'Instagram Reel';
            }
        } else if (platform === Platform.TikTok) {
            if (isTitleMissing) title = 'TikTok Video';
        }
    }

    // Final fallback
    const resolvedTitle = title.trim() || 'Saved Video';
    console.log('Final metadata resolved:', { resolvedTitle, thumbnailUrl, platform });

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
