import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import React from "react";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {SFSymbols6_0} from "sf-symbols-typescript";
import {useTheme} from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {IconLibraries, IconName} from "@/helper/ui-helper";
import IconComponent from "@/components/icon-component";

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
        <View style={[styles.optionsView, {backgroundColor: colors.background}]}>
            {optionsStackProps.options.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={item.onPress}
                    style={{width: "100%", alignItems: "center", justifyContent: "flex-start", flexDirection: 'row'}}
                >
                    <IconComponent library={item.iconLibrary} name={item.iconPath} size={item.iconSize} color={item.iconColor}/>
                    <Text style={{marginLeft: 10}}>{item.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    optionsView: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: '100%',
        marginTop: 70,
        paddingVertical: 10,
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 1,
        paddingHorizontal: "30%",
    }
})

export  default OptionsStack;