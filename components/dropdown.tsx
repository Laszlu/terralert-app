import {useState} from "react";
import {FlatList, Modal, TouchableOpacity, View, StyleSheet} from "react-native";
import {ThemedText} from "@/components/themed-text";
import {useTheme} from "@react-navigation/native";
import {useMyTheme} from "@/hooks/useCustomTheme";

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
    const {colors} = useMyTheme()
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
                    styles.button,{ backgroundColor: colors.background, borderColor: colors.border }, props.disabled && {opacity: 0.5}
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
                    <View style={[styles.dropdown, {backgroundColor: colors.background, borderColor: colors.border}]}>
                        <FlatList
                            data={props.items}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity style={[styles.item, {borderColor: colors.border}]} onPress={() => handleSelect(item)}>
                                    <ThemedText style={[styles.itemText, {color: colors.text}]}>{item.label}</ThemedText>
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
        fontSize: 16,
        fontWeight: "bold",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        paddingHorizontal: 20,
        alignItems: "center"
    },
    dropdown: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        height: "auto",
        width: '70%',
        borderWidth: 0.5,
    },
    item: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    itemText: {
        fontSize: 16,
        fontWeight: "bold",
    }
});

export default Dropdown;