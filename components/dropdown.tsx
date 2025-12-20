import {useState} from "react";
import {FlatList, Modal, TouchableOpacity, View, StyleSheet} from "react-native";
import {ThemedText} from "@/components/themed-text";
import {useMyTheme} from "@/hooks/useCustomTheme";
import {useResponsiveScaling} from "@/hooks/use-responsive-scaling";

export type DropdownItem = {
    label: string;
    value: number | string;
}

export type DropdownProps = {
    items: DropdownItem[];
    placeholder?: string;
    value?: number | string;
    onChange: (item: DropdownItem) => void;
    disabled?: boolean;
}

export function Dropdown(props: DropdownProps) {
    const {colors} = useMyTheme();
    const responsiveScaling = useResponsiveScaling();
    const [visible, setVisible] = useState(false);

    const selectedItem = props.items.find(item => item.value === props.value);

    const handleSelect = (item: DropdownItem) => {
        props.onChange(item);
        setVisible(false);
    }

    return(
        <>
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: colors.text,
                        padding: responsiveScaling.scale(5),
                    },
                    props.disabled && {opacity: 0.5}
                ]}
                onPress={() => !props.disabled && setVisible(true)}>
                <ThemedText style={[
                    styles.buttonText,
                    {
                        fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                        color: colors.background
                    }
                ]}>
                    {selectedItem ? selectedItem.label : props.placeholder}
                </ThemedText>
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
            >
                <TouchableOpacity
                    style={[
                        styles.overlay,
                        {
                            paddingHorizontal: responsiveScaling.scale(20),
                        }
                    ]}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View style={[
                        styles.dropdown,
                        {
                            backgroundColor: colors.background,
                            paddingVertical: responsiveScaling.scale(8),
                            paddingHorizontal: responsiveScaling.scale(20),
                            width: responsiveScaling.scale(250),
                        }]}>
                        <FlatList
                            data={props.items}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity style={[
                                    styles.item,
                                    {
                                        paddingVertical: responsiveScaling.scale(5),
                                        paddingHorizontal: responsiveScaling.scale(10),
                                        marginBottom: responsiveScaling.scale(5),
                                    }]}
                                    onPress={() => handleSelect(item)}>
                                    <ThemedText style={[
                                        styles.itemText,
                                        {
                                            color: colors.text,
                                            fontSize: responsiveScaling.font(responsiveScaling.isTablet ? 18 : 16),
                                        }]}>
                                        {item.label}
                                    </ThemedText>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
    },
    buttonText: {
        fontWeight: "bold",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center"
    },
    dropdown: {
        borderRadius: 8,
        height: "auto",
    },
    item: {

    },
    itemText: {
        fontWeight: "bold",
    }
});

