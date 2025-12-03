import {ThemedView} from "@/components/themed-view";
import ThemedButton from "@/components/themed-button";
import {useTheme} from "@react-navigation/native";
import {StyleSheet} from "react-native";
import {useCategoryState} from "@/components/category-state-context";
import {getIconPathForCategory} from "@/helper/ui-helper";

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
    const {category, setCategory} = useCategoryState();

    const categoryIcon = getIconPathForCategory(category.category);

    return (
        <ThemedView style={[styles.menuBar, {backgroundColor: colors.background}]}>
            <ThemedButton title={"CATEGORY"} iconName={categoryIcon.iconName} iconLibrary={categoryIcon.iconLibrary} onPress={actions.changeCategory}></ThemedButton>
            <ThemedButton title={"REGION"} iconName={"earth"} iconLibrary={"MaterialCommunityIcons"} onPress={actions.changeRegion}></ThemedButton>
            <ThemedButton title={"HISTORY"} iconName={"history"} iconLibrary={"MaterialIcons"} onPress={actions.openHistory}></ThemedButton>
            <ThemedButton title={"SETTINGS"} iconName={"settings"} iconLibrary={"MaterialIcons"} onPress={actions.openSettings}></ThemedButton>
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
            borderTopWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
        },
    }
)

export default MenuBar;