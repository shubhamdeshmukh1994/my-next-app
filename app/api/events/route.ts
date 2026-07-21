import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadPublicImage } from "@/lib/supabase/storage";
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await req.formData();
    let event: Record<string, any>;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 },
      );
    }
    event.agenda = formData.getAll("agenda").map(String).filter(Boolean);
    event.tags = formData.getAll("tags").map(String).filter(Boolean);

    const imageFile = formData.get("image");
    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return NextResponse.json(
        { message: "Event image is required" },
        { status: 400 },
      );
    }

    const extension = imageFile.name.split(".").pop();
    const filePath = `public/${crypto.randomUUID()}.${extension}`;

    const { url: imageUrl, error: imageError } = await uploadPublicImage(
      supabase,
      "event_images",
      filePath,
      imageFile,
    );

    if (imageError) {
      return NextResponse.json(
        { message: "Event image upload failed", error: imageError },
        { status: 500 },
      );
    }

    event.image = imageUrl;

    const { data, error } = await supabase
      .from("events")
      .insert(event)
      .select()
      .single();

    if (error) {
      console.error("error", error);
      return NextResponse.json(
        { message: "Event creation failed", error: error.message },
        { status: 500 },
      );
    }

    // Purge the homepage's cached event list so the next visit (by anyone)
    // shows this event immediately instead of waiting for its normal
    // revalidation window.
    revalidatePath("/");

    return NextResponse.json(
      { message: "Event created successfully", event: data },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.log(error);
      return;
    }
    return NextResponse.json(
      { message: "Event fetched successfully", events },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error while fetching events",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}
