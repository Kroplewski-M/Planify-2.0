import { useEffect, useState } from "react";
import EventCard from "../../components/EventCard";
import type { Event } from "../../models/Event";
import axiosClient from "../../axios-client";

export default function Attending() {
    const [events, setEvents] = useState<Event[]>([]);

    const fetchEvents = async () => {
        try {
            const res = await axiosClient.get("/events/attending");
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
    });
    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-accent">Attending Events</h1>

            {
                events.length > 0 ? (<>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((ev) => (
                            <EventCard key={ev.id} event={ev} />
                        ))}
                    </div>
                </>) : (<>
                    <p>No Future Attending Events Found</p>
                </>)
            }
        </div>
    );


}