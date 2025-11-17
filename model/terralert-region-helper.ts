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
    {name: 'northwestpacific', description: 'Northwest Pacific', minLongitude: 110.00, maxLatitude: 70.00, maxLongitude: 180.00, minLatitude: 0.00},
    {name: 'northindian', description: 'North Indian Ocean', minLongitude: 20.00, maxLatitude: 30.00, maxLongitude: 100.00, minLatitude: 0.00},
    {name: 'southwestindian', description: 'Southwest Indian Ocean', minLongitude: 20.00, maxLatitude: 0.00, maxLongitude: 100.00, minLatitude: -50.00},
    {name: 'australiaocean', description: 'Australian Ocean', minLongitude: 110.00, maxLatitude: -10.00, maxLongitude: 170.00, minLatitude: -45.00},
    {name: 'southwestpacific', description: 'Southwest Pacific', minLongitude: -120.00, maxLatitude: 0.00, maxLongitude: 150.00, minLatitude: -50.00},
    {name: 'europe', description: 'Europe', minLongitude: -25.00, maxLatitude: 72.00, maxLongitude: 45.00, minLatitude: 35.00},
    {name: 'asia', description: 'Asia', minLongitude: 25.00, maxLatitude: 80.00, maxLongitude: 180.00, minLatitude: 0.00},
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
    {name: 'northwestpacific', description: 'Northwest Pacific', minLongitude: 110.00, maxLatitude: 70.00, maxLongitude: 180.00, minLatitude: 0.00},
    {name: 'northindian', description: 'North Indian Ocean', minLongitude: 20.00, maxLatitude: 30.00, maxLongitude: 100.00, minLatitude: 0.00},
    {name: 'southwestindian', description: 'Southwest Indian Ocean', minLongitude: 20.00, maxLatitude: 0.00, maxLongitude: 100.00, minLatitude: -50.00},
    {name: 'australiaocean', description: 'Australian Ocean', minLongitude: 110.00, maxLatitude: -10.00, maxLongitude: 170.00, minLatitude: -45.00},
    {name: 'southwestpacific', description: 'Southwest Pacific', minLongitude: -120.00, maxLatitude: 0.00, maxLongitude: 150.00, minLatitude: -50.00}
]

export const EarthQuakeRegions: TerralertRegion[] = [
    {name: 'europe', description: 'Europe', minLongitude: -25.00, maxLatitude: 72.00, maxLongitude: 45.00, minLatitude: 35.00},
    {name: 'asia', description: 'Asia', minLongitude: 25.00, maxLatitude: 80.00, maxLongitude: 180.00, minLatitude: 0.00},
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
    {name: 'asia', description: 'Asia', minLongitude: 25.00, maxLatitude: 80.00, maxLongitude: 180.00, minLatitude: 0.00},
    {name: 'oceania', description: 'Oceania', minLongitude: -120.00, maxLatitude: 10.00, maxLongitude: 110.00, minLatitude: -50.00}
]