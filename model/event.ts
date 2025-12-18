export class TerralertEventListResult {
    title: string | null;
    description: string | null;
    link: string | null;
    events: TerralertEvent[];

    constructor(title: string | null, description: string | null, link: string | null, events: TerralertEvent[]) {
        this.title = title;
        this.description = description;
        this.link = link;
        this.events = events;
    }
}

export type TerralertEventListByYear = {
    year: number;
    events: TerralertEvent[];
}

export class TerralertEvent {
    id: string | null;
    title: string | null;
    description: string | null;
    link: string | null;
    closed: string | null;
    categories: Category[];
    sources: Source[];
    geometry: TerralertGeometry[];

    constructor(id: string | null, title: string | null, description: string | null, link: string | null, closed: string | null, categories: Category[], sources: Source[], geometry: TerralertGeometry[]) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.link = link;
        this.closed = closed;
        this.categories = categories;
        this.sources = sources;
        this.geometry = geometry;
    }
}

export class Category {
    id: string | null;
    title: string | null;

    constructor(id: string | null, title: string | null) {
        this.id = id;
        this.title = title;
    }
}

export class Source {
    id: string | null;
    url: string | null;

    constructor(id: string | null, url: string | null) {
        this.id = id;
        this.url = url;
    }
}

export class TerralertGeometry {
    magnitudeValue: number | null;
    magnitudeUnit: string | null;
    date: string | null;
    type: string | null;
    coordinates: TerralertCoordinates[];

    constructor(magnitudeValue: number | null, magnitudeUnit: string | null, date: string | null, type: string | null, coordinates: TerralertCoordinates[]) {
        this.magnitudeValue = magnitudeValue;
        this.magnitudeUnit = magnitudeUnit;
        this.date = date;
        this.type = type;
        this.coordinates = coordinates;
    }
}

export class TerralertCoordinates {
    pointCoordinates: number[] | null;
    polygonCoordinates: number[] | number[][] | null;

    constructor(pointCoordinates: number[] | null, polygonCoordinates: number[] | number[][] | null) {
        this.pointCoordinates = pointCoordinates;
        this.polygonCoordinates = polygonCoordinates;
    }
}