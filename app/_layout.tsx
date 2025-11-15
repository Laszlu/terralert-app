import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/use-color-scheme';
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";
import {Animated, StyleSheet, useWindowDimensions, View} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE, LatLng} from "react-native-maps";
import ThemedButton from "@/components/themed-button";
import OptionsStack from "@/components/option-stack";
import {useState} from "react";

import testEvent from '../model/TestEvent.json'
import {TerralertEvent} from "@/model/Event";
import {geometryToMarkers, parseTerralertEvent} from "@/model/TerralertEventHelper";


export default function RootLayout() {
    const colorScheme = useColorScheme();
    const {height, width, scale, fontScale} = useWindowDimensions();

    const [menuVisibility, toggleMenuVisibility] = useState(false);

    const parsedEvent: TerralertEvent = parseTerralertEvent(testEvent);

    const terralertCoordinates = parsedEvent.geometry[0].coordinates[0];

    let coordinates: any = null

    if (terralertCoordinates.pointCoordinates != null) {
        coordinates = terralertCoordinates.pointCoordinates;
    } else if (terralertCoordinates.polygonCoordinates != null) {
        coordinates = terralertCoordinates.polygonCoordinates;
    }

    const latLng: LatLng = coordinates;

    const marker = geometryToMarkers(parsedEvent.geometry);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <ThemedView style={styles.mainContainer}>
                <ThemedView style={[styles.optionsContainer, menuVisibility ? styles.display_true : styles.display_false]}>
                    <OptionsStack options={[
                        {iconSize: 50, iconColor: '#808080', iconPath: 'option', label: 'Option 1', onPress: () => console.log("Option 1 pressed")},
                        {iconSize: 50, iconColor: '#808080', iconPath: 'option', label: 'Option 2', onPress: () => console.log("Option 2 pressed")},
                        {iconSize: 50, iconColor: '#808080', iconPath: 'option', label: 'Option 3', onPress: () => console.log("Option 3 pressed")},
                        {iconSize: 50, iconColor: '#808080', iconPath: 'option', label: 'Option 4', onPress: () => console.log("Option 4 pressed")},
                    ]}/>
                </ThemedView>

                <ThemedView style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: 10,
                            longitude: 140,
                            latitudeDelta: 30,
                            longitudeDelta: 20,
                        }}>
                        {marker.map((m, index) => (
                            <Marker key={index} coordinate={{ latitude: m.latitude, longitude: m.longitude }} title={m.title} description={m.description}/>
                        ))}
                    </MapView>
                </ThemedView>

                <ThemedView style={styles.menuBarContainer}>
                    <ThemedView style={styles.menuBar}>
                        <ThemedButton title={"Btn1"} onPress={() => {toggleMenuVisibility(!menuVisibility)}}></ThemedButton>
                        <ThemedButton title={"Btn2"} onPress={() => {}}></ThemedButton>
                        <ThemedButton title={"Btn3"} onPress={() => {}}></ThemedButton>
                        <ThemedButton title={"Btn4"} onPress={() => {}}></ThemedButton>
                    </ThemedView>
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
        position: "absolute",
        width: "100%",
        top: 0,
        left: 0,
        paddingHorizontal: 0,
        flexDirection: "row",
        zIndex: 100,
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
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "rgba(240,240,240,1)", // sample bg to visualize
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        width: "95%",
        padding: 30,
        borderRadius: 10,
    },

    mapContainer: {
        flex: 1,
        position: "relative"
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
