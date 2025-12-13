import {ThemedView} from "@/components/themed-view";
import ThemedButton from "@/components/themed-button";
import {useTheme} from "@react-navigation/native";
import {StyleSheet} from "react-native";
import {useCategoryState} from "@/components/category-state-context";
import {getIconPathForCategory} from "@/helper/ui-helper";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";

export type MenuActions = {
    changeCategory: () => void;
    changeRegion: () => void;
    openHistory: () => void;
    openSettings: () => void;
};

type MenuBarProps = {
    actions: MenuActions;
    disabled: boolean;
    categoryOpened: boolean;
    regionOpened: boolean;
    historyOpened: boolean;
    settingsOpened: boolean;
}

export function MenuBar({actions, disabled, categoryOpened, regionOpened, historyOpened, settingsOpened}: MenuBarProps) {
    const {colors} = useMyTheme()
    const responsiveScaling = useResponsiveScaling();
    const {category, setCategory} = useCategoryState();

    const categoryIcon = getIconPathForCategory(category.category);

    return (
        <ThemedView style={[
            styles.menuBar,
            {
                backgroundColor: colors.background,
                borderColor: colors.border,
                paddingTop: responsiveScaling.scale(10),
                paddingBottom: responsiveScaling.scale(20),
                paddingHorizontal: responsiveScaling.scale(25)

            }]}>
            <ThemedButton title={"CATEGORY"} iconName={categoryIcon.iconName} iconLibrary={categoryIcon.iconLibrary} onPress={actions.changeCategory} disabled={disabled} selected={categoryOpened}></ThemedButton>
            <ThemedButton title={"REGION"} iconName={"earth"} iconLibrary={"MaterialCommunityIcons"} onPress={actions.changeRegion} disabled={disabled} selected={regionOpened}></ThemedButton>
            <ThemedButton title={"HISTORY"} iconName={"history"} iconLibrary={"MaterialIcons"} onPress={actions.openHistory}  disabled={category.category === "vo"} selected={historyOpened}></ThemedButton>
            <ThemedButton title={"SETTINGS"} iconName={"settings"} iconLibrary={"MaterialIcons"} onPress={actions.openSettings} selected={settingsOpened}></ThemedButton>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
        menuBar: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
        },
    }
)

export default MenuBar;