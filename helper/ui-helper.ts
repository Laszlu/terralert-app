import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {Category} from "@/model/event";
import { Asset } from 'expo-asset';

export type IconLibraries = "MaterialIcons" | "MaterialCommunityIcons";

export type IconName =
    | keyof typeof MaterialIcons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;


export type IconInfo = {
    iconName: IconName,
    iconLibrary: IconLibraries,
}

export function parseCategoryToFullName(category: string): string {
    switch (category) {
        case "st":
            return "storms";
        case "ea":
            return "earthquakes";
        case "vo":
            return "volcanoes";
        default:
            return "";
    }
}

export function getIconPathForCategory(category: string): IconInfo {
    switch (category) {
        case "st":
        case "severeStorms":
            return {iconName: "storm", iconLibrary: "MaterialIcons"};
        case "ea":
        case "earthquakes":
            return {iconName: "image-broken-variant", iconLibrary: "MaterialCommunityIcons"};
        case "vo":
        case "volcanoes":
            return {iconName: "volcano", iconLibrary: "MaterialIcons"};
        default:
            return {iconName: "not-interested", iconLibrary: "MaterialIcons"};
    }
}

export const icons = {
    storm: require("../assets/images/hurricane.png"),
    earthquake: require("../assets/images/earthquake.png"),
    volcano: require("../assets/images/volcano.png")
}

export function getImageForEventByCategory(category: Category): any {
    switch (category.id) {
        case "severeStorms":
            return icons.storm;
        case "earthquakes":
            return icons.earthquake;
        case "volcanoes":
            return icons.volcano;
        default:
            return "";
    }
}