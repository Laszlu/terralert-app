import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";
import {ThemedView} from "@/components/themed-view";
import {Animated, Platform, Pressable, StyleSheet, View} from "react-native";
import {ThemedText} from "@/components/themed-text";
import {IconComponent} from "@/components/icon-component";
import ScrollView = Animated.ScrollView;
import {
    ABOUT_DATA,
    ABOUT_DEV,
    ABOUT_WELCOME, GITHUB_URL,
    HELP_CATEGORY,
    HELP_COMPARISON,
    HELP_REGION,
    HELP_SETTINGS, HELP_UI, MAIL_URL
} from "@/constants/constants";
import React, {useCallback, useState} from "react";
import {Image} from "expo-image";
import * as Linking from "expo-linking";
import Constants from 'expo-constants';

export type HelpViewProps = {
    setHelpOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function HelpView(props: HelpViewProps) {
    const {colors} = useMyTheme();
    const responsiveScaling = useResponsiveScaling();

    const [helpSelected, setHelpSelected] = useState(true);

    const handleMailBtnPressed = useCallback(async () => {
        const supported = await Linking.canOpenURL(MAIL_URL);

        if (supported) {
            await Linking.openURL(MAIL_URL);
        } else {
            console.warn('Cannot open URL: ' + MAIL_URL);
        }
    }, []);

    const handleGitBtnPressed = useCallback(async () => {
        const supported = await Linking.canOpenURL(GITHUB_URL);

        if (supported) {
            await Linking.openURL(GITHUB_URL);
        } else {
            console.warn('Cannot open URL: ' + GITHUB_URL);
        }
    }, []);

    return (
        <ThemedView style={[
            styles.helpViewContainer,
            {
                backgroundColor: colors.background,
                paddingTop: responsiveScaling.scale(20),
                height: responsiveScaling.scale(450)
            }
        ]}>
            <ThemedView style={[
                styles.helpViewHeaderRow,
                {
                    marginBottom: responsiveScaling.scale(10)
                }
            ]}>
                <ThemedView style={[
                    styles.helpViewHeaderContent,
                    {
                        justifyContent: 'flex-end',

                    }
                ]}>
                    <Pressable
                        onPress={() => setHelpSelected(true)}
                        style={({pressed}) => [
                        styles.helpViewHeaderButton,
                        {
                            width: responsiveScaling.scale(100),
                            height: responsiveScaling.scale(25),
                            transform: [{ scale: pressed ? 0.96 : 1 }],
                            opacity: pressed && Platform.OS === 'ios' ? 0.7 : 1,
                            backgroundColor: helpSelected ? colors.text : colors.background,
                            borderRadius: 10
                        }
                    ]}>
                        <ThemedText style={[
                            styles.helpViewHeader,
                            {
                                fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                                color: helpSelected ? colors.background : colors.text
                            }
                        ]}>
                            HELP
                        </ThemedText>
                    </Pressable>
                </ThemedView>
                <ThemedView style={[
                    styles.helpViewHeaderContent,
                    {
                        justifyContent: 'flex-start',

                    }
                ]}>
                    <Pressable
                        onPress={() => setHelpSelected(false)}
                        style={({pressed}) => [
                        styles.helpViewHeaderButton,
                        {
                            width: responsiveScaling.scale(100),
                            height: responsiveScaling.scale(25),
                            transform: [{ scale: pressed ? 0.96 : 1 }],
                            opacity: pressed && Platform.OS === 'ios' ? 0.7 : 1,
                            backgroundColor: helpSelected ? colors.background : colors.text,
                            borderRadius: 10
                        }
                    ]}>
                        <ThemedText style={[
                            styles.helpViewHeader,
                            {
                                fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                                color: helpSelected ? colors.text : colors.background
                            }
                        ]}>
                            ABOUT
                        </ThemedText>
                    </Pressable>
                </ThemedView>

                <Pressable
                    onPress={()=> {props.setHelpOpen(false)}}
                    style={({pressed}) => [
                    {
                        position: 'absolute',
                        top: responsiveScaling.scale(-5),
                        right: responsiveScaling.scale(10),
                        transform: [{ scale: pressed ? 0.96 : 1 }],
                        opacity: pressed && Platform.OS === 'ios' ? 0.7 : 1,
                    }
                ]}>
                    <IconComponent library={'MaterialCommunityIcons'} name={'close-circle'} size={30} color={colors.text}/>
                </Pressable>
            </ThemedView>

            {helpSelected &&
                <ScrollView>
                    <ThemedView style={[
                        styles.helpViewRow,
                        {
                            paddingLeft: responsiveScaling.scale(5),
                            paddingRight: responsiveScaling.scale(20),
                            paddingTop: responsiveScaling.scale(15)
                        }
                    ]}>
                        <ThemedView style={[
                            styles.helpViewRowContentLeft
                        ]}>
                            <IconComponent library={'MaterialIcons'} name={'info'} color={colors.text} size={30} />
                        </ThemedView>
                        <ThemedView style={[
                            styles.helpViewRowContentRight
                        ]}>
                            <ThemedText style={[
                                styles.helpViewText,
                                {
                                    fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 14),
                                    marginLeft: responsiveScaling.scale(5)
                                }
                            ]}>
                                {HELP_UI}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={[
                        styles.helpViewRow,
                        {
                            paddingLeft: responsiveScaling.scale(5),
                            paddingRight: responsiveScaling.scale(20),
                            paddingTop: responsiveScaling.scale(15)
                        }
                    ]}>
                        <ThemedView style={[
                            styles.helpViewRowContentLeft
                        ]}>
                            <IconComponent library={'MaterialIcons'} name={'storm'} color={colors.text} size={30} />
                        </ThemedView>
                        <ThemedView style={[
                            styles.helpViewRowContentRight
                        ]}>
                            <ThemedText style={[
                                styles.helpViewText,
                                {
                                    fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 14),
                                    marginLeft: responsiveScaling.scale(5)
                                }
                            ]}>
                                {HELP_CATEGORY}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={[
                        styles.helpViewRow,
                        {
                            paddingLeft: responsiveScaling.scale(5),
                            paddingRight: responsiveScaling.scale(20),
                            paddingTop: responsiveScaling.scale(15)
                        }
                    ]}>
                        <ThemedView style={[
                            styles.helpViewRowContentLeft
                        ]}>
                            <IconComponent library={'MaterialCommunityIcons'} name={'earth'} color={colors.text} size={30} />
                        </ThemedView>
                        <ThemedView style={[
                            styles.helpViewRowContentRight
                        ]}>
                            <ThemedText style={[
                                styles.helpViewText,
                                {
                                    fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 14),
                                    marginLeft: responsiveScaling.scale(5)
                                }
                            ]}>
                                {HELP_REGION}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={[
                        styles.helpViewRow,
                        {
                            paddingLeft: responsiveScaling.scale(5),
                            paddingRight: responsiveScaling.scale(20),
                            paddingTop: responsiveScaling.scale(15)
                        }
                    ]}>
                        <ThemedView style={[
                            styles.helpViewRowContentLeft
                        ]}>
                            <IconComponent library={'MaterialIcons'} name={'history'} color={colors.text} size={30} />
                        </ThemedView>
                        <ThemedView style={[
                            styles.helpViewRowContentRight
                        ]}>
                            <ThemedText style={[
                                styles.helpViewText,
                                {
                                    fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 14),
                                    marginLeft: responsiveScaling.scale(5)
                                }
                            ]}>
                                {HELP_COMPARISON}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={[
                        styles.helpViewRow,
                        {
                            paddingLeft: responsiveScaling.scale(5),
                            paddingRight: responsiveScaling.scale(20),
                            paddingTop: responsiveScaling.scale(15)
                        }
                    ]}>
                        <ThemedView style={[
                            styles.helpViewRowContentLeft
                        ]}>
                            <IconComponent library={'MaterialIcons'} name={'settings'} color={colors.text} size={30} />
                        </ThemedView>
                        <ThemedView style={[
                            styles.helpViewRowContentRight
                        ]}>
                            <ThemedText style={[
                                styles.helpViewText,
                                {
                                    fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 16 : 14),
                                    marginLeft: responsiveScaling.scale(5)
                                }
                            ]}>
                                {HELP_SETTINGS}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ScrollView>
            }

            {!helpSelected &&
                <ScrollView>
                    <ThemedView style={[
                        styles.aboutViewRow,
                        {
                            paddingHorizontal: responsiveScaling.scale(10),
                            paddingTop: responsiveScaling.scale(15)
                        }
                    ]}>
                        <ThemedText style={[
                            styles.aboutViewText,
                            {
                                fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 20 : 18),
                                marginLeft: responsiveScaling.scale(5),
                                fontWeight: 'bold'
                            }
                        ]}>
                            {ABOUT_WELCOME + "\nVersion " + Constants.expoConfig?.version}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView style={[
                        styles.aboutViewRow,
                        {
                            paddingHorizontal: responsiveScaling.scale(10),
                            paddingTop: responsiveScaling.scale(15)
                        }
                    ]}>
                        <View style={[
                            {
                                width: responsiveScaling.scale(100),
                                height: responsiveScaling.scale(100),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 10,
                                backgroundColor: colors.text
                            }
                        ]}>
                            <Image
                                style={[
                                    {
                                        flex: 1,
                                        width: responsiveScaling.scale(100),
                                        height: responsiveScaling.scale(100),
                                    }
                                ]}
                                source={require("../assets/images/terralert_icon.png")}
                                contentFit={'cover'}
                                transition={1000}
                                allowDownscaling={true}
                            />
                        </View>
                    </ThemedView>

                    <ThemedView style={[
                        styles.aboutViewRow,
                        {
                            paddingHorizontal: responsiveScaling.scale(35),
                            paddingTop: responsiveScaling.scale(15)
                        }
                    ]}>
                        <ThemedText style={[
                            styles.aboutViewText,
                            {
                                fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                                marginLeft: responsiveScaling.scale(5)
                            }
                        ]}>
                            {ABOUT_DEV}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView style={[
                        styles.aboutViewRow,
                        {
                            paddingHorizontal: responsiveScaling.scale(35),
                            paddingTop: responsiveScaling.scale(15),
                            justifyContent: 'space-evenly'
                        }
                    ]}>
                        <Pressable
                            onPress={handleMailBtnPressed}
                            style={({pressed}) => [
                            {
                                transform: [{ scale: pressed ? 0.96 : 1 }],
                                opacity: pressed && Platform.OS === 'ios' ? 0.7 : 1,
                            }
                        ]}>
                            <IconComponent library={'MaterialIcons'} name={'mail'} size={40} color={colors.text} />
                        </Pressable>
                        <Pressable
                            onPress={handleGitBtnPressed}
                            style={({pressed}) => [
                            {
                                transform: [{ scale: pressed ? 0.96 : 1 }],
                                opacity: pressed && Platform.OS === 'ios' ? 0.7 : 1,
                            }
                        ]}>
                            <IconComponent library={'MaterialCommunityIcons'} name={'github'} size={40} color={colors.text} />
                        </Pressable>
                    </ThemedView>

                    <ThemedView style={[
                        styles.aboutViewRow,
                        {
                            paddingHorizontal: responsiveScaling.scale(35),
                            paddingTop: responsiveScaling.scale(15)
                        }
                    ]}>
                        <ThemedText style={[
                            styles.aboutViewText,
                            {
                                fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                                marginLeft: responsiveScaling.scale(5)
                            }
                        ]}>
                            {ABOUT_DATA}
                        </ThemedText>
                    </ThemedView>
                </ScrollView>
            }

        </ThemedView>


    )
}

const styles = StyleSheet.create({
    helpViewContainer: {
        width: '100%',

    },

    helpViewHeaderRow: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },

    helpViewHeaderContent: {
        width: '50%',
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },

    helpViewHeaderButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    helpViewRow: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    helpViewRowContentLeft: {
        width: '15%',
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    helpViewRowContentRight: {
        width: '85%',
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    helpViewHeader: {
        fontWeight: "bold",
    },

    helpViewText: {
        flexWrap: "wrap",
        textAlign: "justify"
    },

    aboutViewRow: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },

    aboutViewText: {
        textAlign: "center"
    }
})