import {ThemedView} from "@/components/themed-view";
import {StyleSheet} from "react-native";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";
import {ThemedText} from "@/components/themed-text";
import {TerralertMapMarker} from "@/helper/terralert-event-helper";
import {parseDateFromMarker} from "@/helper/ui-helper";

type CustomCalloutProps = {
    marker: TerralertMapMarker;
}

export function CustomCallout(calloutProps: CustomCalloutProps) {
    const {colors} = useMyTheme();
    const responsiveScaling = useResponsiveScaling();

    const parsedDateTime = calloutProps.marker.date !== null ? parseDateFromMarker(calloutProps.marker.date!) : null;

    return(
        <ThemedView style={[
            styles.CustomCalloutContainer,
            {
                backgroundColor: colors.background,
                minWidth: responsiveScaling.scale(200),
                minHeight: responsiveScaling.scale(80),
                paddingVertical: responsiveScaling.scale(10),
                paddingHorizontal: responsiveScaling.scale(20)
        }]}>
            <ThemedText style={[
                styles.CustomCalloutHeader,
                {
                    fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16)
                }
            ]}>
                {calloutProps.marker.title}
            </ThemedText>
            <ThemedText>
                DATE: {parsedDateTime !== null ? parsedDateTime.substring(0, 10) : ""}
            </ThemedText>
            <ThemedText>
                TIME: {parsedDateTime !== null ? parsedDateTime.substring(11) : ""}
            </ThemedText>
            <ThemedText>
                MAGNITUDE: {calloutProps.marker.magnitudeValue} {calloutProps.marker.magnitudeUnit}
            </ThemedText>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    CustomCalloutContainer: {
        borderRadius: 10,
    },

    CustomCalloutHeader: {
        fontWeight: "bold"
    }
})