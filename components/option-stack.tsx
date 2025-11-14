import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import React from "react";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {SFSymbols6_0} from "sf-symbols-typescript";

// Define the type for one menu option
type OptionItem = {
    iconSize: number;
    iconColor: string;
    iconPath: SFSymbols6_0;
    label: string;
    onPress: () => void;
};

// Props for the OptionsStack component
type OptionsStackProps = {
    options: OptionItem[];
};

export function OptionsStack(optionsStackProps: OptionsStackProps) {
    return(
        <View style={styles.optionsView}>
            {optionsStackProps.options.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={item.onPress}
                >
                    <IconSymbol size={item.iconSize} color={item.iconColor} name={item.iconPath}></IconSymbol>
                    <Text style={{marginLeft: 10}}>{item.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    optionsView: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: '95%',
        marginTop: 40,
        paddingVertical: 10,
        backgroundColor: "rgba(240,240,240,1)",
        borderRadius: 10,
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 1,
    }
})

export  default OptionsStack;