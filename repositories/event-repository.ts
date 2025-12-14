import {Category, Source, TerralertCoordinates, TerralertEvent, TerralertGeometry} from "@/model/event";
import {db} from "@/components/database-provider";
import {TerralertRegion} from "@/helper/terralert-region-helper";

export async function insertEvents(events: TerralertEvent[]) {
    await db.withTransactionAsync(async () => {
        for (const e of events) {
            await insertSingleEvent(e);
        }
    });
}

async function insertSingleEvent(e: TerralertEvent) {
    if (!e.id) return;

    await db.runAsync(
        `INSERT OR REPLACE INTO events
     (id, title, description, link, closed)
     VALUES (?, ?, ?, ?, ?)`,
        [e.id, e.title, e.description, e.link, e.closed]
    );

    // categories
    for (const c of e.categories) {
        if (!c.id) continue;

        await db.runAsync(
            `INSERT OR IGNORE INTO categories (id, title)
       VALUES (?, ?)`,
            [c.id, c.title]
        );

        await db.runAsync(
            `INSERT OR IGNORE INTO event_categories (event_id, category_id)
       VALUES (?, ?)`,
            [e.id, c.id]
        );
    }

    // sources
    for (const s of e.sources) {
        if (!s.id) continue;

        await db.runAsync(
            `INSERT OR IGNORE INTO sources (id, url)
       VALUES (?, ?)`,
            [s.id, s.url]
        );

        await db.runAsync(
            `INSERT OR IGNORE INTO event_sources (event_id, source_id)
       VALUES (?, ?)`,
            [e.id, s.id]
        );
    }

    // geometry
    for (const g of e.geometry) {
        const res = await db.runAsync(
            `INSERT INTO geometry
       (event_id, magnitude_value, magnitude_unit, date, type)
       VALUES (?, ?, ?, ?, ?)`,
            [
                e.id,
                g.magnitudeValue,
                g.magnitudeUnit,
                g.date,
                g.type,
            ]
        );

        const geometryId = res.lastInsertRowId;

        await insertGeometryCoordinates(geometryId, g.coordinates);
    }
}
async function insertGeometryCoordinates(
    geometryId: number,
    coords: TerralertCoordinates[]
) {
    for (const c of coords) {
        if (c.pointCoordinates) {
            const [lon, lat] = c.pointCoordinates;

            await db.runAsync(
                `INSERT INTO geometry_coordinates
         (geometry_id, coord_type, latitude, longitude)
         VALUES (?, 'point', ?, ?)`,
                [geometryId, lat, lon]
            );
        }

        if (c.polygonCoordinates) {
            // flatten polygon(s) here
            // insert with position + ring
        }
    }
}

export async function markRegionYearSynced(region: TerralertRegion, year: number, categoryId: string) {
    const now = new Date().toISOString();
    await db.runAsync(
        `INSERT OR REPLACE INTO sync_status (region, year, category_id, last_synced)
         VALUES (?, ?, ?, ?)`,
        [region.name, year, categoryId, now]
    );
}

export async function isRegionYearSynced(region: TerralertRegion, year: number, categoryId: string) {
    const rows = await db.getAllAsync<{ last_synced: string }>(
        `SELECT last_synced
         FROM sync_status
         WHERE region = ? AND year = ? AND category_id = ?`,
        [region.name, year, categoryId]
    );

    return rows.length > 0;
}

export async function getEventsForRegionYearCategory(
    region: TerralertRegion,
    year: number,
    categoryId: string
): Promise<TerralertEvent[]> {

    // SQL to select events that match the category and have geometry coordinates inside the bounding box
    const eventRows = await db.getAllAsync<{
        id: string;
        title: string | null;
        description: string | null;
        link: string | null;
        closed: string | null;
    }>(`
    SELECT DISTINCT e.*
    FROM events e
    JOIN event_categories ec ON ec.event_id = e.id
    JOIN geometry g ON g.event_id = e.id
    JOIN geometry_coordinates gc ON gc.geometry_id = g.id
    WHERE ec.category_id = ?
      AND gc.latitude BETWEEN ? AND ?
      AND gc.longitude BETWEEN ? AND ?
      AND strftime('%Y', g.date) = ?
  `, [
        categoryId,
        region.minLatitude,
        region.maxLatitude,
        region.minLongitude,
        region.maxLongitude,
        year.toString()
    ]);

    if (eventRows.length === 0) return [];

    // Hydrate full TerralertEvent objects (categories, sources, geometry) as before
    return hydrateEvents(eventRows);
}

