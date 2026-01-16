import {
    deleteEventsForRegionYearCategory,
    insertEvents,
    isRegionYearSynced,
    markRegionYearSynced
} from "@/repositories/event-repository";
import {getCurrentEvents, getEventsByCategoryRegionAndYear} from "@/api/terralert-client";
import {CategoryState} from "@/components/category-state-context";
import {TerralertRegion} from "@/helper/terralert-region-helper";
import {TerralertEvent} from "@/model/event";
import {parseCategoryStateToDbId} from "@/helper/terralert-event-helper";

export async function syncEventsFromBackend(category: CategoryState) {
    const events = await getCurrentEvents(category);

    await insertEvents(events);
}

export async function syncRegionYear(region: TerralertRegion, year: number, category: CategoryState) {
    let categoryId = parseCategoryStateToDbId(category);
    const alreadySynced = await isRegionYearSynced(region, year, categoryId);
    if (alreadySynced) return; // nothing to do

    const events = await getEventsByCategoryRegionAndYear(category, region, year);
    if (events.length === 0) {
        // still mark it as synced to avoid repeated empty requests
        await markRegionYearSynced(region, year, categoryId);
        return;
    }

    await deleteEventsForRegionYearCategory(region, year, categoryId);
    await insertEvents(events);
    await markRegionYearSynced(region, year, categoryId);
}
