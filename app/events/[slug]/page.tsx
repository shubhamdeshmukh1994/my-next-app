import EventDetails from "@/app/componants/events/EventDetails";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>}) => {
    const slug = params.then((p) => p.slug);

    return (
        <main>
            <EventDetails params={slug} />
        </main>
    )
}
export default EventDetailsPage
