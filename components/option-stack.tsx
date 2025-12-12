import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import React from "react";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {SFSymbols6_0} from "sf-symbols-typescript";
import {useTheme} from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {IconLibraries, IconName} from "@/helper/ui-helper";
import IconComponent from "@/components/icon-component";
import {ThemedText} from "@/components/themed-text";

// Define the type for one menu option
export type OptionItem = {
    iconSize: number;
    iconColor: string;
    iconPath: IconName;
    iconLibrary: IconLibraries;
    label: string;
    onPress: () => void;
};

// Props for the OptionsStack component
type OptionsStackProps = {
    options: OptionItem[];
};

export function OptionsStack(optionsStackProps: OptionsStackProps) {
    const {colors} = useTheme()


    return(
        <View style={[styles.optionsView, {backgroundColor: colors.background, borderColor: colors.border}]}>
            {optionsStackProps.options.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={item.onPress}
                    style={{width: "100%", alignItems: "center", justifyContent: "flex-start", flexDirection: 'row'}}
                >
                    <IconComponent library={item.iconLibrary} name={item.iconPath} size={item.iconSize} color={item.iconColor}/>
                    <ThemedText style={{marginLeft: 10, fontWeight: "bold"}}>{item.label}</ThemedText>
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
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 0.5,
        paddingHorizontal: "30%",
    }
})

export  default OptionsStack;