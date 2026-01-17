import {LatLng} from "react-native-maps";
import {regionColors} from "@/constants/constants";

export interface TerralertRegion {
    name: string;
    description: string;
    minLongitude: number;
    maxLatitude: number;
    maxLongitude: number;
    minLatitude: number;
}

export const AllRegions: TerralertRegion[] = [
    {name: 'northatlantic', description: 'North Atlantic', minLongitude: -80.00, maxLatitude: 70.00, maxLongitude: -20.00, minLatitude: 0.00},
    {name: 'northeastpacific', description: 'Northeast Pacific', minLongitude: -160.00, maxLatitude: 70.00, maxLongitude: -110.00, minLatitude: 0.00},
    {name: 'northwestpacific', description: 'Northwest Pacific', minLongitude: 110.00, maxLatitude: 70.00, maxLongitude: 179.00, minLatitude: 0.00},
    {name: 'northindian', description: 'North Indian Ocean', minLongitude: 20.00, maxLatitude: 30.00, maxLongitude: 100.00, minLatitude: 0.00},
    {name: 'southwestindian', description: 'Southwest Indian Ocean', minLongitude: 20.00, maxLatitude: 0.00, maxLongitude: 100.00, minLatitude: -50.00},
    {name: 'australiaocean', description: 'Australian Ocean', minLongitude: 110.00, maxLatitude: -10.00, maxLongitude: 170.00, minLatitude: -45.00},
    {name: 'southwestpacific', description: 'Southwest Pacific', minLongitude: -120.00, maxLatitude: 0.00, maxLongitude: 150.00, minLatitude: -50.00},
    {name: 'europe', description: 'Europe', minLongitude: -25.00, maxLatitude: 72.00, maxLongitude: 45.00, minLatitude: 35.00},
    {name: 'asia', description: 'Asia', minLongitude: 25.00, maxLatitude: 80.00, maxLongitude: 179.00, minLatitude: 0.00},
    {name: 'africa', description: 'Africa', minLongitude: -20.00, maxLatitude: 38.00, maxLongitude: 55.00, minLatitude: -38.00},
    {name: 'northamerica', description: 'North America', minLongitude: -170.00, maxLatitude: 83.00, maxLongitude: -50.00, minLatitude: 10.00},
    {name: 'southamerica', description: 'South America', minLongitude: -90.00, maxLatitude: 15.00, maxLongitude: -30.00, minLatitude: -60.00},
    {name: 'australia', description: 'Australia', minLongitude: 110.00, maxLatitude: -10.00, maxLongitude: 155.00, minLatitude: -45.00},
    {name: 'pacificringoffire', description: 'Pacific Ring of Fire', minLongitude: -140.00, maxLatitude: 65.00, maxLongitude: 150.00, minLatitude: -60.00},
    {name: 'centralamericacaribbean', description: 'Central America & Caribbean', minLongitude: -120.00, maxLatitude: 32.00, maxLongitude: -60.00, minLatitude: 5.00},
    {name: 'oceania', description: 'Oceania', minLongitude: -120.00, maxLatitude: 10.00, maxLongitude: 110.00, minLatitude: -50.00}
]

export const StormRegions: TerralertRegion[] = [
    {name: 'northatlantic', description: 'North Atlantic', minLongitude: -80.00, maxLatitude: 70.00, maxLongitude: -20.00, minLatitude: 0.00},
    {name: 'northeastpacific', description: 'Northeast Pacific', minLongitude: -160.00, maxLatitude: 70.00, maxLongitude: -110.00, minLatitude: 0.00},
    {name: 'northwestpacific', description: 'Northwest Pacific', minLongitude: 110.00, maxLatitude: 70.00, maxLongitude: 179.00, minLatitude: 0.00},
    {name: 'northindian', description: 'North Indian Ocean', minLongitude: 20.00, maxLatitude: 30.00, maxLongitude: 100.00, minLatitude: 0.00},
    {name: 'southwestindian', description: 'Southwest Indian Ocean', minLongitude: 20.00, maxLatitude: 0.00, maxLongitude: 100.00, minLatitude: -50.00},
    {name: 'australiaocean', description: 'Australian Ocean', minLongitude: 110.00, maxLatitude: -10.00, maxLongitude: 170.00, minLatitude: -45.00},
    {name: 'southwestpacific', description: 'Southwest Pacific', minLongitude: -120.00, maxLatitude: 0.00, maxLongitude: 150.00, minLatitude: -50.00}
]

export const EarthQuakeRegions: TerralertRegion[] = [
    {name: 'europe', description: 'Europe', minLongitude: -25.00, maxLatitude: 72.00, maxLongitude: 45.00, minLatitude: 35.00},
    {name: 'asia', description: 'Asia', minLongitude: 25.00, maxLatitude: 80.00, maxLongitude: 179.00, minLatitude: 0.00},
    {name: 'africa', description: 'Africa', minLongitude: -20.00, maxLatitude: 38.00, maxLongitude: 55.00, minLatitude: -38.00},
    {name: 'northamerica', description: 'North America', minLongitude: -170.00, maxLatitude: 83.00, maxLongitude: -50.00, minLatitude: 10.00},
    {name: 'southamerica', description: 'South America', minLongitude: -90.00, maxLatitude: 15.00, maxLongitude: -30.00, minLatitude: -60.00},
    {name: 'australia', description: 'Australia', minLongitude: 110.00, maxLatitude: -10.00, maxLongitude: 155.00, minLatitude: -45.00}
]

