import config from "../config";
import { Event, EventCreate, EventUpdate, EventsResponse } from "../../types/Event";

export const EventServices = {
    createEvent: async (eventData: EventCreate): Promise<Event> => {
        const response = await config.post<Event>("/events/", eventData);
        return response.data;
    },

    getEvents: async (skip?: number, limit?: number): Promise<EventsResponse> => {
        const params = new URLSearchParams();
        if (skip) params.append('skip', skip.toString());
        if (limit) params.append('limit', limit.toString());

        const response = await config.get<Event[]>(`/events?${params.toString()}`);

        return {
            events: response.data,
            total: response.data.length,
            skip: skip || 0,
            limit: limit || 50
        };
    },

    getEvent: async (eventId: number): Promise<Event> => {
        const response = await config.get<Event>(`/events/${eventId}`);
        return response.data;
    },

    updateEvent: async (eventId: number, eventData: EventUpdate): Promise<Event> => {
        const response = await config.patch<Event>(`/events/${eventId}`, eventData);
        return response.data;
    },

    deleteEvent: async (eventId: number): Promise<{ message: string }> => {
        const response = await config.delete(`/events/${eventId}`);
        return response.data;
    },

    toggleEventStatus: async (eventId: number, isActive: boolean): Promise<Event> => {
        return EventServices.updateEvent(eventId, { is_active: isActive });
    }
};