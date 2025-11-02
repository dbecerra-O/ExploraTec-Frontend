import { useState, useEffect } from 'react';
import { Event, EventCreate, EventUpdate } from '../types/Event';
import { EventServices } from '../services/admin/EventServices';

export const useEvents = (autoFetch = true) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await EventServices.getEvents();
            setEvents(response.events);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error cargando eventos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchEvents();
        }
    }, [autoFetch]);

    const createEvent = async (eventData: EventCreate): Promise<Event> => {
        try {
            setLoading(true);
            const newEvent = await EventServices.createEvent(eventData);
            setEvents(prev => [...prev, newEvent]);
            return newEvent;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error creando evento';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateEvent = async (eventId: number, eventData: EventUpdate): Promise<Event> => {
        try {
            setLoading(true);
            const updatedEvent = await EventServices.updateEvent(eventId, eventData);
            setEvents(prev => prev.map(event =>
                event.id === eventId ? updatedEvent : event
            ));
            return updatedEvent;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error actualizando evento';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deleteEvent = async (eventId: number): Promise<void> => {
        try {
            setLoading(true);
            await EventServices.deleteEvent(eventId);
            setEvents(prev => prev.filter(event => event.id !== eventId));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error eliminando evento';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        events,
        loading,
        error,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        };
};