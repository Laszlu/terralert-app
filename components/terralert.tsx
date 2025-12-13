import 'react-native-reanimated';
import {ThemedView} from "@/components/themed-view";
import {StyleSheet, TouchableOpacity} from "react-native";
import MapView, {Marker, Polyline, PROVIDER_GOOGLE,} from "react-native-maps";
import {OptionsStack, OptionItem} from "@/components/option-stack";
import {useEffect, useRef, useState} from "react";

import testEvent from '../model/TestEvent.json'
import {TerralertEvent} from "@/model/event";
import {
    geometryToMarkers,
    getMarkersForEvents, getMarkersForHistoryEvents, getPolylineForEventWithColor,
    parseTerralertEvent,
    TerralertMapMarker, TerralertPolyLine
} from "@/helper/terralert-event-helper";
import {icons, parseCategoryToFullName} from "@/helper/ui-helper";
import {getCurrentEvents, getEventsByCategoryRegionAndYear} from "@/api/terralert-client";
import {regionToBoundingBoxCoords, TerralertRegion} from "@/helper/terralert-region-helper";
import {MenuActions, MenuBar} from "@/components/menu-bar";
import {useCategoryState} from "@/components/category-state-context";
import {ThemedText} from "@/components/themed-text";
import {Asset} from "expo-asset";
import {HistoryMenu} from "@/components/history-menu";
import {IconComponent} from "@/components/icon-component";
import {HistoryLegend} from "@/components/history-legend";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {SettingsMenu} from "@/components/settings-menu";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";
import {getCurrentLocation, TerralertLocation} from "@/hooks/use-geolocation";

