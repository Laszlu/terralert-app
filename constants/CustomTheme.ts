import {DarkTheme, DefaultTheme} from "@react-navigation/native";

export const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        text: '#412B25',
        notification: 'rgba(65,43,37,0.8)',
        background: 'rgb(244,239,228)',
        card: 'rgb(241,239,236)',
    },
};

export const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        tex: 'rgb(244,239,228)',
        notification: 'rgba(244,239,228, 0.8)',
        background: '#412B25',
        card: '#2e201a',
    },
};