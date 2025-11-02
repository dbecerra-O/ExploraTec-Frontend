import React, { useState } from 'react';
import { Event, EventCreate, EventUpdate } from '../types/Event';
import { useEvents } from '../hooks/useEvents';
import { EventList } from '../components/EventList/EventList';
import AdminNavbar from '../components/AdminNavbar/AdminNavbar';
import { EventForm } from '../components/EventForm/EventForm';
import { FiPlus, FiCalendar } from 'react-icons/fi';

export const EventsAdminPage: React.FC = () => {
    const { events, loading, error, createEvent, updateEvent, deleteEvent } = useEvents();
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const handleCreateEvent = async (eventData: EventCreate) => {
        setFormLoading(true);
        try {
            await createEvent(eventData);
            setShowForm(false);
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdateEvent = async (eventData: EventUpdate) => {
        if (!editingEvent) return;

        setFormLoading(true);
        try {
            await updateEvent(editingEvent.id, eventData);
            setEditingEvent(null);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            try {
                await deleteEvent(eventId);
            } catch (error) {
                alert('Error eliminando el evento');
            }
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingEvent(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="p-6 max-w-7xl mx-auto">

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <FiCalendar className="h-6 w-6 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-sky-900">
                                Administrar Eventos
                            </h1>
                            <p className="text-sky-600 mt-1">
                                Gestiona los eventos del sistema
                            </p>
                        </div>
                    </div>

                    {!showForm && !editingEvent && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition duration-150 shadow-sm"
                        >
                            <FiPlus className="h-4 w-4" />
                            Nuevo Evento
                        </button>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Formulario */}
                {(showForm || editingEvent) && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
                        </h2>
                        <EventForm
                            event={editingEvent}
                            onSubmit={async (data: EventCreate | EventUpdate) => {
                                if (editingEvent) {
                                    await handleUpdateEvent(data as EventUpdate);
                                } else {
                                    await handleCreateEvent(data as EventCreate);
                                }
                            }}
                            onCancel={handleCancel}
                            loading={formLoading}
                        />
                    </div>
                )}

                {/* Lista de Eventos */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Eventos Registrados
                        </h2>
                        <span className="text-sm text-gray-500">
                            {events.length} evento{events.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <EventList
                        events={events}
                        onEdit={handleEdit}
                        onDelete={handleDeleteEvent}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
        </div>
    );
};

export default EventsAdminPage;