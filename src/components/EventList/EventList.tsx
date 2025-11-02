import React from 'react';
import { Event } from '../../types/Event';
import { FiCalendar, FiMapPin, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface EventListProps {
    events: Event[];
    onEdit: (event: Event) => void;
    onDelete: (eventId: number) => void;
    loading?: boolean;
}

export const EventList: React.FC<EventListProps> = ({
    events,
    onEdit,
    onDelete,
    loading = false
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No hay eventos registrados
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {events.map((event) => (
                <div
                    key={event.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {event.title}
                                </h3>
                            </div>

                            <p className="text-gray-600 mb-3">{event.description}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <FiCalendar className="h-4 w-4" />
                                    <span>{formatDate(event.event_date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FiMapPin className="h-4 w-4" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">Escena:</span>
                                    <span>#{event.scene_id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">

                            <button
                                onClick={() => onEdit(event)}
                                className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors duration-150"
                                title="Editar"
                            >
                                <FiEdit2 className="h-5 w-5" />
                            </button>

                            <button
                                onClick={() => onDelete(event.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                title="Eliminar"
                            >
                                <FiTrash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};