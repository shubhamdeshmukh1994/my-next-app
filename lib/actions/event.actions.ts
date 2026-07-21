'use server';

import { createPublicClient } from "@/lib/supabase/public";
import { IEvent } from "@/lib/types";

// Events sharing at least one tag with the event at `slug`, excluding the
// event itself. Fails soft (empty array) -- this powers a "Similar Events"
// section, not critical page content.
export const getSimilarEventsBySlug = async (slug: string): Promise<IEvent[]> => {
    try {
        const supabase = createPublicClient();

        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("id, tags")
            .eq("slug", slug)
            .single();

        if (eventError || !event || !event.tags?.length) {
            return [];
        }

        const { data: similarEvents, error } = await supabase
            .from("events")
            .select("*")
            .neq("id", event.id)
            .overlaps("tags", event.tags);

        if (error) {
            console.error("getSimilarEventsBySlug failed", error);
            return [];
        }

        return similarEvents ?? [];
    } catch (error) {
        console.error("getSimilarEventsBySlug failed", error);
        return [];
    }
}
