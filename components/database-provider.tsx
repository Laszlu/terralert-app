import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('terralert.db');

export async function initDb() {
    await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      link TEXT,
      closed TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      title TEXT
    );

    CREATE TABLE IF NOT EXISTS event_categories (
      event_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      PRIMARY KEY (event_id, category_id)
    );

    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      url TEXT
    );

    CREATE TABLE IF NOT EXISTS event_sources (
      event_id TEXT NOT NULL,
      source_id TEXT NOT NULL,
      PRIMARY KEY (event_id, source_id)
    );

    CREATE TABLE IF NOT EXISTS geometry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL,
      magnitude_value REAL,
      magnitude_unit TEXT,
      date TEXT NOT NULL,
      type TEXT
    );

    CREATE TABLE IF NOT EXISTS geometry_coordinates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      geometry_id INTEGER NOT NULL,
      coord_type TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      position INTEGER,
      ring INTEGER
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

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        initDb()
            .then(() => {
                if (!cancelled) setReady(true);
            })
            .catch(err => {
                console.error('DB init failed', err);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    if (!ready) {
        return null; // or SplashScreen
    }

    return <>{children}</>;
}
