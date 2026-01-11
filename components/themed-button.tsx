import React from 'react';
import {Platform, Pressable, StyleSheet} from 'react-native';
import {ThemedText} from './themed-text';
import {IconLibraries, IconName} from "@/helper/ui-helper";
import {IconComponent} from "@/components/icon-component";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";


type ThemedButtonProps = {
    title: string;
    iconName: IconName;
    iconLibrary: IconLibraries;
    onPress: () => void;
    disabled?: boolean;
    selected: boolean;
}

export function ThemedButton({title, iconName, iconLibrary, onPress, disabled = false, selected}: ThemedButtonProps) {
    const { colors } = useMyTheme();
    const responsiveScaling = useResponsiveScaling();

    return (
        <Pressable onPress={() => {onPress()}}
                   style={({pressed}) => [
                       styles.button,
                       {
                           backgroundColor: (selected ? colors.text : colors.background),
                           paddingHorizontal: responsiveScaling.scale(3),
                           paddingVertical: responsiveScaling.scale(3),
                           transform: [{ scale: pressed ? 0.96 : 1 }],
                           opacity: pressed && Platform.OS === 'ios' ? 0.7 : 1,
                       }]}
                   disabled={disabled}>
            <IconComponent name={iconName as any} library={iconLibrary} size={30} color={disabled ? colors.disabled : (selected ? colors.background : colors.text)}/>
            <ThemedText style={{
                color: (disabled ? colors.disabled : (selected ? colors.background : colors.text)),
                fontWeight: "bold",
                fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 14)
            }}>
                {title}
            </ThemedText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

