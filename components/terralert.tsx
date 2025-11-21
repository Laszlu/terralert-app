import {useTheme} from '@react-navigation/native';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/use-color-scheme';
import {ThemedView} from "@/components/themed-view";
import {StyleSheet, useWindowDimensions} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE, } from "react-native-maps";
import {OptionsStack, OptionItem} from "@/components/option-stack";
import {useEffect, useRef, useState} from "react";

import testEvent from '../model/TestEvent.json'
import {TerralertEvent} from "@/model/event";
import {
    geometryToMarkers,
    getMarkersForEvents, parseCategoryToFullName,
    parseTerralertEvent,
    TerralertMapMarker
} from "@/model/terralert-event-helper";
import {getCurrentEvents} from "@/api/terralert-client";
import {regionToBoundingBoxCoords, TerralertRegion} from "@/model/terralert-region-helper";
import {CustomDarkTheme, CustomDefaultTheme} from "@/constants/CustomTheme";
import MenuBar, {MenuActions} from "@/components/menu-bar";
import {useCategoryState} from "@/components/category-state-context";
import {ThemedText} from "@/components/themed-text";

export default function Terralert() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme;
    const { colors } = useTheme();
    const {height, width, scale, fontScale} = useWindowDimensions();

    // States
    const {category, setCategory} = useCategoryState();
    const [region, setRegion] = useState<TerralertRegion | null>(null);
    const [categoryMenuVisibility, toggleCategoryMenuVisibility] = useState(false);
    const [regionMenuVisibility, toggleRegionMenuVisibility] = useState(false);
    const [eventData, setEventData] = useState<TerralertEvent[] | null>(null);
    const [markers, setMarkers] = useState<TerralertMapMarker[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const categoryOptions: OptionItem[] = [
        {
            iconSize: 40, iconColor: colors.text, iconPath: 'option', label: 'Storms', onPress: () => {
                setCategory("st");
                toggleCategoryMenuVisibility(false);
            }
        },
        {
            iconSize: 40, iconColor: colors.text, iconPath: 'option', label: 'Earthquakes', onPress: () => {
                setCategory("ea");
                toggleCategoryMenuVisibility(false);
            }
        },
        {
            iconSize: 40, iconColor: colors.text, iconPath: 'option', label: 'Volcanoes', onPress: () => {
                setCategory("vo");
                toggleCategoryMenuVisibility(false);
            }
        }]

    const regionOptions: OptionItem[] = category.regions.map(region => (
        {
            iconSize: 40, iconColor: colors.text, iconPath: 'map', label: region.description, onPress: () => {
                setRegion(region);
                toggleRegionMenuVisibility(false);
            }
        }
    ));

    const actions: MenuActions = {
        changeCategory: () => {
            toggleRegionMenuVisibility(false);
            toggleCategoryMenuVisibility(v => !v);
        },
        changeRegion: () => {
            toggleCategoryMenuVisibility(false);
            toggleRegionMenuVisibility(v => !v);
        },
        openHistory: () => {
            console.log("History opened");
            toggleCategoryMenuVisibility(false);
            toggleRegionMenuVisibility(false);
        },
        openSettings: () => console.log("Settings opened"),
    };

    // Test Data
    const parsedEvent: TerralertEvent = parseTerralertEvent(testEvent);
    const marker = geometryToMarkers(parsedEvent.geometry);

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        if (region !== null) {
            const coords = regionToBoundingBoxCoords(region);

            mapRef.current?.fitToCoordinates(coords, {
                edgePadding: {top: 30, right: 30, bottom: 30, left: 30},
                animated: true,
            });
        }
    }, [region]);

    useEffect(() => {
        async function load() {
            try {
                console.log("Loading events for Category: ", category.category);
                const events = await getCurrentEvents(category);
                setEventData(events);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [category])

    useEffect( () => {
        if (eventData != null) {
            setMarkers(getMarkersForEvents(eventData))
        }
    }, [eventData])

    return(
        <ThemedView style={styles.mainContainer}>

            <ThemedView style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    ref={mapRef}
                    initialRegion={{
                        latitude: -25,
                        longitude: -165,
                        latitudeDelta: 65,
                        longitudeDelta: 117,
                    }}>
                    {markers.map((m, index) => (
                        <Marker key={index} coordinate={{ latitude: m.latitude, longitude: m.longitude }} title={m.title} description={m.description}/>
                    ))}
                </MapView>
            </ThemedView>

            <ThemedView style={styles.menuBarContainer}>
                <ThemedView style={[styles.optionsContainer, categoryMenuVisibility ? styles.display_true : styles.display_false]}>
                    <OptionsStack options={categoryOptions}/>
                </ThemedView>
                <ThemedView style={[styles.optionsContainer, regionMenuVisibility ? styles.display_true : styles.display_false]}>
                    <OptionsStack options={regionOptions}/>
                </ThemedView>
                <ThemedView style={[styles.statusBar, {backgroundColor: colors.background}]}>
                    <ThemedText style={[styles.statusBarText, {color: colors.notification}]}>
                        {"CATEGORY: " + parseCategoryToFullName(category.category).toUpperCase()}
                    </ThemedText>
                    <ThemedText style={[styles.statusBarText, {color: colors.notification}]}>
                        {"REGION: " + (region !== null ? region.description.toUpperCase() : "NONE")}
                    </ThemedText>
                </ThemedView>
                <MenuBar actions={actions}/>
            </ThemedView>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    display_true: {
        display: "flex",
    },

    display_false: {
        display: "none",
    },

    mainContainer: {
        flex: 1,
        paddingTop: 0,
        paddingBottom: 0
    },

    mapContainer: {
        flex: 1,
        position: "relative"
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },

    optionsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.0)",
    },

    statusBarText: {
        fontWeight: "bold",
        fontSize: 12,
        marginHorizontal: 5,
    },

    statusBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderTopWidth: 1,
        borderBottomWidth: 0.5,
        borderColor: "rgba(0,0,0,0.2)",
        height: "auto"
    },

    menuBarContainer: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.0)",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 100,
        height: 'auto'
    },
});