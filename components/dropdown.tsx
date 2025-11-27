import {useState} from "react";
import {FlatList, Modal, TouchableOpacity, View, StyleSheet} from "react-native";
import {ThemedText} from "@/components/themed-text";
import {useTheme} from "@react-navigation/native";

export type DropdownItem = {
    label: string;
    value: number;
}

export type DropdownProps = {
    items: DropdownItem[];
    placeholder?: string;
    value?: number;
    onChange: (item: DropdownItem) => void;
    disabled?: boolean;
}

export function Dropdown(props: DropdownProps) {
    const {colors} = useTheme()
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
                    styles.button,{ backgroundColor: colors.card, borderColor: colors.text }, props.disabled && {opacity: 0.5}
                ]}
                onPress={() => !props.disabled && setVisible(true)}>
                <ThemedText style={styles.buttonText}>
                    {selectedItem ? selectedItem.label : props.placeholder}
                </ThemedText>
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View style={[styles.dropdown, {backgroundColor: colors.card}]}>
                        <FlatList
                            data={props.items}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity onPress={() => handleSelect(item)}>
                                    <ThemedText style={styles.itemText}>{item.label}</ThemedText>
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
        borderWidth: 1,
        padding: 5,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        paddingHorizontal: 20
    },
    dropdown: {
        paddingVertical: 8,
        borderRadius: 8,
        maxHeight: 250
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    itemText: {
        fontSize: 16
    }
});

export default Dropdown;