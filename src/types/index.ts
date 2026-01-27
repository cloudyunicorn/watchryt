export enum Platform {
    Instagram = 'Instagram',
    TikTok = 'TikTok',
    YouTube = 'YouTube',
    Facebook = 'Facebook',
    Unknown = 'Unknown'
}

export interface Folder {
    id: number;
    name: string;
    icon?: string;
    createdAt: string;
    videoCount?: number; // Computed
}

export interface Video {
    id: number;
    url: string;
    title: string;
    creator?: string;
    thumbnailUrl?: string;
    platform: Platform;
    folderId?: number; // Nullable if 'All' or user didn't select
    reminderTime?: string; // ISO date string
    isWatched: boolean;
    createdAt: string;
}

export type RootStackParamList = {
    Main: undefined;
    AddVideo: { url?: string };
};

export type MainTabParamList = {
    Home: undefined;
    Folders: undefined;
    Settings: undefined;
};
