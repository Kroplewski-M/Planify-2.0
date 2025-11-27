import type { Event } from "../models/Event";
import { dateFormatter } from "../models/Shared";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event }: { event: Event }) {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/events/${event.id}`)} className="bg-white rounded-xl p-4 shadow cursor-pointer duration-150 hover:scale-[1.1]">
            <h2 className="text-xl font-semibold">{event.name}</h2>
            <p className="text-sm">{event.description}</p>

            <div className="mt-4 text-sm">
                <strong>Starts:</strong> {dateFormatter.format(new Date(event.happening_at))}
                <br />
                {
                    event.happening_until != undefined ? (<>
                        <strong>Ends:</strong> {dateFormatter.format(new Date(event.happening_until))}
                    </>) : (<></>)
                }
            </div>
            <div className="mt-4">
                {event.meeting && (
                    <a href={event.meeting.link} target="_blank" className="underline">Online Meeting</a>
                )}
                {event.address && (
                    <p className="text-sm">
                        📍{event.address.city}, {event.address.address_line}, {event.address.postcode}
                    </p>
                )}
            </div>
        </div>
    );
}
