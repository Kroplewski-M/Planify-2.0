export interface EventAddress {
    address_line: string;
    city: string;
    postcode: string;
}

export const EventType = {
    ONLINE: "ONLINE",
    ADDRESS: "ADDRESS",
} as const;

export type EventType = typeof EventType[keyof typeof EventType];

export interface EventMeeting {
    id: string;
    link: string;
    created_at: string;
    updated_at: string;
}
export interface EventFormData {
    name: string;
    description?: string;
    happening_at: string;
    happening_until?: string | null;
    publish: boolean;
    max_attendees?: number | null;
    event_type: EventType;
    meeting?: EventMeeting | null;
    address?: EventAddress | null;
}
export interface Attendees {
    id: number,
    name: string,
}
export interface Event extends EventFormData {
    id: string;
    created_by_user_id: number;
    attendees: Attendees[];
}