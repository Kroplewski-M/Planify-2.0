import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import EventForm from "../../components/EventForm";
import { type EventFormData, EventType } from "../../models/Event";

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [eventData, setEventData] = useState<EventFormData | null>(null);
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        axiosClient.get(`/events/${id}`)
            .then(res => {
                const data = res.data;
                const initialValues: EventFormData = {
                    name: data.name,
                    description: data.description,
                    happening_at: data.happening_at,
                    happening_until: data.happening_until,
                    publish: data.publish,
                    max_attendees: data.max_attendees,
                    event_type: data.meeting ? EventType.ONLINE : EventType.ADDRESS,
                    meeting: data.meeting
                        ? {
                            id: data.meeting.id,
                            link: data.meeting.link,
                            created_at: data.meeting.created_at,
                            updated_at: data.meeting.updated_at
                        }
                        : null,
                    address: data.address
                        ? {
                            address_line: data.address.address_line,
                            city: data.address.city,
                            postcode: data.address.postcode
                        }
                        : {
                            address_line: "",
                            city: "",
                            postcode: ""
                        }
                };
                setEventData(initialValues);
            })
            .catch(() => {
                setServerErrors(["Failed to load event"]);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = (form: EventFormData) => {
        axiosClient.put(`/events/${id}`, form)
            .then(() => navigate(`/events/${id}`))
            .catch(err => {
                const response = err.response.data;
                if (response?.errors) {
                    const flattened = Object.values(response.errors).flat() as string[];
                    setServerErrors(flattened);
                } else if (response?.error) {
                    setServerErrors([response.error]);
                } else {
                    setServerErrors(["Unexpected server error"]);
                }
            });
    };
    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (!eventData) return <div className="p-6 text-center">Event not found.</div>;

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold mb-5 text-accent">Edit Event</h1>
                <EventForm
                    initialValues={eventData}
                    onSubmit={handleSubmit}
                    serverErrors={serverErrors}
                    submitLabel="Update Event"
                />
            </div>
        </div>

    );
}