export const VolcanoRegions: TerralertRegion[] = [
    {name: 'africa', description: 'Africa', minLongitude: -20.00, maxLatitude: 38.00, maxLongitude: 55.00, minLatitude: -38.00},
    {name: 'europe', description: 'Europe', minLongitude: -25.00, maxLatitude: 72.00, maxLongitude: 45.00, minLatitude: 35.00},
    {name: 'pacificringoffire', description: 'Pacific Ring of Fire', minLongitude: -140.00, maxLatitude: 65.00, maxLongitude: 150.00, minLatitude: -60.00},
    {name: 'northamerica', description: 'North America', minLongitude: -170.00, maxLatitude: 83.00, maxLongitude: -50.00, minLatitude: 10.00},
    {name: 'centralamericacaribbean', description: 'Central America & Caribbean', minLongitude: -120.00, maxLatitude: 32.00, maxLongitude: -60.00, minLatitude: 5.00},
    {name: 'southamerica', description: 'South America', minLongitude: -90.00, maxLatitude: 15.00, maxLongitude: -30.00, minLatitude: -60.00},
    {name: 'asia', description: 'Asia', minLongitude: 25.00, maxLatitude: 80.00, maxLongitude: 179.00, minLatitude: 0.00},
    {name: 'oceania', description: 'Oceania', minLongitude: -120.00, maxLatitude: 10.00, maxLongitude: 110.00, minLatitude: -50.00}
]

export function getRegionsForCategory(category: string): TerralertRegion[] {
    switch (category) {
        case "st":
            return StormRegions;
        case "ea":
            return EarthQuakeRegions;
        case "vo":
            return VolcanoRegions;
        default:
            return [];
    }
}

export function regionToBoundingBoxCoords(region: TerralertRegion) {
    let clampedRegion = clampRegionLat(region);

    return [
        { latitude: clampedRegion.minLatitude, longitude: clampedRegion.minLongitude },
        { latitude: clampedRegion.maxLatitude, longitude: clampedRegion.maxLongitude },
    ];
}

export function clampRegionLat(region: TerralertRegion): TerralertRegion {
    const MAX_MERCATOR_LAT = 80;

    return {
        ...region,
        minLatitude: Math.max(region.minLatitude, -MAX_MERCATOR_LAT),
        maxLatitude: Math.min(region.maxLatitude, MAX_MERCATOR_LAT),
    };
}

export function regionToPolygon(region: TerralertRegion): LatLng[] {
    const r = clampRegionLat(region);

    return [
        { latitude: r.minLatitude, longitude: r.minLongitude }, // bottom-left
        { latitude: r.minLatitude, longitude: r.maxLongitude }, // bottom-right
        { latitude: r.maxLatitude, longitude: r.maxLongitude }, // top-right
        { latitude: r.maxLatitude, longitude: r.minLongitude }, // top-left
    ];
}

export function makePolygonCoords(region: TerralertRegion) {
    const r = clampRegionLat(region);

    // Ensure we have valid latitude bounds
    if (!Number.isFinite(r.minLatitude) || !Number.isFinite(r.maxLatitude) ||
        !Number.isFinite(r.minLongitude) || !Number.isFinite(r.maxLongitude)) {
        console.error('Invalid region bounds:', r);
        return [];
    }

    const minLat = Math.min(r.minLatitude, r.maxLatitude);
    const maxLat = Math.max(r.minLatitude, r.maxLatitude);

    // Ensure latitude bounds are different
    if (Math.abs(maxLat - minLat) < 0.0001) {
        console.error('Region has zero height:', r);
        return [];
    }

    let minLon = r.minLongitude;
    let maxLon = r.maxLongitude;

    // Normalize longitudes to [-180, 180] range
    const normalizeLon = (lon: number) => {
        while (lon > 180) lon -= 360;
        while (lon < -180) lon += 360;
        return lon;
    };

    minLon = normalizeLon(minLon);
    maxLon = normalizeLon(maxLon);

    // Ensure longitude bounds are different
    if (Math.abs(maxLon - minLon) < 0.0001) {
        console.error('Region has zero width:', r);
        return [];
    }

    // Build the rectangle - don't try to handle dateline crossing in polygon
    // React Native Maps handles this automatically
    const coords = [
        { latitude: minLat, longitude: minLon },
        { latitude: minLat, longitude: maxLon },
        { latitude: maxLat, longitude: maxLon },
        { latitude: maxLat, longitude: minLon },
    ];

    // Final validation
    const validCoords = coords.filter(c =>
        Number.isFinite(c.latitude) &&
        Number.isFinite(c.longitude) &&
        Math.abs(c.latitude) <= 90 &&
        Math.abs(c.longitude) <= 180
    );

    if (validCoords.length !== 4) {
        console.error('Invalid coordinates generated for region:', r, coords);
        return [];
    }

    return validCoords;
}


export function getRegionColor(index: number) {
    const colors = regionColors.filter(c => c.year >= 2015);
    return colors[index % colors.length].color;
}

export function getRegionCenter(region: TerralertRegion) {
    const r = clampRegionLat(region);

    // Latitude: normal
    const latitude = (r.minLatitude + r.maxLatitude) / 2;

    let minLon = r.minLongitude;
    let maxLon = r.maxLongitude;

    let longitude: number;

    if (Math.abs(maxLon - minLon) > 180) {
        // crosses dateline or long span > 180
        // swap min/max to compute shortest arc
        const adjustedMin = (minLon + 360) % 360;
        const adjustedMax = (maxLon + 360) % 360;

        // midpoint along the shorter arc
        longitude = ((adjustedMin + adjustedMax) / 2) % 360;
        if (longitude > 180) longitude -= 360;
    } else {
        // normal
        longitude = (minLon + maxLon) / 2;
    }

    return { latitude, longitude };
}