import React from "react";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {IconLibraries, IconName} from "@/helper/ui-helper";

type IconComponentProps = {
    library: IconLibraries;
    name: IconName;
    size?: number;
    color?: string;
};

export function IconComponent({library, name, size, color}: IconComponentProps) {
    switch (library) {
        case "MaterialIcons":
            return <MaterialIcons name={name as keyof typeof MaterialIcons.glyphMap} size={size} color={color} />;

        case "MaterialCommunityIcons":
            return (
                <MaterialCommunityIcons
                    name={name as keyof typeof MaterialCommunityIcons.glyphMap}
                    size={size}
                    color={color}
                />
            );

        default:
            return null;
    }
}

export default IconComponent;