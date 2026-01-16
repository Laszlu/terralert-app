import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import {CURRENT_DB_VERSION} from "@/constants/constants";

export const db = SQLite.openDatabaseSync('terralert.db');

export async function initDb() {
    await db.execAsync(`
    PRAGMA foreign_keys = ON;
    
    CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        title TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL,
        title TEXT,
        description TEXT,
        link TEXT,
        closed TEXT,
        FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS sources (
        event_id TEXT NOT NULL,
        id TEXT NOT NULL,
        url TEXT,
        PRIMARY KEY (event_id, id),
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS geometry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL,
        magnitude_value REAL,
        magnitude_unit TEXT,
        date TEXT NOT NULL,
        type TEXT,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS geometry_coordinates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        geometry_id INTEGER NOT NULL,
        coord_type TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        position INTEGER,
        ring INTEGER,
        FOREIGN KEY (geometry_id) REFERENCES geometry(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS sync_status (
        region TEXT NOT NULL,
        year INTEGER NOT NULL,
        category_id TEXT NOT NULL,
        last_synced TEXT,           -- ISO string of last sync time
        PRIMARY KEY (region, year, category_id)
    );

    CREATE INDEX IF NOT EXISTS idx_geometry_event_id ON geometry(event_id);
    CREATE INDEX IF NOT EXISTS idx_geometry_date ON geometry(date);
  `);
}

async function ensureDbVersion() {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS meta (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    `);

    const rows = await db.getAllAsync<{ value: string }>(
        `SELECT value FROM meta WHERE key = 'db_version'`
    );

    const storedVersion = rows.length ? Number(rows[0].value) : 0;

    if (storedVersion !== CURRENT_DB_VERSION) {
        console.warn(
            `DB version mismatch (${storedVersion} → ${CURRENT_DB_VERSION}), resetting DB`
        );

        await resetDatabase();

        await db.runAsync(
            `INSERT OR REPLACE INTO meta (key, value)
       VALUES ('db_version', ?)`,
            [CURRENT_DB_VERSION.toString()]
        );
    } else {
        console.log('DB version correct, proceeding with init/sync')
    }
}

async function resetDatabase() {
    await db.execAsync(`
    DROP TABLE IF EXISTS geometry_coordinates;
    DROP TABLE IF EXISTS geometry;
    DROP TABLE IF EXISTS sources;
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS sync_status;
  `);
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                await ensureDbVersion();

                await initDb();

                if (!cancelled) {
                    setReady(true);
                }
            } catch (err) {
                console.error('DB init failed', err);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    if (!ready) {
        return null; // or SplashScreen
    }

    return <>{children}</>;
}
