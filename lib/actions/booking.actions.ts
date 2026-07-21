'use server';

import { createClient } from "@/lib/supabase/server";

// `slug` is accepted for the caller's convenience/analytics but isn't a
// column on `bookings` -- only event_id/email are persisted.
export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }) => {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("bookings")
            .insert({ event_id: eventId, email });

        if (error) {
            console.error("create booking failed", error);
            return { success: false };
        }

        return { success: true };
    } catch (e) {
        console.error("create booking failed", e);
        return { success: false };
    }
}
