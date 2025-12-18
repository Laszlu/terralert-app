import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {syncEventsFromBackend} from "@/services/event-sync-service";
import {getRegionsForCategory} from "@/helper/terralert-region-helper";

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

async function shouldSync() {
    const lastSyncStr = await AsyncStorage.getItem(SYNC_KEY);

    if (!lastSyncStr) {
        return true;
    }

    const lastSyncDate = new Date(lastSyncStr);
    const now = new Date();
    const diffMs = now.getTime() - lastSyncDate.getTime();
    return diffMs > 24 * MS_PER_HOUR;
}


export function StartupSyncProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);

    const syncInProgressRef = useRef(false);

    useEffect(() => {

        const trySyncIfNeeded = async () => {
            if (syncInProgressRef.current) return;

            const netState = await Network.getNetworkStateAsync();
            const online = netState.isConnected && netState.isInternetReachable !== false;

            const lastSyncStr = await AsyncStorage.getItem(SYNC_KEY);
            if (lastSyncStr) setLastSync(new Date(lastSyncStr));

            if (!online) return;

            const needSync = await shouldSync();
            if (!needSync) return;

            try {
                syncInProgressRef.current = true;

                await syncEventsFromBackend({ category: "st", regions: getRegionsForCategory("st") });
                await syncEventsFromBackend({ category: "vo", regions: getRegionsForCategory("vo") });
                await syncEventsFromBackend({ category: "ea", regions: getRegionsForCategory("ea") });

                const now = new Date();
                await AsyncStorage.setItem(SYNC_KEY, now.toISOString());
                setLastSync(now);
            } catch (e) {
                console.warn("Sync failed", e);
            } finally {
                syncInProgressRef.current = false;
            }
        };

        Network.getNetworkStateAsync().then(state => {
            setIsOnline((state.isConnected && state.isInternetReachable !== false) ?? false);
            trySyncIfNeeded();
            setReady(true);
        });

        const subscription = Network.addNetworkStateListener(state => {
            const online = state.isConnected && state.isInternetReachable !== false;
            setIsOnline(online!);

            if (online) {
                setTimeout(() => trySyncIfNeeded(), 1000);
            }
        });

        return () => subscription?.remove();
    }, []);


    if (!ready) return null;

    return (
        <StartupSyncContext.Provider value={{ isOnline, ready, lastSync }}>
            {children}
        </StartupSyncContext.Provider>
    );
}

