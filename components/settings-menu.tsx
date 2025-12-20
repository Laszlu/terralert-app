import {ThemedView} from "@/components/themed-view";
import {StyleSheet, Switch, View} from "react-native";
import {useThemeMode} from "@/components/ThemeProvider";
import {ThemedText} from "@/components/themed-text";
import React from "react";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";

export function SettingsMenu() {
    const { mode, setMode } = useThemeMode();
    const {colors} = useMyTheme();
    const responsiveScaling = useResponsiveScaling();

    const highContrastEnabled = mode === 'highContrast'

    const handleContrastSwitchToggled = (value: boolean) => {
        if (value) {
            setMode('highContrast')
        } else {
            setMode('system')
        }
    }

    return(
        <ThemedView style={[
            styles.settingsMenuView,
            {
                borderColor: colors.border,
                paddingVertical: responsiveScaling.scale(10),
            }]}>
            <View style={[
                styles.settingsMenuRow,
                {
                    paddingVertical: responsiveScaling.scale(10),
                    paddingHorizontal: responsiveScaling.scale(15),
                }
            ]}>
                <ThemedText style={[
                    styles.settingsMenuText,
                    {
                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                        marginHorizontal: responsiveScaling.scale(5),
                    }
                ]}>
                    USE HIGH CONTRAST:
                </ThemedText>
                <Switch
                    value={highContrastEnabled}
                    onValueChange={ value =>  {handleContrastSwitchToggled(value)} }
                ></Switch>
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    settingsMenuView: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
    },

    settingsMenuText: {
        fontWeight: "bold",
    },

    settingsMenuRow: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        justifyContent: 'space-between',
    }

})

