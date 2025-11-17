import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {ThemedText} from './themed-text';
import {useTheme} from '@react-navigation/native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type ThemedButtonProps = {
    title: string;
    iconName: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
}

export function ThemedButton(props: ThemedButtonProps) {
    const { colors } = useTheme();   // gets dynamic theme colors

    return (
        <Pressable
            onPress={() => {props.onPress()}}
            style={styles.button}
        >
            <MaterialIcons name={props.iconName} size={30} color={colors.text}/>
            <ThemedText style={{ color: colors.text, fontWeight: "bold", fontSize: 14 }}>
                {props.title}
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