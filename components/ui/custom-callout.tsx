import {ThemedView} from "@/components/themed-view";
import {Pressable, StyleSheet} from "react-native";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";
import {ThemedText} from "@/components/themed-text";
import {TerralertMapMarker} from "@/helper/terralert-event-helper";
import {parseDateFromMarker} from "@/helper/ui-helper";
import {IconComponent} from "@/components/icon-component";
import {useAnimatedStyle, useSharedValue} from "react-native-reanimated";

type CustomCalloutProps = {
    marker: TerralertMapMarker;
}

export function CustomCallout(calloutProps: CustomCalloutProps) {
    const {colors} = useMyTheme();
    const responsiveScaling = useResponsiveScaling();

    return(
        <ThemedView style={[
            styles.CustomCalloutContainer,
            {
                backgroundColor: colors.background,
                minWidth: responsiveScaling.scale(200),
                minHeight: responsiveScaling.scale(50),
                paddingVertical: responsiveScaling.scale(10),
                paddingLeft: responsiveScaling.scale(20),
        }]}>
            <ThemedView
            style={[
                {
                    width: '80%',
                }
            ]}>
                <ThemedText style={[
                    styles.CustomCalloutHeader,
                    {
                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16)
                    }
                ]}>
                    {calloutProps.marker.title!.toUpperCase()}
                </ThemedText>
            </ThemedView>
            <ThemedView style={[
                {
                    width: '20%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            ]}>
                <IconComponent library={"MaterialIcons"} name={'arrow-forward-ios'} color={colors.text} size={30}/>
            </ThemedView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    CustomCalloutContainer: {
        borderRadius: 10,
        flexDirection: "row"
    },

    CustomCalloutHeader: {
        fontWeight: "bold"
    }
})