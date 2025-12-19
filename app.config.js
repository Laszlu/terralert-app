export default ({ config }) => ({
    ...config,
    name: "TERRALERT",
    slug: "TERRALERT",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/terralert_icon.png",
    scheme: "terralert",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.laszlu.TERRALERT",
        infoPlist: {
            ITSAppUsesNonExemptEncryption: false,
            NSLocationWhenInUseUsageDescription:
                "This app uses your location to show nearby events.",
        },
    },

    android: {
        adaptiveIcon: {
            backgroundColor: "#E6F4FE",
            foregroundImage: "./assets/images/android-icon-foreground.png",
            backgroundImage: "./assets/images/android-icon-background.png",
            monochromeImage: "./assets/images/android-icon-monochrome.png",
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: "com.laszlu.TERRALERT",
        permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
    },

    web: {
        output: "static",
        favicon: "./assets/images/terralert_icon.png",
    },

    plugins: [
        [
            "react-native-maps",
            {
                iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
            },
        ],
        [
            "expo-sqlite",
            {
                enableFTS: true,
                useSQLCipher: true,
                ios: {
                    customBuildFlags: [
                        "-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1",
                    ],
                },
            },
        ],
        "expo-router",
        [
            "expo-splash-screen",
            {
                image: "./assets/images/splash-icon.png",
                imageWidth: 200,
                resizeMode: "contain",
                backgroundColor: "#ffffff",
                dark: {
                    backgroundColor: "#000000",
                },
            },
        ],
        "expo-sqlite",
    ],

    experiments: {
        typedRoutes: true,
        reactCompiler: true,
    },

    extra: {
        router: {},
        eas: {
            projectId: "09bd4019-ecef-45be-b460-d0ec43699995",
        },
    },
});
