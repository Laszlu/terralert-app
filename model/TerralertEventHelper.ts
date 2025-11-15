import {TerralertEvent, Category, Source, TerralertGeometry, TerralertCoordinates} from "@/model/Event";

type RawCoordinateObj = {
    PointCoordinates?: number[] | null;
    PolygonCoordinates?: number[] | number[][] | null;
    [k: string]: any;
};

export type MapMarker = {
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
    magnitudeValue?: number | null;
    date?: string | null;
};

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

export function geometryToMarkers(geometry: TerralertGeometry[]): MapMarker[] {
    const markers: MapMarker[] = [];

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