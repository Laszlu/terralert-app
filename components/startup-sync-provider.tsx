import React, {createContext, useContext, useEffect, useState} from 'react';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {syncEventsFromBackend} from "@/services/event-sync-service";
import {useCategoryState} from "@/components/category-state-context";
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
    const {category} = useCategoryState();

    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            try {
                const netState = await Network.getNetworkStateAsync();
                setIsOnline((netState.isConnected && netState.isInternetReachable !== false) ?? false);

                if (netState.isConnected && netState.isInternetReachable) {
                    const needSync = await shouldSync();
                    if (needSync) {
                        await syncEventsFromBackend(category);
                        await syncEventsFromBackend({
                            category: "vo",
                            regions: getRegionsForCategory("vo")
                        })
                        await syncEventsFromBackend({
                            category: "ea",
                            regions: getRegionsForCategory("ea")
                        })
                        const now = new Date();
                        setLastSync(now);
                        await AsyncStorage.setItem(SYNC_KEY, now.toISOString());
                    } else {
                        const lastSyncStr = await AsyncStorage.getItem(SYNC_KEY);
                        if (lastSyncStr) setLastSync(new Date(lastSyncStr));
                    }
                }
            } catch (e) {
                console.warn('Startup sync failed', e);
            } finally {
                if (!cancelled) setReady(true);
            }
        }

        bootstrap();

        const subscription = Network.addNetworkStateListener(state => {
            setIsOnline((state.isConnected && state.isInternetReachable !== false) ?? false);
        });

        return () => {
            cancelled = true;
            subscription?.remove();
        };
    }, [category]);

    if (!ready) return null;

    return (
        <StartupSyncContext.Provider value={{ isOnline, ready, lastSync }}>
            {children}
        </StartupSyncContext.Provider>
    );
}