export async function getEventsByCategory(
    categoryId: string,
    options?: { onlyOpen?: boolean }
): Promise<TerralertEvent[]> {

    const whereClosed = options?.onlyOpen
        ? 'AND e.closed IS NULL'
        : '';

    const events = await db.getAllAsync<{
        id: string;
        title: string | null;
        description: string | null;
        link: string | null;
        closed: string | null;
    }>(`
    SELECT DISTINCT e.*
    FROM events e
    JOIN event_categories ec ON ec.event_id = e.id
    WHERE ec.category_id = ?
    ${whereClosed}
  `, [categoryId]);

    if (events.length === 0) return [];

    return hydrateEvents(events);
}

async function hydrateEvents(
    baseEvents: {
        id: string;
        title: string | null;
        description: string | null;
        link: string | null;
        closed: string | null;
    }[]
): Promise<TerralertEvent[]> {

    const eventIds = baseEvents.map(e => e.id);
    const placeholders = eventIds.map(() => '?').join(',');

    // categories
    const categories = await db.getAllAsync<{
        event_id: string;
        id: string;
        title: string | null;
    }>(`
    SELECT ec.event_id, c.id, c.title
    FROM event_categories ec
    JOIN categories c ON c.id = ec.category_id
    WHERE ec.event_id IN (${placeholders})
  `, eventIds);

    // sources
    const sources = await db.getAllAsync<{
        event_id: string;
        id: string;
        url: string | null;
    }>(`
    SELECT es.event_id, s.id, s.url
    FROM event_sources es
    JOIN sources s ON s.id = es.source_id
    WHERE es.event_id IN (${placeholders})
  `, eventIds);

    // geometry + coordinates
    const geometryRows = await db.getAllAsync<{
        geometry_id: number;
        event_id: string;
        magnitude_value: number | null;
        magnitude_unit: string | null;
        date: string;
        type: string | null;
        coord_type: string;
        latitude: number | null;
        longitude: number | null;
        position: number | null;
        ring: number | null;
    }>(`
    SELECT
      g.id as geometry_id,
      g.event_id,
      g.magnitude_value,
      g.magnitude_unit,
      g.date,
      g.type,
      gc.coord_type,
      gc.latitude,
      gc.longitude,
      gc.position,
      gc.ring
    FROM geometry g
    JOIN geometry_coordinates gc ON gc.geometry_id = g.id
    WHERE g.event_id IN (${placeholders})
    ORDER BY g.date ASC, gc.ring, gc.position
  `, eventIds);

    return assembleEvents(baseEvents, categories, sources, geometryRows);
}

function assembleEvents(
    baseEvents: any[],
    categories: any[],
    sources: any[],
    geometryRows: any[]
): TerralertEvent[] {

    return baseEvents.map(e => {
        const eventCategories = categories
            .filter(c => c.event_id === e.id)
            .map(c => new Category(c.id, c.title));

        const eventSources = sources
            .filter(s => s.event_id === e.id)
            .map(s => new Source(s.id, s.url));

        const geometries = buildGeometry(geometryRows.filter(g => g.event_id === e.id));

        return new TerralertEvent(
            e.id,
            e.title,
            e.description,
            e.link,
            e.closed,
            eventCategories,
            eventSources,
            geometries
        );
    });
}

function buildGeometry(rows: any[]): TerralertGeometry[] {
    const byGeometryId = new Map<number, any[]>();

    for (const r of rows) {
        if (!byGeometryId.has(r.geometry_id)) {
            byGeometryId.set(r.geometry_id, []);
        }
        byGeometryId.get(r.geometry_id)!.push(r);
    }

    return Array.from(byGeometryId.values()).map(group => {
        const first = group[0];

        const coords = group.map(r =>
            new TerralertCoordinates(
                r.coord_type === 'point'
                    ? [r.longitude, r.latitude]
                    : null,
                null // polygon assembly omitted for brevity
            )
        );

        return new TerralertGeometry(
            first.magnitude_value,
            first.magnitude_unit,
            first.date,
            first.type,
            coords
        );
    });
}



