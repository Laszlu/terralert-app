import {useTheme} from "@react-navigation/native";
import {StyleSheet, View} from "react-native";
import IconComponent from "@/components/icon-component";
import {pinColors} from "@/constants/constants";
import {ThemedText} from "@/components/themed-text";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";

export type HistoryLegendProps = {
    years: number[];
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
                        style={[
                            styles.historyLegendLineView,
                            {
                                marginHorizontal: responsiveScaling.scale(5),
                            }]}>
                        <IconComponent library={"MaterialCommunityIcons"} name={"rectangle"} size={30} color={pinColors[index]}/>
                        <ThemedText style={[
                            styles.historyLegendText,
                            {
                                fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                            }
                        ]}>
                            {year}
                        </ThemedText>
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
    },

    historyLegendText: {
        fontWeight: "bold",
    }
})

export default HistoryLegend;