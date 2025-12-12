import {StyleSheet, View} from "react-native";
import {useTheme} from "@react-navigation/native";
import {ThemedText} from "@/components/themed-text";
import Dropdown, {DropdownItem} from "@/components/dropdown";
import {MIN_YEAR} from "@/constants/constants";
import React, {useState} from "react";
import {TerralertRegion} from "@/helper/terralert-region-helper";
import ThemedButton from "@/components/themed-button";
import {useCategoryState} from "@/components/category-state-context";
import {parseCategoryToFullName} from "@/helper/ui-helper";
import {useMyTheme} from "@/hooks/useCustomTheme";

export type HistoryMenuProps = {
    regions: TerralertRegion[];
    region: TerralertRegion | null;
    setRegion: React.Dispatch<React.SetStateAction<TerralertRegion | null>>;
    setComparisonActive: React.Dispatch<React.SetStateAction<boolean>>;
    toggleHistoryMenuVisibility:  React.Dispatch<React.SetStateAction<boolean>>;
    setHistoryTimeFrame: React.Dispatch<React.SetStateAction<number[]>>;
}

export function HistoryMenu(props: HistoryMenuProps) {
    const {colors} = useMyTheme()
    const {category, setCategory} = useCategoryState();

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

    let selectableRegions: DropdownItem[] = [];
    props.regions.forEach((region) => {
        let regionItem: DropdownItem = {
            label: region.description,
            value: region.name
        }
        selectableRegions.push(regionItem);
    })

    const [historyRegion, setHistoryRegion] = useState<TerralertRegion | null>(null);

    const handleRegionSelected = (regionItem: DropdownItem) => {
        let convertedRegion = props.regions.find(region => region.name === regionItem.value);
        if(convertedRegion !== undefined) {
            setHistoryRegion(convertedRegion);
        }
    }

    const [validComparison, setValidComparison] = useState(true);

    const startComparison = () => {

        const yearStartValue = yearStart.value as number;
        const yearEndValue = yearEnd.value as number;

        const comparisonYears = Array.from(
            {length: yearEndValue - yearStartValue + 1},
            (_, i) => yearStartValue + i
        );

        if (historyRegion !== null && yearStartValue !== 0 && yearEndValue !== 0) {
            props.setHistoryTimeFrame(comparisonYears);
            props.setRegion(historyRegion);
            props.setComparisonActive(true);
            props.toggleHistoryMenuVisibility(false);
        }
        else {
            setValidComparison(false);
        }
    }

    return(
        <View style={[styles.historyMenuView, {backgroundColor: colors.background, borderColor: colors.border}]}>
            <View style={[styles.historyMenuHeader]}>
                <ThemedText style={[styles.historyMenuText]}>
                    Historical Comparison
                </ThemedText>
                {!validComparison && <ThemedText style={[styles.historyMenuErrorText, {}]}>VALUES FOR COMPARISON ARE MISSING</ThemedText>}
            </View>
            <View style={[styles.historyMenuRow]}>
                <ThemedText style={[styles.historyMenuText, {width: '30%'}]}>CATEGORY:</ThemedText>
                <ThemedText style={[styles.historyMenuText]}>{parseCategoryToFullName(category.category).toUpperCase()}</ThemedText>
            </View>
            <View style={[styles.historyMenuRow]}>
                <ThemedText style={[styles.historyMenuText, {width: '30%'}]}>TIMEFRAME:</ThemedText>
                <Dropdown
                    items={possibleStartYearItems}
                    onChange={(selectedYear) => {handleYearSelected(selectedYear, yearEnd)}}
                    value={yearStart.value}
                    placeholder={'START'}
                />
                <ThemedText style={[styles.historyMenuText]}> - </ThemedText>
                <Dropdown
                    items={possibleEndYearItems}
                    onChange={(selectedYear) => {handleYearSelected(yearStart, selectedYear)}}
                    value={yearEnd.value}
                    placeholder={'END'}
                />
            </View>
            <View style={[styles.historyMenuRow]}>
                <ThemedText style={[styles.historyMenuText, {width: '30%'}]}>REGION:</ThemedText>
                <Dropdown
                    items={selectableRegions}
                    onChange={(selectedRegion) => handleRegionSelected(selectedRegion)}
                    value={historyRegion ? historyRegion.name : ""}
                    placeholder={'REGION'}
                />
            </View>
            <View style={[styles.historyMenuHeader]}>
                <ThemedButton title={'START COMPARISON'} iconName={'history'} iconLibrary={"MaterialIcons"} onPress={() => {startComparison()}} disabled={false} selected={false}/>
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
        borderTopWidth: 1,
        borderBottomWidth: 0.5,
        paddingVertical: 10,
    },

    historyMenuText: {
        fontWeight: "bold",
        fontSize: 16,
        marginHorizontal: 5,
    },

    historyMenuErrorText: {
        fontWeight: "bold",
        fontSize: 12,
        marginHorizontal: 5,
        color: 'red'
    },

    historyMenuHeader: {
        alignItems: "center",
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 10
    },

    historyMenuRow: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        justifyContent: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 15,
    }
})

export default HistoryMenu;