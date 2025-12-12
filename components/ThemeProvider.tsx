import React, { createContext, useContext, useState, useMemo } from 'react';
import {NavigationContainer, ThemeProvider} from '@react-navigation/native';
import useThemeColors, {useMyTheme, Colors} from '@/hooks/useCustomTheme';


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

    // Get the system theme (your existing helper)
    const systemTheme = useThemeColors(); // already returns light/dark based on system

    const theme = useMemo(() => {
        if (mode === 'system') return systemTheme;
        if (mode === 'highContrast') return Colors.highContrast;
        return Colors[mode];
    }, [mode, systemTheme]);

    return (
        <ThemeContext.Provider value={{ mode, setMode }}>
            <ThemeProvider value={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
