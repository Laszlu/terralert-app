import 'react-native-reanimated';

import Terralert from "@/components/terralert";
import {CategoryStateProvider} from "@/components/category-state-context";
import {AppThemeProvider} from "@/components/ThemeProvider";
import {DatabaseProvider} from "@/components/database-provider";
import {StartupSyncProvider} from "@/components/startup-sync-provider";


export default function RootLayout() {

    return (
        <AppThemeProvider>
            <CategoryStateProvider>
                <DatabaseProvider>
                    <StartupSyncProvider>
                        <Terralert/>
                    </StartupSyncProvider>
                </DatabaseProvider>
            </CategoryStateProvider>
        </AppThemeProvider>
    );
}