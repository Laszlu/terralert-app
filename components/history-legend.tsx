import {useTheme} from "@react-navigation/native";
import {StyleSheet, View} from "react-native";

export type HistoryLegendProps = {
    years: number[];
}

export function HistoryLegend(props: HistoryLegendProps) {
    const {colors} = useTheme();

    return(
        <View style={[styles.historyLegendView, {backgroundColor: colors.background}]}>
            {props.years.map((year, index) => (
                <View
                key={index}
                >

                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    historyLegendView: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 1,
        paddingVertical: 10,
    },
})

export default HistoryLegend;