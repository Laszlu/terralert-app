import {StyleSheet, View} from "react-native";
import {useTheme} from "@react-navigation/native";
import {ThemedText} from "@/components/themed-text";
import Dropdown, {DropdownItem} from "@/components/dropdown";
import {MIN_YEAR} from "@/constants/constants";
import {useState} from "react";

export function HistoryMenu() {
    const {colors} = useTheme()

    const today = new Date();
    const currentYear = today.getFullYear();
    let selectableYearDropdownItems: DropdownItem[] = [];
    for (let year = MIN_YEAR; year <= currentYear; year++) {
        let selectableYear: DropdownItem = {label: year.toString(), value: year};
        selectableYearDropdownItems.push(selectableYear);
    }

    const yearZeroItem: DropdownItem = {label: '', value: 0};

    const [yearStart, setYearStart] = useState(yearZeroItem);
    const [yearEnd, setYearEnd] = useState(yearZeroItem);
    const [possibleStartYearItems, setPossibleStartYearItems] = useState(selectableYearDropdownItems);
    const [possibleEndYearItems, setPossibleEndYearItems] = useState(selectableYearDropdownItems);

    const handleYearSelected = (newStart: DropdownItem, newEnd: DropdownItem) => {
        setYearStart(newStart);
        setYearEnd(newEnd);

        setPossibleEndYearItems(
            selectableYearDropdownItems.filter(
                (y) => newStart.value === 0 || y.value > newStart.value
            )
        );

        setPossibleStartYearItems(
            selectableYearDropdownItems.filter(
                (y) => newEnd.value === 0 || y.value < newEnd.value
            )
        );
    }

    return(
        <View style={[styles.historyMenuView, {backgroundColor: colors.background}]}>
            <View style={[styles.historyMenuRow]}>
                <ThemedText style={[styles.historyMenuText]}>
                    Historical Comparison
                </ThemedText>
            </View>
            <View style={[styles.historyMenuRow]}>
                <ThemedText style={[styles.historyMenuText]}>Timeframe:</ThemedText>
                <Dropdown
                    items={possibleStartYearItems}
                    onChange={(selectedYear) => {handleYearSelected(selectedYear, yearEnd)}}
                    value={yearStart.value}
                    placeholder={'Start'}
                />
                <ThemedText style={[styles.historyMenuText]}> - </ThemedText>
                <Dropdown
                    items={possibleEndYearItems}
                    onChange={(selectedYear) => {handleYearSelected(yearStart, selectedYear)}}
                    value={yearEnd.value}
                    placeholder={'End'}
                />
            </View>
            <View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    historyMenuView: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 1,
        paddingVertical: 10,
    },

    historyMenuText: {
        fontWeight: "bold",
        fontSize: 16,
        marginHorizontal: 5,
    },

    historyMenuRow: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        justifyContent: 'space-evenly',
        paddingVertical: 5
    }
})

export default HistoryMenu;