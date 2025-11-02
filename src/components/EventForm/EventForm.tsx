import React, { useState, useEffect } from "react";
import { Event, EventCreate, EventUpdate } from "../../types/Event";
import { FiCalendar, FiMapPin, FiType, FiFileText } from "react-icons/fi";

interface EventFormProps {
    event?: Event | null;
    onSubmit: (data: EventCreate | EventUpdate) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
    event,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        event_date: "",
        location: "",
        scene_id: 1,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                event_date: event.event_date.slice(0, 16),
                location: event.location,
                scene_id: event.scene_id,
            });
        }
    }, [event]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "El título es requerido";
        }

        if (!formData.description.trim()) {
            newErrors.description = "La descripción es requerida";
        }

        if (!formData.event_date) {
            newErrors.event_date = "La fecha del evento es requerida";
        }

        if (!formData.location.trim()) {
            newErrors.location = "La ubicación es requerida";
        }

        if (formData.scene_id < 1) {
            newErrors.scene_id = "El ID de escena debe ser mayor a 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const submitData = {
                ...formData,
                event_date: new Date(formData.event_date).toISOString(),
            };

            await onSubmit(submitData);
        } catch (error) {
            // El error se maneja en el componente padre
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "scene_id" ? parseInt(value) || 1 : value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiType className="h-4 w-4" />
                    Título del Evento
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ${errors.title ? "border-red-300" : "border-gray-300"
                        }`}
                    placeholder="Ingresa el título del evento"
                    disabled={loading}
                />
                {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                )}
            </div>

            {/* Descripción */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiFileText className="h-4 w-4" />
                    Descripción
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ${errors.description ? "border-red-300" : "border-gray-300"
                        }`}
                    placeholder="Describe el evento"
                    disabled={loading}
                />
                {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fecha del Evento */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiCalendar className="h-4 w-4" />
                        Fecha y Hora
                    </label>
                    <input
                        type="datetime-local"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ${errors.event_date ? "border-red-300" : "border-gray-300"
                            }`}
                        disabled={loading}
                    />
                    {errors.event_date && (
                        <p className="text-red-600 text-sm mt-1">{errors.event_date}</p>
                    )}
                </div>

                {/* ID de Escena */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiMapPin className="h-4 w-4" />
                        ID de Escena
                    </label>
                    <input
                        type="number"
                        name="scene_id"
                        value={formData.scene_id}
                        onChange={handleChange}
                        min="1"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ${errors.scene_id ? "border-red-300" : "border-gray-300"
                            }`}
                        disabled={loading}
                    />
                    {errors.scene_id && (
                        <p className="text-red-600 text-sm mt-1">{errors.scene_id}</p>
                    )}
                </div>
            </div>

            {/* Ubicación */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="h-4 w-4" />
                    Ubicación
                </label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ${errors.location ? "border-red-300" : "border-gray-300"
                        }`}
                    placeholder="¿Dónde será el evento?"
                    disabled={loading}
                />
                {errors.location && (
                    <p className="text-red-600 text-sm mt-1">{errors.location}</p>
                )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition duration-150 ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {loading
                        ? "Guardando..."
                        : event
                            ? "Actualizar Evento"
                            : "Crear Evento"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};
