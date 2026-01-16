import {Category, Source, TerralertCoordinates, TerralertEvent, TerralertGeometry} from "@/model/event";
import {db} from "@/components/database-provider";
import {TerralertRegion} from "@/helper/terralert-region-helper";

export async function checkIfDbIsEmpty() {
    const rows = await db.getAllAsync<{ last_synced: string }>(
        `SELECT * FROM sync_status`,
        []
    );

    return rows.length === 0;
}

export async function insertEvents(events: TerralertEvent[]) {
    await db.withTransactionAsync(async () => {
        for (const e of events) {
            await insertSingleEvent(e);
        }
    });
}

async function insertSingleEvent(e: TerralertEvent) {
    if (!e.id) return;

    const category = e.categories[0];
    if (!category?.id) {
        throw new Error(`Event ${e.id} has no category`);
    }

    await db.runAsync(
        `INSERT OR IGNORE INTO categories (id, title)
     VALUES (?, ?)`,
        [category.id, category.title]
    );

    await db.runAsync(`DELETE FROM events WHERE id = ?`, [e.id]);

    await db.runAsync(
        `INSERT INTO events
     (id, category_id, title, description, link, closed)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [e.id, category.id, e.title, e.description, e.link, e.closed]
    );

    for (const s of e.sources) {
        await db.runAsync(
            `INSERT INTO sources (event_id, id, url)
             VALUES (?, ?, ?)`,
            [e.id, s.id, s.url]
        );
    }

    for (const g of e.geometry) {
        const res = await db.runAsync(
            `INSERT INTO geometry
                 (event_id, magnitude_value, magnitude_unit, date, type)
             VALUES (?, ?, ?, ?, ?)`,
            [e.id, g.magnitudeValue, g.magnitudeUnit, g.date, g.type]
        );

        await insertGeometryCoordinates(res.lastInsertRowId, g.coordinates);
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
        category_id: string;
        title: string | null;
        description: string | null;
        link: string | null;
        closed: string | null;
    }>(`
        SELECT DISTINCT e.*
        FROM events e
                 JOIN geometry g ON g.event_id = e.id
                 JOIN geometry_coordinates gc ON gc.geometry_id = g.id
        WHERE e.category_id = ?
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
        ? 'AND closed IS NULL'
        : '';

    const events = await db.getAllAsync<{
        id: string;
        category_id: string;
        title: string | null;
        description: string | null;
        link: string | null;
        closed: string | null;
    }>(`
        SELECT *
        FROM events
        WHERE category_id = ?
    ${whereClosed}
  `, [categoryId]);

    if (events.length === 0) return [];

    return hydrateEvents(events);
}

async function hydrateEvents(
    baseEvents: {
        id: string;
        category_id: string;
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
        id: string;
        title: string | null;
    }>(`SELECT * FROM categories`);

    // sources
    const sources = await db.getAllAsync<{
        event_id: string;
        id: string;
        url: string | null;
    }>(`
        SELECT event_id, id, url
        FROM sources
        WHERE event_id IN (${placeholders})
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

    const categoryMap = new Map(
        categories.map(c => [c.id, new Category(c.id, c.title)])
    );

    return baseEvents.map(e => {
        const category = categoryMap.get(e.category_id);
        if (!category) {
            console.warn(`Missing category ${e.category_id} for event ${e.id}`);
        }

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
            category ? [category] : [],
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

export async function deleteEventsForRegionYearCategory(
    region: TerralertRegion,
    year: number,
    categoryId: string
) {
    await db.runAsync(`
        DELETE FROM events
        WHERE id IN (
            SELECT DISTINCT e.id
            FROM events e
                     JOIN geometry g ON g.event_id = e.id
                     JOIN geometry_coordinates gc ON gc.geometry_id = g.id
            WHERE e.category_id = ?
              AND gc.latitude BETWEEN ? AND ?
              AND gc.longitude BETWEEN ? AND ?
              AND strftime('%Y', g.date) = ?
        )
    `, [
        categoryId,
        region.minLatitude,
        region.maxLatitude,
        region.minLongitude,
        region.maxLongitude,
        year.toString()
    ]);
}

