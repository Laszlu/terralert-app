import {ThemedView} from "@/components/themed-view";
import ThemedButton from "@/components/themed-button";
import {useTheme} from "@react-navigation/native";
import {StyleSheet} from "react-native";

export type MenuActions = {
    changeCategory: () => void;
    changeRegion: () => void;
    openHistory: () => void;
    openSettings: () => void;
};

type MenuBarProps = {
    actions: MenuActions;
}

export function MenuBar({actions}: MenuBarProps) {
    const {colors} = useTheme()

    return (
        <ThemedView style={[styles.menuBar, {backgroundColor: colors.background}]}>
            <ThemedButton title={"CATEGORY"} iconName={"storm"} onPress={actions.changeCategory}></ThemedButton>
            <ThemedButton title={"REGION"} iconName={"volcano"} onPress={actions.changeRegion}></ThemedButton>
            <ThemedButton title={"HISTORY"} iconName={"history"} onPress={actions.openHistory}></ThemedButton>
            <ThemedButton title={"SETTINGS"} iconName={"settings"} onPress={actions.openSettings}></ThemedButton>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
        menuBar: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center", // sample bg to visualize
            width: "100%",
            paddingTop: 10,
            paddingBottom: 20,
            paddingHorizontal: 25,
        },
    }
)

export default MenuBar;