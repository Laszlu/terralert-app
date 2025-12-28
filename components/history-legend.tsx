import {Button, StyleSheet, TouchableOpacity, View} from "react-native";
import {IconComponent} from "@/components/icon-component";
import {pinColors} from "@/constants/constants";
import {ThemedText} from "@/components/themed-text";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";
import React from "react";

export type HistoryLegendProps = {
    years: number[];
    activeYears: number[];
    setActiveYears:  React.Dispatch<React.SetStateAction<number[]>>;
}

export function HistoryLegend(props: HistoryLegendProps) {
    const {colors} = useMyTheme();
    const responsiveScaling = useResponsiveScaling();

    return(
        <>
            <View style={[
                styles.historyLegendView,
                {
                    backgroundColor: colors.background,
                    paddingVertical: responsiveScaling.scale(10),
                    paddingHorizontal: responsiveScaling.scale(30),
                }]}>
                {props.years.map((year, index) => (
                    <View
                        key={index}
                    >
                        <TouchableOpacity
                            style={[
                                styles.historyLegendLineView,
                                {
                                    marginHorizontal: responsiveScaling.scale(10),
                                    marginVertical: responsiveScaling.scale(5),
                                    width: responsiveScaling.scale(80),
                                    borderColor: colors.border,
                                    backgroundColor: colors.text
                                }]}
                            onPress={() => {
                                props.setActiveYears(prev =>
                                    prev.includes(year)
                                        ? prev.filter(y => y !== year)
                                        : [...prev, year].sort((a, b) => a - b)
                                );
                            }}
                        >
                            <IconComponent
                                library={"MaterialCommunityIcons"}
                                name={"rectangle"}
                                size={30}
                                color={props.activeYears.includes(year) ?
                                    pinColors.find(c => c.year === year)!.color :
                                    pinColors.find(c => c.year === 0)!.color}
                            />
                            <ThemedText style={[
                                styles.historyLegendText,
                                {
                                    fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                                    color: colors.background
                                }
                            ]}>
                                {year}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    historyLegendView: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start",
        width: '100%',
    },

    historyLegendLineView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderWidth: 1
    },

    historyLegendText: {
        fontWeight: "bold",
    }
})

