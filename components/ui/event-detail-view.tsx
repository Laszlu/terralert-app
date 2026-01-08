import {TerralertEvent} from "@/model/event";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";
import {View, StyleSheet} from "react-native";
import {ThemedText} from "@/components/themed-text";
import {parseDateFromMarker} from "@/helper/ui-helper";
import {TerralertMapMarker} from "@/helper/terralert-event-helper";
import {ThemedButton} from "@/components/themed-button";
import {useCallback} from "react";
import * as Linking from 'expo-linking';

export type EventDetailViewProps = {
    marker: TerralertMapMarker;
}

export function EventDetailView(props: EventDetailViewProps) {
    const {colors} = useMyTheme();
    const responsiveScaling = useResponsiveScaling();

    const parsedDateTime = props.marker.date !== null ? parseDateFromMarker(props.marker.date!) : null;

    const url = props.marker.event?.sources[0].url

    const handleSourceButtonPressed = useCallback(async () => {
        const supported = await Linking.canOpenURL(url!);

        if (supported) {
            await Linking.openURL(url!);
        } else {
            console.warn('Cannot open URL: ' + url);
        }
    }, [url])

    return(
        <View style={[
            styles.detailViewMainView,
            {
                backgroundColor: colors.background,
                paddingVertical: responsiveScaling.scale(10),
                paddingHorizontal: responsiveScaling.scale(30),
            }
        ]}>
            <View style={[
                styles.detailViewRow
            ]}>
                <ThemedText style={[
                    styles.detailViewHeader,
                    {
                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 20 : 18),
                        paddingBottom: responsiveScaling.scale(10)
                    }
                ]}>
                    {props.marker.event!.title!.toUpperCase()}
                </ThemedText>
            </View>
            <View style={[
                styles.detailViewRow
            ]}>
                <ThemedText style={[
                    styles.detailViewRowContentLeft
                ]}>
                    DATE:
                </ThemedText>
                <ThemedText style={[
                    styles.detailViewRowContentRight
                ]}>
                    {parsedDateTime !== null ? parsedDateTime[0] : ""}
                </ThemedText>
            </View>
            <View style={[
                styles.detailViewRow
            ]}>

                <ThemedText style={[
                    styles.detailViewRowContentLeft
                ]}>
                    TIME:
                </ThemedText>
                <ThemedText style={[
                    styles.detailViewRowContentRight
                ]}>
                    {parsedDateTime !== null ? parsedDateTime[1] : ""}
                </ThemedText>
            </View>
            <View style={[
                styles.detailViewRow
            ]}>
                <ThemedText style={[
                    styles.detailViewRowContentLeft
                ]}>
                    MAGNITUDE:
                </ThemedText>
                <ThemedText style={[
                    styles.detailViewRowContentRight
                ]}>
                    {props.marker.magnitudeValue} {props.marker.magnitudeUnit}
                </ThemedText>
            </View>
            {url &&
                <View style={[
                    styles.detailViewButtonRow,
                    {
                        paddingTop: responsiveScaling.scale(10),
                    }
                ]}>
                    <ThemedButton title={'SOURCE'} iconName={'info'} iconLibrary={'MaterialIcons'} onPress={() => {handleSourceButtonPressed()}} selected={false}/>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    detailViewMainView: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
    },

    detailViewRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        width: '100%'
    },

    detailViewHeader: {
        fontWeight: "bold"
    },

    detailViewRowContentLeft: {
        width: '40%',
        fontWeight: "bold"
    },

    detailViewRowContentRight: {
        width: '60%'
    },

    detailViewButtonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        width: '100%',
    },
})