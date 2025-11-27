import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventForm from "../../components/EventForm";
import type { EventFormData } from "../../models/Event";
import axiosClient from "../../axios-client";

export default function CreateEvent() {
    const navigate = useNavigate();
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const onSubmit = (data: EventFormData) => {
        if (data.address && !data.address.address_line) {
            data.address = null;
        }
        if (data.meeting_link === "") {
            data.meeting_link = null;
        }

        axiosClient.post("/events", data)
            .then(() => navigate("/events"))
            .catch(err => {
                const response = err.response?.data;
                if (response?.errors) {
                    const flat = Object.values(response.errors).flat() as string[];
                    setServerErrors(flat);
                } else {
                    setServerErrors(["Unexpected error"]);
                }
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-semibold text-center mb-6 text-accent">
                    Create Event
                </h1>
                <EventForm
                    onSubmit={onSubmit}
                    serverErrors={serverErrors}
                    submitLabel="Create Event"
                />
            </div>
        </div>
    );
}
