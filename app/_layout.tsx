import {ThemeProvider, useTheme} from '@react-navigation/native';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/use-color-scheme';
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";
import {Animated, StyleSheet, useWindowDimensions, View} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE, LatLng, MapMarker} from "react-native-maps";
import ThemedButton from "@/components/themed-button";
import OptionsStack from "@/components/option-stack";
import {useEffect, useState} from "react";

import testEvent from '../model/TestEvent.json'
import {TerralertEvent} from "@/model/event";
import {
    geometryToMarkers,
    getMarkersForEvents,
    parseTerralertEvent,
    TerralertMapMarker
} from "@/model/terralert-event-helper";
import {getCurrentEvents} from "@/api/terralert-client";
import {TerralertRegion} from "@/model/terralert-region-helper";
import {CustomDarkTheme, CustomDefaultTheme} from "@/constants/CustomTheme";
import MenuBar, {MenuActions} from "@/components/menu-bar";


export default function RootLayout() {
    // Config
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme;
    const { colors } = useTheme();
    const {height, width, scale, fontScale} = useWindowDimensions();

    // States
    const [category, setCategory] = useState('vo');
    const [region, setRegion] = useState<TerralertRegion | null>(null);
    const [menuVisibility, toggleMenuVisibility] = useState(false);
    const [eventData, setEventData] = useState<TerralertEvent[] | null>(null);
    const [markers, setMarkers] = useState<TerralertMapMarker[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const actions: MenuActions = {
        changeCategory: () => toggleMenuVisibility(v => !v),
        changeRegion: () => console.log("Regions clicked"),
        openSettings: () => console.log("Settings opened"),
    };

    // Test Data
    const parsedEvent: TerralertEvent = parseTerralertEvent(testEvent);
    const marker = geometryToMarkers(parsedEvent.geometry);

    useEffect(() => {
        async function load() {
            try {
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

    return (
        <ThemeProvider value={theme}>
            <ThemedView style={styles.mainContainer}>

                <ThemedView style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: 10,
                            longitude: 140,
                            latitudeDelta: 130,
                            longitudeDelta: 80,
                        }}>
                        {markers.map((m, index) => (
                            <Marker key={index} coordinate={{ latitude: m.latitude, longitude: m.longitude }} title={m.title} description={m.description}/>
                        ))}
                    </MapView>
                </ThemedView>

                <ThemedView style={styles.menuBarContainer}>
                    <ThemedView style={[styles.optionsContainer, menuVisibility ? styles.display_true : styles.display_false]}>
                        <OptionsStack options={[
                            {iconSize: 50, iconColor: '#808080', iconPath: 'option', label: 'Option 1', onPress: () => console.log("Option 1 pressed")},
                            {iconSize: 50, iconColor: '#808080', iconPath: 'option', label: 'Option 2', onPress: () => console.log("Option 2 pressed")},
                            {iconSize: 50, iconColor: '#808080', iconPath: 'option', label: 'Option 3', onPress: () => console.log("Option 3 pressed")},
                            {iconSize: 50, iconColor: '#808080', iconPath: 'option', label: 'Option 4', onPress: () => console.log("Option 4 pressed")},
                        ]}/>
                    </ThemedView>
                    <MenuBar actions={actions}/>
                </ThemedView>

            </ThemedView>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 0,
        paddingBottom: 0
    },

    optionsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.0)",
    },

    display_true: {
        display: "flex",
    },

    display_false: {
        display: "none",
    },

    menuBarContainer: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.0)",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 100
    },

    menuBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center", // sample bg to visualize
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        width: "100%",
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 40,
    },

    mapContainer: {
        flex: 1,
        position: "relative"
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
