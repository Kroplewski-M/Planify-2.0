export interface EventAddress {
    address_line: string;
    city: string;
    postcode: string;
}
export enum EventType {
    ONLINE = "ONLINE",
    ADDRESS = "ADDRESS"
}
export interface EventFormData {
    name: string;
    description?: string;
    happening_at: string;
    happening_until?: string | null;
    publish: boolean;
    max_attendees?: number | null;
    event_type: EventType;
    meeting_link?: string | null;
    address?: EventAddress | null;
}

export interface Event extends EventFormData {
    id: string;
    created_by_user_id: number;
}