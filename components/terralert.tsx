import 'react-native-reanimated';
import {ThemedView} from "@/components/themed-view";
import {ActivityIndicator, Platform, Pressable, StyleSheet} from "react-native";
import MapView, {Callout, Marker, Polyline, PROVIDER_GOOGLE, Polygon} from "react-native-maps";
import {OptionItem, OptionsStack} from "@/components/option-stack";
import {useEffect, useMemo, useRef, useState} from "react";

import testEvent from '../model/TestEvent.json'
import {TerralertEvent, TerralertEventListByYear} from "@/model/event";
import {
    geometryToMarkers,
    getMarkersForEvents,
    getMarkersForHistoryEvents,
    getPolylineForEventWithColor,
    parseCategoryStateToDbId,
    parseTerralertEvent,
    TerralertMapMarker,
    TerralertPolyLine
} from "@/helper/terralert-event-helper";
import {icons, LoadingState, parseCategoryToFullName} from "@/helper/ui-helper";
import {
    getRegionCenter,
    getRegionColor,
    getRegionsForCategory, makePolygonCoords,
    regionToBoundingBoxCoords,
    TerralertRegion
} from "@/helper/terralert-region-helper";
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
import {getEventsByCategory, getEventsForRegionYearCategory, isRegionYearSynced} from "@/repositories/event-repository";
import {useStartupSync} from "@/components/startup-sync-provider";
import {syncRegionYear} from "@/services/event-sync-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CustomCallout} from "@/components/ui/custom-callout";
import {EventDetailView} from "@/components/ui/event-detail-view";
import {HelpView} from "@/components/help-view";

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
    const { isOnline, lastSync } = useStartupSync();
    const [onlineSyncStatus, setOnlineSyncStatus] = useState<string>("");
    const [loading, setLoading] = useState<LoadingState>({
        status: 'idle',
    });
    //const {location, locationError, locationLoading} = useGeolocation(); // continuous tracking hook
    const [location, setLocation] = useState<TerralertLocation | null>(null);
    const [helpOpen, setHelpOpen] = useState(false);

    // Menus
    const [categoryMenuVisibility, toggleCategoryMenuVisibility] = useState(false);
    const [regionMenuVisibility, toggleRegionMenuVisibility] = useState(false);
    const [historyMenuVisibility, toggleHistoryMenuVisibility] = useState(false);
    const [settingsMenuVisibility, toggleSettingsMenuVisibility] = useState(false);
    const [detailViewVisibility, toggleDetailViewVisibility] = useState(false);

    // Category, Region, EventData & Markers
    const {category, setCategory} = useCategoryState();
    const [region, setRegion] = useState<TerralertRegion | null>(null);
    const [eventData, setEventData] = useState<TerralertEvent[] | null>(null);
    const [markers, setMarkers] = useState<TerralertMapMarker[]>([]);
    const [currentEventLines, setCurrentEventLines] = useState<TerralertPolyLine[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<TerralertMapMarker | null>(null);

    // History
    const [comparisonActive, setComparisonActive] = useState(false);
    const [historyTimeFrame, setHistoryTimeFrame] = useState<number[]>([]);
    const [historyEventArrays, setHistoryEventArrays] = useState<TerralertEventListByYear[] | null>(null);
    const [historyMarkers, setHistoryMarkers] = useState<TerralertMapMarker[]>([]);
    const [historyPolylines, setHistoryPolylines] = useState<TerralertPolyLine[]>([]);
    const [activeYears, setActiveYears] = useState<number[]>([])

    //Settings
    const [regionHighlightingEnabled, setRegionHighlightingEnabled] = useState(false);

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
            toggleDetailViewVisibility(false);
            setHelpOpen(false);
            toggleCategoryMenuVisibility(v => !v);
        },
        changeRegion: () => {
            toggleCategoryMenuVisibility(false);
            toggleHistoryMenuVisibility(false);
            toggleSettingsMenuVisibility(false);
            toggleDetailViewVisibility(false);
            setHelpOpen(false);
            toggleRegionMenuVisibility(v => !v);
        },
        openHistory: () => {
            toggleCategoryMenuVisibility(false);
            toggleRegionMenuVisibility(false);
            toggleSettingsMenuVisibility(false);
            toggleDetailViewVisibility(false);
            setHelpOpen(false);
            toggleHistoryMenuVisibility(v => !v);
        },
        openSettings: () => {
            toggleCategoryMenuVisibility(false);
            toggleRegionMenuVisibility(false);
            toggleHistoryMenuVisibility(false);
            toggleDetailViewVisibility(false);
            setHelpOpen(false);
            toggleSettingsMenuVisibility(v => !v);
        },
    };

    const endComparison = () => {
        setComparisonActive(false);
        onRegionChange(null);
        toggleHistoryMenuVisibility(false);
        toggleDetailViewVisibility(false);
        setSelectedMarker(null);
        resetMapToUserLocation();
        setMarkers(prev => [...prev]);
    }

    const handleHelpPressed = () => {
        closeAllMenus();
        setHelpOpen(v => !v);
    }

    //-------------------
    // Test Data
    //-------
    const parsedEvent: TerralertEvent = parseTerralertEvent(testEvent);
    const marker = geometryToMarkers(parsedEvent.geometry);

    //-------------------
    // DEBUG
    //-------
    async function debugAsyncStorage() {
        const keys = await AsyncStorage.getAllKeys();
        console.log('AsyncStorage keys:', keys);

        const entries = await AsyncStorage.multiGet(keys);
        console.log('AsyncStorage entries:', entries);
    }

    useEffect(() => {
        if (__DEV__) {
            debugAsyncStorage()
        }
    }, []);

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

    const handleMarkerPressed = (marker: TerralertMapMarker) => {
        setSelectedMarker(marker);
        toggleDetailViewVisibility(true);
    }

    const resetMapToUserLocation = (animated = true, delta = comparisonActive ? 40 : 30) => {
        if (!location || !mapRef.current) return;

        mapRef.current.animateToRegion(
            {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 30,
                longitudeDelta: 60,
            },
            animated ? 600 : 0
        );
    };

    const moveMapToFirstEvent = (events: TerralertEvent[]) => {
        if (!mapRef.current || events.length === 0) return;

        const firstMarker = getMarkersForEvents([events[0]])[0];
        if (!firstMarker) return;

        mapRef.current.animateToRegion(
            {
                latitude: firstMarker.latitude,
                longitude: firstMarker.longitude,
                latitudeDelta: 110,
                longitudeDelta: 110,
            },
            700
        );
    };

    //-------------------
    // Use Effects
    //-------
    // online status
    useEffect(() => {
        setOnlineSyncStatus(isOnline ? "ONLINE" : "OFFLINE");
    }, [isOnline]);

    useEffect(() => {
        setRegion(null);
        //resetMapToUserLocation();
    }, [category]);

    // loading location
    useEffect(() => {
        async function loadLocation() {
            try {
                const loc = await getCurrentLocation();
                setLocation(loc);
            } catch (e) {
                setLoading({status: "error", message: (e as Error).message});
            } finally {
                setLoading({status: "idle"});
            }
        }

        loadLocation();

        resetMapToUserLocation();
    }, []);

    const mapPadding = useMemo(() => ({
        top: responsiveScaling.scale(50),
        right: responsiveScaling.scale(80),
        bottom: responsiveScaling.scale(80),
        left: responsiveScaling.scale(80),
    }), [responsiveScaling]);

    const categoryRegions = useMemo(
        () => getRegionsForCategory(category.category),
        [category]
    );

    // moving map to region
    useEffect(() => {
        if (region !== null) {
            const coords = regionToBoundingBoxCoords(region);

            mapRef.current?.fitToCoordinates(coords, {
                edgePadding: mapPadding,
                animated: true,
            });
        }
    }, [mapPadding, region]);

    // loading events
    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading({ status: "loading", message: "CATEGORY" });

                await new Promise(resolve => setTimeout(resolve, 0));

                console.log("Loading events for Category: ", category.category);
                const categoryId = parseCategoryStateToDbId(category);
                const events = await getEventsByCategory(categoryId, { onlyOpen: true });

                if (!cancelled) {
                    setEventData(events);
                }
            } catch (e) {
                if (!cancelled) {
                    setLoading({ status: "error", message: (e as Error).message });
                }
            } finally {
                if (!cancelled) {
                    setLoading({ status: "idle" });
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [category, lastSync]);

    // move map to first event after loading
    useEffect(() => {
        if (!eventData) return;
        if (eventData.length === 0) return;
        if (comparisonActive) return;
        if (region !== null) return;

        // Use a timeout to ensure MapView is fully mounted and ready
        const timer = setTimeout(() => {
            if (mapRef.current) {
                moveMapToFirstEvent(eventData);
            } else {
                console.log('MapRef not ready yet');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [eventData, comparisonActive, region, category.category]);

    // loading markers/polylines for events
    useEffect( () => {
        if (eventData != null && !comparisonActive) {

            setLoading({status: "loading", message: "EVENTS"})
            setMarkers(getMarkersForEvents(eventData))

            let eventPolyLines: TerralertPolyLine[] = [];

            eventData.forEach(event => {
                const poly = getPolylineForEventWithColor(event, 2022);
                if(poly) {
                    eventPolyLines.push(poly);
                }
            })
            setCurrentEventLines(eventPolyLines);
            setLoading({status: "idle"})
            //setLoading({status: "error", message: "test test test test test test test test test test test test test test test test test test"})
        }
    }, [eventData, comparisonActive])

    // loading events for comparison
    useEffect(() => {
        if (!comparisonActive || activeYears.length === 0 || !region) return;

        let cancelled = false;

        async function load() {
            try {
                setLoading({status: "loading", message: "COMPARISON EVENTS"});
                console.log("loading comparison events");
                await new Promise(resolve => setTimeout(resolve, 0));

                let categoryId = parseCategoryStateToDbId(category);
                let eventArraysByYear: TerralertEventListByYear[] = []

                for (const yearFromTimeframe of activeYears) {
                    let eventsByYear: TerralertEventListByYear = {
                        year: yearFromTimeframe,
                        events: []
                    }

                    let regionYearSynced = await isRegionYearSynced(region!, yearFromTimeframe, categoryId);

                    if (!regionYearSynced) {
                        console.log("syncing region and year: " + region!.name + " " + yearFromTimeframe)
                        await syncRegionYear(region!, yearFromTimeframe, category);
                    }

                    eventsByYear.events = await getEventsForRegionYearCategory(region!, yearFromTimeframe, categoryId)

                    if (eventsByYear.events.length === 0) {
                        console.warn(`No events for year ${yearFromTimeframe}, skipping`);
                        continue;
                    }

                    eventArraysByYear.push(eventsByYear);
                }

                if (!cancelled) {
                    setHistoryEventArrays(eventArraysByYear);
                }
            } catch (e) {
                if (!cancelled) {
                    setLoading({ status: "error", message: (e as Error).message });
                }
            } finally {
                if (!cancelled) {
                    console.log("syncing comparison done")
                    setLoading({ status: "idle" });
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [comparisonActive, category, region, activeYears]);

    // loading markers/polylines for comparison
    useEffect(() => {
        if(historyEventArrays != null && comparisonActive) {

            let historyMarkers: TerralertMapMarker[] = [];
            let historyPolylines: TerralertPolyLine[] = [];

            historyEventArrays.forEach((eventArray, index) => {
                if (eventArray.events.length !== 0) {
                    let markers = getMarkersForHistoryEvents(eventArray.events, eventArray.year);
                    historyMarkers.push(...markers);

                    eventArray.events.forEach(event => {
                        const poly = getPolylineForEventWithColor(event, eventArray.year);

                        if (poly) {
                            historyPolylines.push(poly);
                        }
                    });
                }
            });

            setHistoryMarkers(historyMarkers);
            setHistoryPolylines(historyPolylines);
        }
    }, [historyEventArrays, comparisonActive]);

    // clear comparison data on year change
    useEffect(() => {
        if (!comparisonActive) return;

        // Clear old data immediately
        setHistoryEventArrays(null);
        setHistoryMarkers([]);
        setHistoryPolylines([]);
    }, [activeYears]);

    const activeMarkers =
        comparisonActive && historyEventArrays?.length
            ? historyMarkers
            : !comparisonActive
                ? markers
                : [];

    //-------------------
    // Structure
    //-------
    return(
        <ThemedView style={styles.mainContainer}>

            <ThemedView style={[
                styles.statusBarContainer,
                {}
            ]}>
                <ThemedView style={[
                    styles.statusBar,
                    {
                        backgroundColor: colors.background,
                        paddingHorizontal: responsiveScaling.scale(5),
                        paddingTop: (Platform.OS === 'ios' ? responsiveScaling.scale(60) : responsiveScaling.scale(30))
                    }]}>
                    <ThemedText style={[
                        styles.statusBarText,
                        {
                            color: colors.text,
                            marginHorizontal: responsiveScaling.scale(5),
                            fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 13),
                        }]}>
                        {"CATEGORY: " + parseCategoryToFullName(category.category).toUpperCase()}
                    </ThemedText>
                    <ThemedText style={[
                        styles.statusBarText,
                        {
                            color: colors.text,
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
                            paddingBottom: responsiveScaling.scale(2),
                            paddingHorizontal: responsiveScaling.scale(5),
                        }]}
                >
                    <ThemedText style={[
                        styles.statusBarText,
                        {
                            color: colors.text,
                            marginHorizontal: responsiveScaling.scale(5),
                            fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 13),
                        }]}>
                        {"REGION: " + (region !== null ? region.description.toUpperCase() : "NONE")}
                    </ThemedText>
                    <ThemedText style={[
                        styles.statusBarText,
                        {
                            color: colors.text,
                            marginHorizontal: responsiveScaling.scale(5),
                            fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 13),
                        }
                    ]}
                    >
                        {onlineSyncStatus}
                    </ThemedText>
                </ThemedView>
                <ThemedView style={[
                    styles.helpBar,
                    {
                        backgroundColor: 'rgba(0,0,0,0)',
                        padding: responsiveScaling.scale(5),
                    }
                ]}>
                    <Pressable
                        onPress={handleHelpPressed}
                    style={({pressed}) => [
                        {
                            width: 'auto',
                            height: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 100,
                            backgroundColor: colors.text,
                            transform: [{ scale: pressed ? 0.96 : 1 }],
                            //opacity: pressed && Platform.OS === 'ios' ? 0.7 : 1,
                        }
                    ]}>
                        <IconComponent library={'MaterialIcons'} name={'help'} color={ colors.background} size={40}/>
                    </Pressable>
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.mapContainer}>
                {(loading.status === "loading" || loading.status === "error") &&
                    <ThemedView style={[
                        styles.loadingSpinnerBackground
                    ]}>
                        {loading.status === "loading" &&
                            <ThemedView style={[
                                styles.loadingSpinnerContainer,
                                {
                                    width: responsiveScaling.scale(250),
                                    height: "auto",
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                    paddingHorizontal: responsiveScaling.scale(20),
                                    paddingVertical: responsiveScaling. scale(60)
                                }
                            ]}>
                                <ActivityIndicator size={"large"}/>
                                <ThemedText style={[
                                    {
                                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                                        fontWeight: "bold",
                                        marginTop: responsiveScaling.scale(20),
                                    }
                                ]}
                                >
                                    {"LOADING " + loading.message + "..."}
                                </ThemedText>
                            </ThemedView>
                        }

                        {loading.status === "error" &&
                            <ThemedView style={[
                                styles.loadingSpinnerContainer,
                                {
                                    width: responsiveScaling.scale(250),
                                    height: "auto",
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                    paddingHorizontal: responsiveScaling.scale(20),
                                    paddingVertical: responsiveScaling. scale(40)

                                }
                            ]}>
                                <IconComponent library={"MaterialIcons"} name={"error"} size={40} color={colors.text}></IconComponent>
                                <ThemedText style={[
                                    {
                                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                                        fontWeight: "bold",
                                        marginTop: responsiveScaling.scale(20),
                                    }
                                ]}>
                                    ERROR OCCURED:
                                </ThemedText>
                                <ThemedText style={[
                                    {
                                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                                        fontWeight: "bold",
                                        marginTop: responsiveScaling.scale(10),
                                        textAlign: "center"
                                    }
                                ]}>
                                    {loading.message.toUpperCase()}
                                </ThemedText>
                                <ThemedText style={[
                                    {
                                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                                        fontWeight: "bold",
                                        marginTop: responsiveScaling.scale(20),
                                    }
                                ]}>
                                    PLEASE RETRY
                                </ThemedText>
                            </ThemedView>
                        }

                    </ThemedView>
                }

                <MapView
                    style={styles.map}
                    key={`map-${category.category}`}
                    provider={PROVIDER_GOOGLE}
                    ref={mapRef}
                    customMapStyle={[
                        {
                            featureType: "poi",
                            elementType: "all",
                            stylers: [{ visibility: "off" }],
                        }
                    ]}
                    maxZoomLevel={5}
                    initialRegion={{
                        latitude: location ? location?.latitude : -25,
                        longitude: location ? location?.longitude : -165,
                        latitudeDelta: 30,
                        longitudeDelta: 60,
                    }}

                    onRegionChange={(region, details) => {
                        if(details.isGesture && !comparisonActive) {
                            onRegionChange(null);
                        }
                    }}
                    onPress={() =>{
                        if(detailViewVisibility) {
                            toggleDetailViewVisibility(false);
                            return;
                        }
                        closeAllMenus()
                    }}
                >
                    {location &&
                        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude}}>
                        </Marker>
                    }
                    {activeMarkers.map((m, index) => (
                        <Marker
                            pinColor={comparisonActive ? m.color : undefined}
                            key={`marker-${m.year}-${m.event?.id ?? index}`}
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

                            <Callout tooltip={true} onPress={() => {
                                handleMarkerPressed(m);
                            }}>
                                <CustomCallout marker={m}/>
                            </Callout>
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
                    {regionHighlightingEnabled &&
                        categoryRegions.map((r, index) => {
                            const color = getRegionColor(index);
                            const coords = makePolygonCoords(r);

                            if (coords.length === 0) {
                                return null;
                            }

                            return (
                                <Polygon
                                    key={`region-${r.name}`}
                                    coordinates={coords}
                                    strokeColor={color}
                                    fillColor={`${color}10`}
                                    strokeWidth={2}
                                    tappable={false}
                                />
                            );
                        })
                    }
                    {regionHighlightingEnabled &&
                        categoryRegions.map((r, index) => {
                        const color = getRegionColor(index);
                        const center = getRegionCenter(r);
                        if (comparisonActive) return null;
                        return (
                            <Marker
                                key={`region-label-${r.name}`}
                                coordinate={center}
                                anchor={{ x: 0.5, y: 0.5 }}
                                tracksViewChanges={false}
                            >
                                <ThemedView
                                    style={{
                                        backgroundColor: "rgba(0,0,0,0.2)",
                                        paddingHorizontal: responsiveScaling.scale(6),
                                        paddingVertical: responsiveScaling.scale(3),
                                        borderRadius: 10,
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            color: `${color}90`,
                                            fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 12 : 10),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {r.description.toUpperCase()}
                                    </ThemedText>
                                </ThemedView>
                            </Marker>
                        );
                    })}
                </MapView>
            </ThemedView>

            <ThemedView style={[
                styles.menuBarContainer,
                {
                    borderColor: colors.border
                }]}>
                <ThemedView style={[
                    styles.helpContainer,
                    helpOpen ? styles.display_true : styles.display_false,
                    {
                        backgroundColor: colors.background,
                    }
                ]}>
                    <HelpView setHelpOpen={setHelpOpen}/>
                </ThemedView>
                <ThemedView style={[
                    styles.optionsContainer,
                    detailViewVisibility ? styles.display_true : styles.display_false
                ]}>
                    {selectedMarker &&
                        <EventDetailView marker={selectedMarker} setDetailOpen={toggleDetailViewVisibility}/>
                    }
                </ThemedView>
                <ThemedView style={[
                    styles.legendContainer,
                    comparisonActive ? styles.display_true : styles.display_false,
                    {
                        justifyContent: 'flex-start',
                        backgroundColor: colors.background,
                    }]}>
                    <HistoryLegend
                        years={historyTimeFrame}
                        activeYears={activeYears}
                        setActiveYears={setActiveYears}
                        endComparison={endComparison}
                        historyMenuVisibility={historyMenuVisibility}/>
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
                    <SettingsMenu
                        setRegionHighlightingEnabled={setRegionHighlightingEnabled}
                        regionHighlightingEnabled={regionHighlightingEnabled}/>
                </ThemedView>
                <ThemedView style={[
                    styles.optionsContainer,
                    historyMenuVisibility ? styles.display_true : styles.display_false
                ]}>
                    <HistoryMenu
                        region={region}
                        setRegion={setRegion}
                        regions={category.regions}
                        comparisonActive={comparisonActive}
                        setComparisonActive={setComparisonActive}
                        setHistoryTimeFrame={setHistoryTimeFrame}
                        toggleHistoryMenuVisibility={toggleHistoryMenuVisibility}
                        setActiveYears={setActiveYears}
                        endComparison={endComparison}
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

    helpBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        height: 'auto'
    },

    comparisonInfo: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 'auto'
    },

    statusBarText: {
        fontWeight: "bold"
    },

    loadingSpinnerBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 99,
        alignItems: "center",
        justifyContent: "center",
    },

    loadingSpinnerContainer: {
        borderRadius: 10,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
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
    },

    helpContainer: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
    },
});