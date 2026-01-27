import * as SQLite from 'expo-sqlite';
import { Platform, Video, Folder } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
    if (db) return;

    db = await SQLite.openDatabaseAsync('watchryt.db');

    // Enable foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Create tables
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      title TEXT,
      creator TEXT,
      thumbnail_url TEXT,
      platform TEXT NOT NULL,
      folder_id INTEGER,
      reminder_time TEXT,
      is_watched INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (folder_id) REFERENCES folders (id) ON DELETE SET NULL
    );
  `);

    // Seed default folders if empty
    const folderCountDetails = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM folders');
    if (folderCountDetails && folderCountDetails.count === 0) {
        await db.runAsync('INSERT INTO folders (name) VALUES (?), (?), (?), (?)', 'Fitness', 'Recipes', 'Funny', 'Travel');
    }
};

export const getFolders = async (): Promise<Folder[]> => {
    if (!db) await initDatabase();
    const folders = await db!.getAllAsync<any>('SELECT * FROM folders ORDER BY created_at ASC');

    // Get video counts (optional optimization: separate query or join)
    const result: Folder[] = [];
    for (const f of folders) {
        const countRes = await db!.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM videos WHERE folder_id = ?', f.id);
        result.push({
            id: f.id,
            name: f.name,
            icon: f.icon,
            createdAt: f.created_at,
            videoCount: countRes?.count || 0
        });
    }
    return result;
};

export const createFolder = async (name: string) => {
    if (!db) await initDatabase();
    await db!.runAsync('INSERT INTO folders (name) VALUES (?)', name);
};

export const getVideos = async (folderId?: number): Promise<Video[]> => {
    if (!db) await initDatabase();

    let query = 'SELECT * FROM videos';
    let params: any[] = [];

    if (folderId !== undefined) {
        query += ' WHERE folder_id = ?';
        params.push(folderId);
    }

    query += ' ORDER BY created_at DESC';

    const videos = await db!.getAllAsync<any>(query, params);

    return videos.map((v: any) => ({
        id: v.id,
        url: v.url,
        title: v.title,
        creator: v.creator,
        thumbnailUrl: v.thumbnail_url,
        platform: v.platform as Platform,
        folderId: v.folder_id,
        reminderTime: v.reminder_time,
        isWatched: !!v.is_watched,
        createdAt: v.created_at
    }));
};

export const saveVideo = async (video: Partial<Video>) => {
    if (!db) await initDatabase();
    const { url, title, creator, thumbnailUrl, platform, folderId, reminderTime } = video;

    await db!.runAsync(
        `INSERT INTO videos (url, title, creator, thumbnail_url, platform, folder_id, reminder_time) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        url || '',
        title || 'Untitled',
        creator || '',
        thumbnailUrl || '',
        platform || 'Unknown',
        folderId || null,
        reminderTime || null
    );
};

export const deleteVideo = async (id: number) => {
    if (!db) await initDatabase();
    await db!.runAsync('DELETE FROM videos WHERE id = ?', id);
};

export const markAsWatched = async (id: number, watched: boolean) => {
    if (!db) await initDatabase();
    await db!.runAsync('UPDATE videos SET is_watched = ? WHERE id = ?', watched ? 1 : 0, id);
};
