import {ThemeProvider} from '@react-navigation/native';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/use-color-scheme';
import Terralert from "@/components/terralert";
import {CustomDarkTheme, CustomDefaultTheme} from "@/constants/CustomTheme";
import {CategoryStateProvider} from "@/components/category-state-context";


export default function RootLayout() {
    // Config
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme;

    return (
        <ThemeProvider value={theme}>
            <CategoryStateProvider>
                <Terralert/>
            </CategoryStateProvider>
        </ThemeProvider>
    );
}