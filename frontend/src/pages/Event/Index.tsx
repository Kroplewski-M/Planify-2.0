import { useEffect, useState } from "react";
import EventCard from "../../components/EventCard";
import type { Event } from "../../models/Event";
import axiosClient from "../../axios-client";

const TAKE = 10;

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");

    const fetchEvents = async () => {
        try {
            const res = await axiosClient.get("/events", {
                params: {
                    skip,
                    take: TAKE,
                    search: search || undefined
                }
            });
            setEvents(res.data);
        } catch (err: any) {
            const response = err.response?.data;
            if (response?.errors) {
                const flat = Object.values(response.errors).flat() as string[];
                console.error("Event fetch errors:", flat);
            } else {
                console.error("Unexpected error fetching events");
            }
        }
    };
    useEffect(() => {
        fetchEvents();
    }, [skip, search]);
    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-accent">All Events</h1>
            <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-accent rounded-lg mb-6"
            />
            {
                events.length > 0 ? (<>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((ev) => (
                            <EventCard key={ev.id} event={ev} />
                        ))}
                    </div>
                    <div className="flex justify-between mt-6">
                        <button
                            disabled={skip === 0}
                            onClick={() => setSkip(skip - TAKE)}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
                        >Previous</button>
                        <button
                            disabled={events.length < TAKE}
                            onClick={() => setSkip(skip + TAKE)}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
                        >Next</button>
                    </div>

                </>) : (<>
                    <p>No Events Found</p>
                </>)
            }
        </div>
    );
}
