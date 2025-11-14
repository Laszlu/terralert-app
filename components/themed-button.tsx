import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {ThemedText} from './themed-text';
import {useTheme} from '@react-navigation/native';

type ThemedButtonProps = {
    title: string;
    onPress: () => void;
}

export function ThemedButton(props: ThemedButtonProps) {
    const { colors } = useTheme();   // gets dynamic theme colors

    return (
        <Pressable
            onPress={() => {props.onPress()}}
            style={styles.button}
        >
            <ThemedText style={{ color: colors.text }}>
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