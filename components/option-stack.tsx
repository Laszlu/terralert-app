import {TouchableOpacity, View, StyleSheet} from "react-native";
import React from "react";
import {IconLibraries, IconName} from "@/helper/ui-helper";
import IconComponent from "@/components/icon-component";
import {ThemedText} from "@/components/themed-text";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";

export type OptionItem = {
    iconSize: number;
    iconColor: string;
    iconPath: IconName;
    iconLibrary: IconLibraries;
    label: string;
    onPress: () => void;
};

type OptionsStackProps = {
    options: OptionItem[];
};

export function OptionsStack(optionsStackProps: OptionsStackProps) {
    const {colors} = useMyTheme();
    const responsiveScaling = useResponsiveScaling();


    return(
        <View style={[
            styles.optionsView,
            {
                backgroundColor: colors.background,
                borderColor: colors.border,
                paddingVertical: responsiveScaling.scale(10),
                paddingHorizontal: responsiveScaling.scale(80),
            }]}>
            {optionsStackProps.options.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={item.onPress}
                    style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flexDirection: 'row'
                }}>
                    <IconComponent library={item.iconLibrary} name={item.iconPath} size={item.iconSize} color={item.iconColor}/>
                    <ThemedText style={{
                        marginLeft: responsiveScaling.scale(10),
                        fontWeight: "bold",
                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16)
                    }}>
                        {item.label}
                    </ThemedText>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    optionsView: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        borderTopWidth: 1,
        borderBottomWidth: 0.5,
    }
})

export  default OptionsStack;