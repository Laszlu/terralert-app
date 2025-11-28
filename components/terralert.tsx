import {useTheme} from '@react-navigation/native';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/use-color-scheme';
import {ThemedView} from "@/components/themed-view";
import {Image, StyleSheet, TouchableOpacity, useWindowDimensions} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE, } from "react-native-maps";
import {OptionsStack, OptionItem} from "@/components/option-stack";
import {useEffect, useRef, useState} from "react";

import testEvent from '../model/TestEvent.json'
import {TerralertEvent} from "@/model/event";
import {
    geometryToMarkers,
    getMarkersForEvents,
    parseTerralertEvent,
    TerralertMapMarker
} from "@/helper/terralert-event-helper";
import {icons, parseCategoryToFullName} from "@/helper/ui-helper";
import {getCurrentEvents} from "@/api/terralert-client";
import {regionToBoundingBoxCoords, TerralertRegion} from "@/helper/terralert-region-helper";
import {CustomDarkTheme, CustomDefaultTheme} from "@/constants/CustomTheme";
import MenuBar, {MenuActions} from "@/components/menu-bar";
import {useCategoryState} from "@/components/category-state-context";
import {ThemedText} from "@/components/themed-text";
import {Asset} from "expo-asset";
import HistoryMenu from "@/components/history-menu";

export default function Terralert() {
    //-------------------
    // Visual Setup
    //-------
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme;
    const { colors } = useTheme();
    const {height, width, scale, fontScale} = useWindowDimensions();

    //-------------------
    // States
    //-------
    // General app states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    // Menus
    const [categoryMenuVisibility, toggleCategoryMenuVisibility] = useState(false);
    const [regionMenuVisibility, toggleRegionMenuVisibility] = useState(false);
    const [historyMenuVisibility, toggleHistoryMenuVisibility] = useState(false);

    // Category, Region, EventData & Markers
    const {category, setCategory} = useCategoryState();
    const [region, setRegion] = useState<TerralertRegion | null>(null);
    const [eventData, setEventData] = useState<TerralertEvent[] | null>(null);
    const [markers, setMarkers] = useState<TerralertMapMarker[]>([])

    // History
    const [comparisonActive, setComparisonActive] = useState(false);
    const [historyTimeFrame, setHistoryTimeFrame] = useState<number[]>([]);

    //-------------------
    // Menus
    //-------
    // Menu Options & Actions
    const categoryOptions: OptionItem[] = [
        {
            iconSize: 40, iconColor: colors.text, iconPath: 'storm', iconLibrary: "MaterialIcons",  label: 'Storms', onPress: () => {
                setCategory("st");
                toggleCategoryMenuVisibility(false);
            }
        },
        {
            iconSize: 40, iconColor: colors.text, iconPath: 'image-broken-variant', iconLibrary: "MaterialCommunityIcons", label: 'Earthquakes', onPress: () => {
                setCategory("ea");
                toggleCategoryMenuVisibility(false);
            }
        },
        {
            iconSize: 40, iconColor: colors.text, iconPath: 'volcano', iconLibrary: "MaterialIcons", label: 'Volcanoes', onPress: () => {
                setCategory("vo");
                toggleCategoryMenuVisibility(false);
            }
        }]

    const regionOptions: OptionItem[] = category.regions.map(region => (
        {
            iconSize: 40, iconColor: colors.text, iconPath: 'map-outline', iconLibrary: "MaterialCommunityIcons", label: region.description, onPress: () => {
                setRegion(region);
                toggleRegionMenuVisibility(false);
            }
        }
    ));

    const actions: MenuActions = {
        changeCategory: () => {
            toggleRegionMenuVisibility(false);
            toggleHistoryMenuVisibility(false);
            toggleCategoryMenuVisibility(v => !v);
        },
        changeRegion: () => {
            toggleCategoryMenuVisibility(false);
            toggleHistoryMenuVisibility(false);
            toggleRegionMenuVisibility(v => !v);
        },
        openHistory: () => {
            toggleCategoryMenuVisibility(false);
            toggleRegionMenuVisibility(false);
            toggleHistoryMenuVisibility(v => !v);
        },
        openSettings: () => console.log("Settings opened"),
    };

    //-------------------
    // Test Data
    //-------
    const parsedEvent: TerralertEvent = parseTerralertEvent(testEvent);
    const marker = geometryToMarkers(parsedEvent.geometry);

    //-------------------
    // Map View Control
    //-------
    const mapRef = useRef<MapView>(null);

    Asset.loadAsync(Object.values(icons));

    const onRegionChange = (region: TerralertRegion | null) => {
        setRegion(region);
    }

    //-------------------
    // Use Effects
    //-------
    useEffect(() => {
        if (region !== null) {
            const coords = regionToBoundingBoxCoords(region);

            mapRef.current?.fitToCoordinates(coords, {
                edgePadding: {top: 0, right: 30, bottom: 80, left: 30},
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

    //-------------------
    // Structure
    //-------
    return(
        <ThemedView style={styles.mainContainer}>

            <ThemedView style={[styles.statusBarContainer, {backgroundColor: colors.background}]}>
                <ThemedView style={[styles.statusBar, {backgroundColor: colors.background, borderColor: colors.text}]}>
                    <ThemedText style={[styles.statusBarText, {color: colors.notification}]}>
                        {"CATEGORY: " + parseCategoryToFullName(category.category).toUpperCase()}
                    </ThemedText>
                    <ThemedText style={[styles.statusBarText, {color: colors.notification}]}>
                        {"REGION: " + (region !== null ? region.description.toUpperCase() : "NONE")}
                    </ThemedText>
                </ThemedView>
                {comparisonActive &&
                    <ThemedView style={[styles.comparisonInfo, {backgroundColor: colors.background, borderColor: colors.text}]}>
                        <TouchableOpacity onPress={() => {setComparisonActive(false)}}>
                            <ThemedText style={[styles.statusBarText, {color: colors.notification, fontSize: 16}]}>
                                TAP HERE TO END COMPARISON
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                }
            </ThemedView>

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
                    }}
                    scrollEnabled={!comparisonActive}
                    zoomEnabled={!comparisonActive}
                    rotateEnabled={!comparisonActive}
                    pitchEnabled={!comparisonActive}
                    onRegionChange={(region, details) => {
                        if(details.isGesture) {
                            onRegionChange(null)
                        }
                    }}>
                    {markers.map((m, index) => (
                        <Marker key={index} coordinate={{ latitude: m.latitude, longitude: m.longitude }} title={m.title} description={m.description}>
                            <Image source={m.image} style={{width: 30, height: 30, resizeMode:"contain"}}/>
                        </Marker>
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
                <ThemedView style={[styles.optionsContainer, historyMenuVisibility ? styles.display_true : styles.display_false]}>
                    <HistoryMenu
                        region={region}
                        setRegion={setRegion}
                        regions={category.regions}
                        setComparisonActive={setComparisonActive}
                        setHistoryTimeFrame={setHistoryTimeFrame}
                        toggleHistoryMenuVisibility={toggleHistoryMenuVisibility}
                    />
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

    statusBarContainer: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.0)",
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 100,
        height: 'auto',
        flexDirection: "column",
        paddingTop: '15%'
    },

    statusBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderTopWidth: 0.2,
        borderBottomWidth: 1,
        height: 'auto'
    },

    comparisonInfo: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderTopWidth: 0.2,
        borderBottomWidth: 1,
        height: 'auto'
    },

    statusBarText: {
        fontWeight: "bold",
        fontSize: 12,
        marginHorizontal: 5,
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