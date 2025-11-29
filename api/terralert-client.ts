import {TerralertEvent} from "@/model/event";
import {parseTerralertEvents} from "@/helper/terralert-event-helper";
import {CategoryState} from "@/components/category-state-context";
import {TerralertRegion} from "@/helper/terralert-region-helper";

const baseUri = 'http://localhost:5210';
const eventUri = '/api/events/';
const currentUri = '/current';

export async function getCurrentEvents(categoryState: CategoryState): Promise<TerralertEvent[]> {
    const response = await fetch(baseUri + eventUri + categoryState.category + currentUri);

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const eventArrayJson = await response.json();
    return parseTerralertEvents(eventArrayJson);
}

export async function getEventsByCategoryRegionAndYear(categoryState: CategoryState, region: TerralertRegion, year: number): Promise<TerralertEvent[]> {
    const response = await fetch(baseUri + eventUri + categoryState.category + '/' + region.name + '/' + year);

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const eventArrayJson = await response.json();
    return parseTerralertEvents(eventArrayJson);
}