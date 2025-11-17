import {DarkTheme, DefaultTheme} from "@react-navigation/native";

export const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        text: '#412B25',
        background: 'rgb(244,239,228)',
    },
};

export const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        tex: 'rgb(244,239,228)',
        background: '#412B25',
    },
};