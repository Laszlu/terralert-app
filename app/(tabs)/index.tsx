import {Animated, Platform, StyleSheet, View} from 'react-native';

import {HelloWave} from '@/components/hello-wave';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Link} from 'expo-router';
import ScrollView = Animated.ScrollView;
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Google} from "@expo/config-plugins/build/ios";

export default function HomeScreen() {
    return (
        <ScrollView style={styles.mainContainer}  contentContainerStyle={{alignItems:"center", justifyContent:"center"}} >
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
                <ThemedText>
                    {`When you're ready, run `}
                    <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
                    <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
                    <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
                    <ThemedText type="defaultSemiBold">app-example</ThemedText>.
                </ThemedText>
            </ThemedView>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                </MapView>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    mainContainer: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 50,
        paddingBottom: 30,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    mapContainer: {
        flex: 1,
        position: "relative"
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
