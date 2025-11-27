import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { type Event } from "../../models/Event";
import { dateFormatter, formatDuration } from "../../models/Shared";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Event() {
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useAuth();
    const navigate = useNavigate();
    const deleteEvent = async () => {
        try {
            await axiosClient.delete(`events/${event?.id}`)
                .then(() => navigate(`/events`))
        } catch (err) {
            console.log(err);
        }
    }
    const fetchEvent = async () => {
        try {
            const res = await axiosClient.get(`/events/${id}`);
            setEvent(res.data);
        } catch (err: any) {
            const response = err.response?.data;
            if (response?.errors) {
                const flat = Object.values(response.errors).flat() as string[];
                setError(flat.join(", "));
            } else {
                setError("Could not load the event");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [id]);

    if (loading)
        return (
            <div className="text-gray-200 text-center mt-10">Loading event...</div>
        );

    if (error)
        return (
            <div className="text-red-400 text-center mt-10">
                Error: {error}
            </div>
        );

    if (!event)
        return (
            <div className="text-gray-200 text-center mt-10">
                Event not found.
            </div>
        );

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 rounded-xl bg-white shadow-xl ">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">{event.name}</h1>
                {userId === event.created_by_user_id && (
                    <div className="flex gap-3">
                        <NavLink
                            to={`/edit/${event.id}`}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                        >
                            Edit
                        </NavLink>

                        <button
                            onClick={deleteEvent}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-90 transition cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
            <p className="text-lg text-gray-500 mb-6">{event.description}</p>

            <div className=" rounded-lg mb-6">
                <p>
                    <strong>Starts:</strong>{" "}
                    {dateFormatter.format(new Date(event.happening_at))}
                </p>

                {event.happening_until && (
                    <div>
                        <p>
                            <strong>Ends:</strong>{" "}
                            {dateFormatter.format(new Date(event.happening_until))}
                        </p>
                        <p className="mt-2">
                            <strong>Duration:</strong>{" "}
                            {formatDuration(event.happening_at, event.happening_until)}
                        </p>
                    </div>
                )}
            </div>
            <hr />
            <div className="mt-5 rounded-lg space-y-2">
                {event.meeting && (
                    <p>
                        <strong>Online meeting:</strong>{" "}
                        <a
                            href={event.meeting.link}
                            target="_blank"
                            className="text-blue-400 underline"
                        >
                            Join meeting
                        </a>
                    </p>
                )}
                {event.address && (
                    <div>
                        <strong>Location:</strong>
                        <p>
                            📍 {event.address.city}, {event.address.address_line},{" "}
                            {event.address.postcode}
                        </p>
                        <div className="mt-5">
                            <iframe
                                className="w-full min-h-[500px] rounded-md"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_API_KEY}
                            &q=${encodeURIComponent(
                                    `${event.address.address_line}, ${event.address.city}, ${event.address.postcode}`
                                )}`}
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}