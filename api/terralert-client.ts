import {TerralertEvent} from "@/model/event";
import {parseTerralertEvents} from "@/model/terralert-event-helper";

const baseUri = 'http://localhost:5210';
const eventUri = '/api/events/';
const currentUri = '/current';

export async function getCurrentEvents(category: string): Promise<TerralertEvent[]> {
    const response = await fetch(baseUri + eventUri + category + currentUri);

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const eventArrayJson = await response.json();
    return parseTerralertEvents(eventArrayJson);
}