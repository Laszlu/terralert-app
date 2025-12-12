import {ThemedView} from "@/components/themed-view";
import ThemedButton from "@/components/themed-button";
import {Button, StyleSheet, Switch, View} from "react-native";
import {useThemeMode} from "@/components/ThemeProvider";
import {ThemedText} from "@/components/themed-text";
import React from "react";
import {useMyTheme} from "@/hooks/useCustomTheme";

export function SettingsMenu() {
    const { mode, setMode } = useThemeMode();
    const {colors} = useMyTheme()

    const highContrastEnabled = mode === 'highContrast'

    const handleContrastSwitchToggled = (value: boolean) => {
        if (value) {
            setMode('highContrast')
        } else {
            setMode('system')
        }
    }

    return(
        <ThemedView style={[styles.settingsMenuView, {borderColor: colors.border}]}>
            <View style={[styles.settingsMenuRow]}>
                <ThemedText style={[styles.settingsMenuText]}>USE HIGH CONTRAST:</ThemedText>
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
        borderTopWidth: 1,
        borderBottomWidth: 0.5,
        paddingVertical: 10,
    },

    settingsMenuText: {
        fontWeight: "bold",
        fontSize: 16,
        marginHorizontal: 5,
    },

    settingsMenuRow: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
    }

})

export default SettingsMenu;