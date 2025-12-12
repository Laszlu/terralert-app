import {useTheme} from "@react-navigation/native";
import {StyleSheet, View} from "react-native";
import IconComponent from "@/components/icon-component";
import {pinColors} from "@/constants/constants";
import {ThemedText} from "@/components/themed-text";
import {useMyTheme} from "@/hooks/useCustomTheme";

export type HistoryLegendProps = {
    years: number[];
}

export function HistoryLegend(props: HistoryLegendProps) {
    const {colors} = useMyTheme();

    return(
        <>
            <View style={[styles.historyLegendView, {backgroundColor: colors.background}]}>
                {props.years.map((year, index) => (
                    <View
                        key={index}
                        style={[styles.historyLegendLineView]}
                    >
                        <IconComponent library={"MaterialCommunityIcons"} name={"rectangle"} size={30} color={pinColors[index]}/>
                        <ThemedText style={[styles.historyLegendText]}>
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
        paddingVertical: 10,
        paddingHorizontal: 30,
    },

    historyLegendLineView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5,
    },

    historyLegendText: {
        fontWeight: "bold",
        fontSize: 16,
    }
})

export default HistoryLegend;