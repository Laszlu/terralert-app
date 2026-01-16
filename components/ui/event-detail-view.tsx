import {TerralertEvent} from "@/model/event";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";
import {View, StyleSheet, Platform, Pressable} from "react-native";
import {ThemedText} from "@/components/themed-text";
import {parseDateFromMarker} from "@/helper/ui-helper";
import {TerralertMapMarker} from "@/helper/terralert-event-helper";
import {ThemedButton} from "@/components/themed-button";
import React, {useCallback} from "react";
import * as Linking from 'expo-linking';
import {IconComponent} from "@/components/icon-component";

export type EventDetailViewProps = {
    marker: TerralertMapMarker;
    setDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EventDetailView(props: EventDetailViewProps) {
    const {colors} = useMyTheme();
    const responsiveScaling = useResponsiveScaling();

    const parsedDateTime = props.marker.date !== null ? parseDateFromMarker(props.marker.date!) : null;

    const sources = props.marker.event?.sources.filter(s => s.url !== null)

    const url = props.marker.event?.sources[0].url

    const handleSourceButtonPressed = useCallback(async (url: string) => {
        const supported = await Linking.canOpenURL(url!);

        if (supported) {
            await Linking.openURL(url!);
        } else {
            console.warn('Cannot open URL: ' + url);
        }
    }, [])

    return(
        <View style={[
            styles.detailViewMainView,
            {
                backgroundColor: colors.background,
                paddingVertical: responsiveScaling.scale(15),
                paddingHorizontal: responsiveScaling.scale(40),
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
            <Pressable
                onPress={()=> {props.setDetailOpen(false)}}
                style={({pressed}) => [
                    {
                        position: 'absolute',
                        top: responsiveScaling.scale(10),
                        right: responsiveScaling.scale(10),
                        transform: [{ scale: pressed ? 0.96 : 1 }],
                        opacity: pressed && Platform.OS === 'ios' ? 0.7 : 1,
                    }
                ]}>
                <IconComponent library={'MaterialCommunityIcons'} name={'close-circle'} size={30} color={colors.text}/>
            </Pressable>
            <View style={[
                styles.detailViewRow
            ]}>
                <ThemedText style={[
                    styles.detailViewRowContentLeft
                ]}>
                    ID:
                </ThemedText>
                <ThemedText style={[
                    styles.detailViewRowContentRight
                ]}>
                    {props.marker.event!.id}
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
            {sources &&
                <View
                    style={[
                    styles.detailViewButtonRow,
                    {
                        paddingTop: responsiveScaling.scale(10),
                    }
                ]}>
                    <ThemedText style={[
                        styles.detailViewRowContentLeft
                    ]}>
                        SOURCES:
                    </ThemedText>
                    <View
                    style={[
                        styles.detailViewRowContentRight,
                        {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 15
                        }
                    ]}>
                        {sources.map((s, index) => (
                            <ThemedButton
                                key={index}
                                title={s.id ? s.id!.toUpperCase() : 'SOURCE'}
                                iconName={'info'}
                                iconLibrary={'MaterialIcons'}
                                onPress={() => {handleSourceButtonPressed(s.url!)}}
                                selected={false}/>
                        ))}
                    </View>
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
        justifyContent: 'flex-start',
        width: '100%',
    },
})