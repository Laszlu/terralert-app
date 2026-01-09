import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {syncEventsFromBackend} from "@/services/event-sync-service";
import {getRegionsForCategory} from "@/helper/terralert-region-helper";
import {getApiVersion} from "@/api/terralert-client";
import {db} from "@/components/database-provider";
import {checkIfDbIsEmpty} from "@/repositories/event-repository";

interface StartupSyncContextType {
    isOnline: boolean;
    ready: boolean;
    lastSync: Date | null;
}

const StartupSyncContext = createContext<StartupSyncContextType>({
    isOnline: false,
    ready: false,
    lastSync: null,
});

export const useStartupSync = () => useContext(StartupSyncContext);

const SYNC_KEY = 'initial_events_sync_done';
const MS_PER_HOUR = 1000 * 60 * 60;
const POLL_INTERVAL = 3000; // Poll every 3 seconds

async function shouldSync() {
    const lastSyncStr = await AsyncStorage.getItem(SYNC_KEY);

    if (!lastSyncStr) {
        return true;
    }

    if (await checkIfDbIsEmpty()) {
        return true;
    }

    const lastSyncDate = new Date(lastSyncStr);
    const now = new Date();
    const diffMs = now.getTime() - lastSyncDate.getTime();
    return diffMs > 12 * MS_PER_HOUR;
}

export function StartupSyncProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const [isOnline, setIsOnline] = useState(false);

    const syncInProgressRef = useRef(false);

    // Load last sync date
    useEffect(() => {
        (async () => {
            const lastSyncStr = await AsyncStorage.getItem(SYNC_KEY);
            if (lastSyncStr) {
                setLastSync(new Date(lastSyncStr));
            }
            setReady(true);
        })();
    }, []);

    // Continuous polling for online state
    useEffect(() => {
        if (!ready) return;

        let cancelled = false;

        const checkOnlineState = async () => {
            if (cancelled) return;

            try {
                //console.log("checking online state...");
                await getApiVersion();
                //console.log("online: true");
                if (!cancelled) setIsOnline(true);
            } catch (error) {
                //console.log("online: false");
                if (!cancelled) setIsOnline(false);
            }
        };

        // Check immediately
        checkOnlineState();

        // Then poll continuously
        const interval = setInterval(checkOnlineState, POLL_INTERVAL);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [ready]);

    // Perform sync when conditions are met
    useEffect(() => {
        if (!ready) return;
        if (!isOnline) return;
        if (syncInProgressRef.current) return;

        (async () => {
            const needSync = await shouldSync();
            if (!needSync) return;

            try {
                syncInProgressRef.current = true;
                console.log("Starting sync...");
                await syncEventsFromBackend({ category: "st", regions: getRegionsForCategory("st") });
                await syncEventsFromBackend({ category: "vo", regions: getRegionsForCategory("vo") });
                await syncEventsFromBackend({ category: "ea", regions: getRegionsForCategory("ea") });

                const now = new Date();
                await AsyncStorage.setItem(SYNC_KEY, now.toISOString());
                setLastSync(now);
                console.log("Sync completed");
            } catch (error) {
                console.log("Sync failed:", error);
            } finally {
                syncInProgressRef.current = false;
            }
        })();
    }, [ready, isOnline]);

    console.log("isOnline: " + isOnline);

    if (!ready) return null;

    return (
        <StartupSyncContext.Provider value={{ isOnline, ready, lastSync }}>
            {children}
        </StartupSyncContext.Provider>
    );
}