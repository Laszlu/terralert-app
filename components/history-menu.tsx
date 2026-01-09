import {StyleSheet, View} from "react-native";
import {ThemedText} from "@/components/themed-text";
import {Dropdown, DropdownItem} from "@/components/dropdown";
import {MIN_YEAR} from "@/constants/constants";
import React, {useEffect, useState} from "react";
import {TerralertRegion} from "@/helper/terralert-region-helper";
import {ThemedButton} from "@/components/themed-button";
import {useCategoryState} from "@/components/category-state-context";
import {parseCategoryToFullName} from "@/helper/ui-helper";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";

export type HistoryMenuProps = {
    regions: TerralertRegion[];
    region: TerralertRegion | null;
    setRegion: React.Dispatch<React.SetStateAction<TerralertRegion | null>>;
    comparisonActive: boolean;
    setComparisonActive: React.Dispatch<React.SetStateAction<boolean>>;
    toggleHistoryMenuVisibility:  React.Dispatch<React.SetStateAction<boolean>>;
    setHistoryTimeFrame: React.Dispatch<React.SetStateAction<number[]>>;
    endComparison: () => void;
}

export function HistoryMenu(props: HistoryMenuProps) {
    const {colors} = useMyTheme();
    const responsiveScaling = useResponsiveScaling();
    const {category, setCategory} = useCategoryState();

    const selectableCategories = React.useMemo<DropdownItem[]>(() => {
        return ["st", "ea"].map(category => ({
            label: parseCategoryToFullName(category).toUpperCase(),
            value: category
        }));
    }, []);

    const handleCategorySelected = (selected: DropdownItem) => {
        if (typeof selected.value == "string") {
            console.log("Category selected: " + selected.value)
            setCategory(selected.value)
        } else {
            console.log(typeof selected.value)
        }
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const selectableYearDropdownItems = React.useMemo<DropdownItem[]>(() => {
        const years: DropdownItem[] = [];
        for (let year = MIN_YEAR; year <= currentYear; year++) {
            years.push({ label: year.toString(), value: year });
        }
        return years;
    }, [currentYear]);

    const getStartYearItems = () => selectableYearDropdownItems;

    const getEndYearItems = () =>
        selectableYearDropdownItems.slice(1);

    const yearZeroItem: DropdownItem = {label: '', value: 0};

    const [yearStart, setYearStart] = useState(yearZeroItem);
    const [yearEnd, setYearEnd] = useState(yearZeroItem);
    const [possibleStartYearItems, setPossibleStartYearItems] = useState(getStartYearItems);
    const [possibleEndYearItems, setPossibleEndYearItems] = useState(getEndYearItems);

    const handleYearSelected = (newStart: DropdownItem, newEnd: DropdownItem) => {
        setYearStart(newStart);
        setYearEnd(newEnd);

        setPossibleEndYearItems(
            selectableYearDropdownItems.filter(
                y => newStart.value === 0 || y.value >= newStart.value
            )
        );

        setPossibleStartYearItems(
            selectableYearDropdownItems.filter(
                y => newEnd.value === 0 || y.value <= newEnd.value
            )
        );
    };

    const selectableRegions = React.useMemo<DropdownItem[]>(() => {
        return props.regions.map(region => ({
            label: region.description,
            value: region.name
        }));
    }, [props.regions]);

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
            setValidComparison(true);
        }
        else {
            setValidComparison(false);
        }
    }

    useEffect(() => {
        if (!props.comparisonActive) {
             resetComparisonValues();
        }
    }, [props.comparisonActive]);

    const resetComparisonValues = () => {
        setYearStart(yearZeroItem);
        setYearEnd(yearZeroItem);

        setPossibleStartYearItems(getStartYearItems());
        setPossibleEndYearItems(getEndYearItems());

        setHistoryRegion(null);
    };

    return(
        <View style={[
            styles.historyMenuView,
            {
                backgroundColor: colors.background,
                paddingVertical: responsiveScaling.scale(10),
            }]}>
            <View style={[
                styles.historyMenuHeader,
                {
                    paddingVertical: responsiveScaling.scale(10)
                }
            ]}>
                <ThemedText style={[
                    styles.historyMenuText,
                    {
                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                        marginHorizontal: responsiveScaling.scale(5),
                    }
                ]}>
                    HISTORICAL COMPARISON
                </ThemedText>
                {!validComparison &&
                    <ThemedText style={[
                        styles.historyMenuErrorText,
                        {
                            fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 14 : 12),
                            marginHorizontal: responsiveScaling.scale(5),
                        }]}>
                        VALUES FOR COMPARISON ARE MISSING
                    </ThemedText>}
            </View>
            <View style={[
                styles.historyMenuRow,
                {
                    paddingVertical: responsiveScaling.scale(10),
                    paddingHorizontal: responsiveScaling.scale(15),
                }
            ]}>
                <ThemedText style={[
                    styles.historyMenuText,
                    {
                        width: responsiveScaling.scale(120),
                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                        marginHorizontal: responsiveScaling.scale(5),
                    }]}>
                    CATEGORY:
                </ThemedText>
                <Dropdown
                    items={selectableCategories}
                    onChange={(selectedCategoryItem) => {handleCategorySelected(selectedCategoryItem)}}
                    value={category.category}
                    placeholder={"CATEGORY"}
                />
            </View>
            <View style={[
                styles.historyMenuRow,
                {
                    paddingVertical: responsiveScaling.scale(10),
                    paddingHorizontal: responsiveScaling.scale(15),
                }
            ]}>
                <ThemedText style={[
                    styles.historyMenuText,
                    {
                        width: responsiveScaling.scale(120),
                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                        marginHorizontal: responsiveScaling.scale(5),
                    }]}>
                    TIMEFRAME:
                </ThemedText>
                <Dropdown
                    items={possibleStartYearItems}
                    onChange={(selectedYear) => {handleYearSelected(selectedYear, yearEnd)}}
                    value={yearStart.value}
                    placeholder={'START'}
                />
                <ThemedText style={[
                    styles.historyMenuText,
                    {
                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                        marginHorizontal: responsiveScaling.scale(5),
                    }
                ]}>
                    -
                </ThemedText>
                <Dropdown
                    items={possibleEndYearItems}
                    onChange={(selectedYear) => {handleYearSelected(yearStart, selectedYear)}}
                    value={yearEnd.value}
                    placeholder={'END'}
                />
            </View>
            <View style={[
                styles.historyMenuRow,
                {
                    paddingVertical: responsiveScaling.scale(10),
                    paddingHorizontal: responsiveScaling.scale(15),
                }
            ]}>
                <ThemedText style={[
                    styles.historyMenuText,
                    {
                        width: responsiveScaling.scale(120),
                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                        marginHorizontal: responsiveScaling.scale(5),
                    }]}>
                    REGION:
                </ThemedText>
                <Dropdown
                    items={selectableRegions}
                    onChange={(selectedRegion) => handleRegionSelected(selectedRegion)}
                    value={historyRegion ? historyRegion.name : ""}
                    placeholder={'REGION'}
                />
            </View>
            <View style={[
                styles.historyMenuButtonRow,
                {
                    paddingVertical: responsiveScaling.scale(10)
                }
            ]}>
                <ThemedButton
                    title={props.comparisonActive ? 'CHANGE COMPARISON' : 'START COMPARISON'}
                    iconName={'history'}
                    iconLibrary={"MaterialIcons"}
                    onPress={() => {startComparison()}}
                    disabled={false}
                    selected={false}
                />
                {props.comparisonActive &&
                    <ThemedButton
                        title={'END COMPARISON'}
                        iconName={'stop-circle-outline'}
                        iconLibrary={"MaterialCommunityIcons"}
                        onPress={() => {
                            props.endComparison();
                            resetComparisonValues();
                        }}
                        selected={false}
                        disabled={false}
                    />
                }
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
    },

    historyMenuText: {
        fontWeight: "bold",
    },

    historyMenuErrorText: {
        fontWeight: "bold",
        color: 'red'
    },

    historyMenuHeader: {
        alignItems: "center",
        justifyContent: 'center',
        width: '100%',
    },

    historyMenuRow: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        justifyContent: 'flex-start',
    },

    historyMenuButtonRow: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        justifyContent: 'space-around',
    }
})

