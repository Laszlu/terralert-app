import 'react-native-reanimated';

import Terralert from "@/components/terralert";
import {CategoryStateProvider} from "@/components/category-state-context";
import {AppThemeProvider} from "@/components/ThemeProvider";


export default function RootLayout() {

    return (
        <AppThemeProvider>
            <CategoryStateProvider>
                <Terralert/>
            </CategoryStateProvider>
        </AppThemeProvider>
    );
}