export default function Terralert() {
    //-------------------
    // Visual Setup
    //-------
    const { colors } = useMyTheme();
    const responsiveScaling = useResponsiveScaling();

    //-------------------
    // States
    //-------
    // General app states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    //const {location, locationError, locationLoading} = useGeolocation(); // continuous tracking hook
    const [location, setLocation] = useState<TerralertLocation | null>(null);

    // Menus
    const [categoryMenuVisibility, toggleCategoryMenuVisibility] = useState(false);
    const [regionMenuVisibility, toggleRegionMenuVisibility] = useState(false);
    const [historyMenuVisibility, toggleHistoryMenuVisibility] = useState(false);
    const [settingsMenuVisibility, toggleSettingsMenuVisibility] = useState(false);

    // Category, Region, EventData & Markers
    const {category, setCategory} = useCategoryState();
    const [region, setRegion] = useState<TerralertRegion | null>(null);
    const [eventData, setEventData] = useState<TerralertEvent[] | null>(null);
    const [markers, setMarkers] = useState<TerralertMapMarker[]>([]);
    const [currentEventLines, setCurrentEventLines] = useState<TerralertPolyLine[]>([]);

    // History
    const [comparisonActive, setComparisonActive] = useState(false);
    const [historyTimeFrame, setHistoryTimeFrame] = useState<number[]>([]);
    const [historyEventArrays, setHistoryEventArrays] = useState<TerralertEvent[][] | null>(null);
    const [historyMarkers, setHistoryMarkers] = useState<TerralertMapMarker[]>([]);
    const [historyPolylines, setHistoryPolylines] = useState<TerralertPolyLine[]>([]);

    //Settings


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
            toggleSettingsMenuVisibility(false);
            toggleCategoryMenuVisibility(v => !v);
        },
        changeRegion: () => {
            toggleCategoryMenuVisibility(false);
            toggleHistoryMenuVisibility(false);
            toggleSettingsMenuVisibility(false);
            toggleRegionMenuVisibility(v => !v);
        },
        openHistory: () => {
            toggleCategoryMenuVisibility(false);
            toggleRegionMenuVisibility(false);
            toggleSettingsMenuVisibility(false);
            toggleHistoryMenuVisibility(v => !v);
        },
        openSettings: () => {
            toggleCategoryMenuVisibility(false);
            toggleRegionMenuVisibility(false);
            toggleHistoryMenuVisibility(false);
            toggleSettingsMenuVisibility(v => !v);
        },
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

    const closeAllMenus = () => {
        toggleRegionMenuVisibility(false);
        toggleHistoryMenuVisibility(false);
        toggleSettingsMenuVisibility(false);
        toggleCategoryMenuVisibility(false);
    }

    //-------------------
    // Use Effects
    //-------
    useEffect(() => {
        async function loadLocation() {
            try {
                const loc = await getCurrentLocation();
                console.log(loc.latitude + " " + loc.longitude)
                setLocation(loc);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        }

        loadLocation();
    }, []);

    useEffect(() => {
        if (region !== null) {
            const coords = regionToBoundingBoxCoords(region);

            mapRef.current?.fitToCoordinates(coords, {
                edgePadding: {
                    top: responsiveScaling.scale(50),
                    right: responsiveScaling.scale(80),
                    bottom: responsiveScaling.scale(80),
                    left: responsiveScaling.scale(80)
                },
                animated: true,
            });
        }
    }, [region, responsiveScaling]);

    useEffect(() => {
        async function load() {
            try {
                console.log("Loading events for Category: ", category.category);
                const events = await getCurrentEvents(category);
                setEventData(events);
                if(!comparisonActive) {
                    setRegion(null);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [category, comparisonActive])

    useEffect( () => {
        if (eventData != null && !comparisonActive) {
            setMarkers(getMarkersForEvents(eventData))
            let eventPolyLines: TerralertPolyLine[] = [];
            eventData.forEach(event => {
                const poly = getPolylineForEventWithColor(event, 6);
                if(poly) {
                    eventPolyLines.push(poly);
                }
            })
            setCurrentEventLines(eventPolyLines);
        }
    }, [eventData, comparisonActive])

    useEffect(() => {
        async function load() {
            try {
                let eventArrays: TerralertEvent[][] = []
                for (const year of historyTimeFrame) {
                    const eventsForYear = await getEventsByCategoryRegionAndYear(category, region!, year);
                    eventArrays.push(eventsForYear);
                }
                setHistoryEventArrays(eventArrays);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        if(comparisonActive) {
            console.log("loading Comparison data");
            load();
        }

    }, [historyTimeFrame, comparisonActive, category, region]);

    useEffect(() => {
        if(historyEventArrays != null && comparisonActive) {
            let historyMarkers: TerralertMapMarker[] = [];
            let historyPolylines: TerralertPolyLine[] = [];
            historyEventArrays.forEach((eventArray, index) => {
                let markers = getMarkersForHistoryEvents(eventArray, index);
                historyMarkers.push(...markers);

                eventArray.forEach(event => {
                    const poly = getPolylineForEventWithColor(event, index);
                    if (poly) {
                        historyPolylines.push(poly);
                    }
                });
            });
            setHistoryMarkers(historyMarkers);
            setHistoryPolylines(historyPolylines);
        }
    }, [historyEventArrays, comparisonActive]);

    const activeMarkers = comparisonActive ? historyMarkers : markers;

    //-------------------
    // Structure
    //-------
    return(
        <ThemedView style={styles.mainContainer}>

            <ThemedView style={[
                styles.statusBarContainer,
                    {
                    backgroundColor: colors.background,
                    paddingTop: responsiveScaling.scale(60)
                }]}>
                <ThemedView style={[
                    styles.statusBar,
                    {
                        backgroundColor: colors.background,
                        paddingHorizontal: responsiveScaling.scale(5)
                    }]}>
                    <ThemedText style={[
                        styles.statusBarText,
                        {
                            color: colors.notification,
                            marginHorizontal: responsiveScaling.scale(5),
                            fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 13),
                        }]}>
                        {"CATEGORY: " + parseCategoryToFullName(category.category).toUpperCase()}
                    </ThemedText>
                    <ThemedText style={[
                        styles.statusBarText,
                        {
                            color: colors.notification,
                            marginHorizontal: responsiveScaling.scale(5),
                            fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 13),
                        }]}>
                        {"EVENTS: " + (eventData != null ? eventData.length : "0")}
                    </ThemedText>
                </ThemedView>
                <ThemedView
                    style={[styles.statusBar,
                        {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            borderBottomWidth: (comparisonActive ? 0 : 1),
                            paddingBottom: responsiveScaling.scale(2),
                            paddingHorizontal: responsiveScaling.scale(5),
                        }]}
                >
                    <ThemedText style={[
                        styles.statusBarText,
                        {
                            color: colors.notification,
                            marginHorizontal: responsiveScaling.scale(5),
                            fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 13),
                        }]}>
                        {"REGION: " + (region !== null ? region.description.toUpperCase() : "NONE")}
                    </ThemedText>
                </ThemedView>
                {comparisonActive &&
                    <ThemedView style={[
                        styles.comparisonInfo,
                        {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            paddingVertical: responsiveScaling.scale(2),
                            paddingHorizontal: responsiveScaling.scale(5),
                        }]}>
                        <TouchableOpacity onPress={() => {setComparisonActive(false); onRegionChange(null);}}>
                            <ThemedText style={[
                                styles.statusBarText,
                                {
                                    color: colors.notification,
                                    fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                                    marginHorizontal: responsiveScaling.scale(5),
                                }]}>
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
                    region={{
                        latitude: location ? location?.latitude : -25,
                        longitude: location ? location?.longitude : -165,
                        latitudeDelta: 30,
                        longitudeDelta: 60,
                    }}

                    onRegionChange={(region, details) => {
                        if(details.isGesture && !comparisonActive) {
                            onRegionChange(null)
                        }
                    }}
                    onPress={closeAllMenus}
                >
                    {location &&
                        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude}}>
                        </Marker>
                    }
                    {activeMarkers.map((m, index) => (
                        <Marker
                            pinColor={comparisonActive ? m.color : undefined}
                            key={index}
                            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
                            title={m.title}
                            description={m.description}
                        >
                            {!comparisonActive && m.icon && (
                                <IconComponent library={m.icon.iconLibrary} name={m.icon.iconName} size={30} color={m.color}/>
                            )}
                            {comparisonActive && m.icon && (
                                <IconComponent library={m.icon.iconLibrary} name={m.icon.iconName} size={30} color={m.color}/>
                            )}
                        </Marker>
                    ))}
                    {!comparisonActive && category.category === "st" && currentEventLines.map((poly, index) => (
                        <Polyline
                            key={`poly-${index}`}
                            coordinates={poly.coordinates}
                            strokeColor={poly.color}
                            strokeWidth={5}
                        />
                    ))}
                    {comparisonActive && historyPolylines.map((poly, index) => (
                        <Polyline
                            key={`poly-${index}`}
                            coordinates={poly.coordinates}
                            strokeColor={poly.color}
                            strokeWidth={5}
                        />
                    ))}
                </MapView>
            </ThemedView>

            <ThemedView style={[
                styles.menuBarContainer,
                {
                    borderColor: colors.border
                }]}>
                <ThemedView style={[
                    styles.legendContainer,
                    comparisonActive ? styles.display_true : styles.display_false,
                    {
                        justifyContent: 'flex-start',
                        backgroundColor: colors.background,
                        borderColor: colors.border
                    }]}>
                    <HistoryLegend years={historyTimeFrame}/>
                </ThemedView>
                <ThemedView style={[
                    styles.optionsContainer,
                    categoryMenuVisibility ? styles.display_true : styles.display_false
                ]}>
                    <OptionsStack options={categoryOptions}/>
                </ThemedView>
                <ThemedView style={[
                    styles.optionsContainer,
                    regionMenuVisibility ? styles.display_true : styles.display_false
                ]}>
                    <OptionsStack options={regionOptions}/>
                </ThemedView>
                <ThemedView style={[
                    styles.optionsContainer,
                    settingsMenuVisibility ? styles.display_true : styles.display_false
                ]}>
                    <SettingsMenu/>
                </ThemedView>
                <ThemedView style={[
                    styles.optionsContainer,
                    historyMenuVisibility ? styles.display_true : styles.display_false
                ]}>
                    <HistoryMenu
                        region={region}
                        setRegion={setRegion}
                        regions={category.regions}
                        setComparisonActive={setComparisonActive}
                        setHistoryTimeFrame={setHistoryTimeFrame}
                        toggleHistoryMenuVisibility={toggleHistoryMenuVisibility}
                    />
                </ThemedView>
                <MenuBar
                    actions={actions}
                    disabled={comparisonActive}
                    categoryOpened={categoryMenuVisibility}
                    regionOpened={regionMenuVisibility}
                    historyOpened={historyMenuVisibility}
                    settingsOpened={settingsMenuVisibility}
                />
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
        flexDirection: "column"
    },

    statusBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 'auto'
    },

    comparisonInfo: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderTopWidth: 0.2,
        height: 'auto'
    },

    statusBarText: {
        fontWeight: "bold"
    },

    mapContainer: {
        flex: 1,
        position: "relative"
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },

    legendContainer: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 0.2,
    },

    optionsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0)",
    },

    menuBarContainer: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.0)",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 100,
        height: 'auto',
        borderTopWidth: 1
    },
});