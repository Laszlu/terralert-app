import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {ThemedText} from './themed-text';
import {useTheme} from '@react-navigation/native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {IconLibraries, IconName} from "@/helper/ui-helper";
import IconComponent from "@/components/icon-component";


type ThemedButtonProps = {
    title: string;
    iconName: IconName;
    iconLibrary: IconLibraries;
    onPress: () => void;
}

export function ThemedButton({title, iconName, iconLibrary, onPress}: ThemedButtonProps) {
    const { colors } = useTheme();   // gets dynamic theme colors

    return (
        <Pressable onPress={() => {onPress()}} style={styles.button}>
            <IconComponent name={iconName as any} library={iconLibrary} size={30} color={colors.text}/>
            <ThemedText style={{ color: colors.text, fontWeight: "bold", fontSize: 14 }}>
                {title}
            </ThemedText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,0.0)",
    },
});

export default ThemedButton;