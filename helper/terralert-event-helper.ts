import {TerralertEvent, Category, Source, TerralertGeometry, TerralertCoordinates} from "@/model/event";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {ImageURISource} from "react-native";
import {getIconPathForCategory, getImageForEventByCategory, IconInfo} from "@/helper/ui-helper";
import {pinColors} from "@/constants/constants";

type RawCoordinateObj = {
    PointCoordinates?: number[] | null;
    PolygonCoordinates?: number[] | number[][] | null;
    [k: string]: any;
};

export type TerralertMapMarker = {
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
    magnitudeValue?: number | null;
    date?: string | null;
    image?: number | ImageURISource | undefined;
    color?: string;
    icon?: IconInfo;
};

export type TerralertPolyLine = {
    coordinates: { latitude: number; longitude: number }[];
    color?: string;
}

export function parseTerralertEvent(jsonEvent: any): TerralertEvent {
    const categories: Category[] = (jsonEvent.categories || []).map(
        (c: any) => new Category(c.id ?? null, c.title ?? null)
    );

    const sources: Source[] = (jsonEvent.sources || []).map(
        (s: any) => new Source(s.id ?? null, s.url ?? null)
    );

    const geometry: TerralertGeometry[] = (jsonEvent.geometry || []).map((g: any) => {

        const rawCoords: RawCoordinateObj[] = (() => {
            const coords = g.coordinates;
            if (coords == null) return [];               // null or undefined -> empty array
            if (Array.isArray(coords)) return coords;    // already an array of coordinate objects
            // Object (single coordinate block) -> wrap in array
            if (typeof coords === 'object') return [coords];
            return []; // fallback
        })();

        const coordsInstances: TerralertCoordinates[] = rawCoords.map((rc) => {
            const point = rc.PointCoordinates ?? rc.pointCoordinates ?? null;
            const polygon = rc.PolygonCoordinates ?? rc.polygonCoordinates ?? null;
            return new TerralertCoordinates(point, polygon);
        });

        const magnitudeValue = typeof g.magnitudeValue === 'number' ? g.magnitudeValue : (g.magnitudeValue ?? null);

        return new TerralertGeometry(
            magnitudeValue,
            g.magnitudeUnit ?? null,
            g.date ?? null,
            g.type ?? null,
            coordsInstances
        );
    });

    return new TerralertEvent(
        jsonEvent.id ?? null,
        jsonEvent.title ?? null,
        jsonEvent.description ?? null,
        jsonEvent.link ?? null,
        jsonEvent.closed ?? null,
        categories,
        sources,
        geometry
    );
}

export function parseTerralertEvents(jsonArray: any[]): TerralertEvent[] {
    return jsonArray.map(item => parseTerralertEvent(item));
}

export function getMarkersForEvents(events: TerralertEvent[]): TerralertMapMarker[] {
    const markers: TerralertMapMarker[] = [];

    events.forEach(event => {
        let marker = getMarkerForEvent(event);
        if (marker != null) {
            markers.push(marker)
        }
    });

    return markers;
}

export function getMarkerForEvent(event: TerralertEvent): TerralertMapMarker | null {
    const geometryCount = event.geometry.length;
    const currentGeometry = event.geometry[geometryCount - 1];
    let marker: TerralertMapMarker;

    for (const coord of currentGeometry.coordinates) {
        if (coord.pointCoordinates && coord.pointCoordinates.length === 2) {
            const [lon, lat] = coord.pointCoordinates;

            marker = {
                latitude: lat,
                longitude: lon,
                magnitudeValue: currentGeometry.magnitudeValue ?? null,
                date: currentGeometry.date ?? null,
                title: `${event.title ?? "Event"}`,
                description: ` ${currentGeometry.date ?? ""} ${currentGeometry.magnitudeValue != null ? "- " + currentGeometry.magnitudeValue : ""}${currentGeometry.magnitudeUnit ?? ""}`,
                icon: getIconPathForCategory(event.categories[0].id as string)
            }

            console.log(marker.icon);
            return marker;
        }
    }

    return null;
}

export function getMarkersForHistoryEvents(events: TerralertEvent[], colorIndex: number): TerralertMapMarker[] {
    const markers: TerralertMapMarker[] = [];

    events.forEach(event => {
        let marker = getMarkerForHistoryEvent(event, colorIndex);
        if (marker != null) {
            markers.push(marker)
        }
    });

    return markers;
}

export function getMarkerForHistoryEvent(event: TerralertEvent, colorIndex: number): TerralertMapMarker | null {
    const geometryCount = event.geometry.length;
    const currentGeometry = event.geometry[geometryCount - 1];
    let marker: TerralertMapMarker;

    for (const coord of currentGeometry.coordinates) {
        if (coord.pointCoordinates && coord.pointCoordinates.length === 2) {
            const [lon, lat] = coord.pointCoordinates;

            marker = {
                latitude: lat,
                longitude: lon,
                magnitudeValue: currentGeometry.magnitudeValue ?? null,
                date: currentGeometry.date ?? null,
                title: `${event.title ?? "Event"}`,
                description: ` ${currentGeometry.date ?? ""} ${currentGeometry.magnitudeValue != null ? "- " + currentGeometry.magnitudeValue : ""}${currentGeometry.magnitudeUnit ?? ""}`,
                color: pinColors[colorIndex],
                icon: getIconPathForCategory(event.categories[0].id as string),
            }

            return marker;
        }
    }

    return null;
}

export function getPolylineForHistoryEvent(
    event: TerralertEvent,
    colorIndex: number
): TerralertPolyLine | null {

    const coords: { latitude: number; longitude: number }[] = [];

    for (const geom of event.geometry) {
        for (const coord of geom.coordinates) {
            if (coord.pointCoordinates && coord.pointCoordinates.length === 2) {
                const [lon, lat] = coord.pointCoordinates;
                coords.push({ latitude: lat, longitude: lon });
            }
        }
    }

    if (coords.length < 2) return null; // not enough points to draw a line

    return {
        coordinates: coords,
        color: pinColors[colorIndex],
    };
}

export function geometryToMarkers(geometry: TerralertGeometry[]): TerralertMapMarker[] {
    const markers: TerralertMapMarker[] = [];

    geometry.forEach(g => {
        g.coordinates.forEach(coord => {
            // Only handle point coordinates for markers
            if (coord.pointCoordinates && coord.pointCoordinates.length === 2) {
                const [lon, lat] = coord.pointCoordinates;

                markers.push({
                    latitude: lat,
                    longitude: lon,
                    magnitudeValue: g.magnitudeValue ?? null,
                    date: g.date ?? null,
                    // Optional visual helpers
                    title: `Wind ${g.magnitudeValue}${g.magnitudeUnit ?? ""}`,
                    description: g.date ?? undefined,
                });
            }
        });
    });

    return markers;
}