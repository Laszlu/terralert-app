import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

type LocationCoords = {
    latitude: number;
    longitude: number;
};

export type TerralertLocation = {
    latitude: number;
    longitude: number;
};

export function useGeolocation() {
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [locationError, setError] = useState<string | null>(null);
    const [locationLoading, setLoading] = useState(true);

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        async function start() {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== Location.PermissionStatus.GRANTED) {
                setError('Permission denied');
                setLoading(false);
                return;
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    distanceInterval: 10, // meters
                },
                (pos) => {
                    setLocation({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    });
                    setLoading(false);
                }
            );
        }

        start();

        return () => {
            subscription?.remove();
        };
    }, []);

    return { location, locationError, locationLoading };
}

export async function getCurrentLocation() {
    const { status } =
        await Location.requestForegroundPermissionsAsync();

    if (status !== Location.PermissionStatus.GRANTED) {
        throw new Error('Permission denied');
    }

    const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
    });

    return {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
    };
}

