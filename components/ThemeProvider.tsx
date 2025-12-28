import React, {createContext, useContext, useState, useMemo, useEffect} from 'react';
import {ThemeProvider} from '@react-navigation/native';
import useThemeColors, {Colors} from '@/hooks/useCustomTheme';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {HIGH_CONTRAST_KEY} from "@/constants/constants";


type ThemeMode = 'system' | 'light' | 'dark' | 'highContrast';

type ThemeContextType = {
    mode: ThemeMode;
    setMode: (m: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    mode: 'system',
    setMode: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>('system');
    const [hydrated, setHydrated] = useState(false);

    // Get the system theme (your existing helper)
    const systemTheme = useThemeColors(); // already returns light/dark based on system

    useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.getItem(HIGH_CONTRAST_KEY);
                if (value === '1') {
                    setMode('highContrast');
                }
            } finally {
                setHydrated(true);
            }
        })();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(
            HIGH_CONTRAST_KEY,
            mode === 'highContrast' ? '1' : '0'
        );
    }, [mode]);

    const theme = useMemo(() => {
        if (mode === 'system') return systemTheme;
        if (mode === 'highContrast') return Colors.highContrast;
        return Colors[mode];
    }, [mode, systemTheme]);

    if (!hydrated) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ mode, setMode }}>
            <ThemeProvider value={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
