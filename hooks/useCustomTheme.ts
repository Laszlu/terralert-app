import {useColorScheme, ColorSchemeName} from 'react-native';
import {DefaultTheme, Theme, useTheme} from '@react-navigation/native';

export interface IColors {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    disabled: string;
}

export interface ITheme extends Theme {
    colors: IColors;
}

export const Colors: {
    light: ITheme;
    dark: ITheme;
    highContrast: ITheme;
} = {
    light: {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            text: '#412B25',
            notification: 'rgba(65,43,37,0.8)',
            background: 'rgb(244,239,228)',
            card: 'rgb(241,239,236)',
            disabled: 'rgba(60,58,57,0.8)',
            border: '#412B25',
        },
        dark: false,
    },
    dark: {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            text: 'rgb(244,239,228)',
            notification: 'rgba(244,239,228, 0.8)',
            background: '#412B25',
            card: '#2e201a',
            disabled: 'rgba(101,99,96,0.8)',
            border: 'rgb(244,239,228)',
        },
        dark: true,
    },
    highContrast: {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            text: '#ffef3f',
            background: '#000000',
            card: '#000000',
            notification: '#978e29',
            disabled: '#636363',
            border: '#ffef3f',
        },
        dark: false,
    },
};

export default function useThemeColors(
    scheme?: NonNullable<ColorSchemeName>,
): ITheme {
    const systemScheme = useColorScheme() || 'light';
    const colorScheme = scheme ?? systemScheme;
    return Colors[colorScheme];
}

export const useMyTheme = () => {
    return useTheme() as ITheme;
};