import React from 'react';
import { KPICard } from '../KPICard/KPICard';
import { StatisticsList } from '../StatisticsList/StatisticsList';
import { DailyMessagesChart } from '../DailyMessagesChart/DailyMessagesChart';
import { useKPIs } from '../../hooks/useKPIs';
import { FiRefreshCw, FiMessageSquare, FiBarChart2, FiMap, FiTrendingUp } from 'react-icons/fi';

export const KPIDashboard: React.FC = () => {
    const { kpis, loading, error, refresh } = useKPIs();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700">Error: {error}</p>
                        <button
                            onClick={refresh}
                            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-150"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!kpis) {
        return (
            <div className="min-h-screen bg-gradient-to-br bg-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center text-gray-600">
                        No hay datos disponibles
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-sky-900">
                            Dashboard de KPIs
                        </h1>
                        <p className="text-sky-600 mt-2">
                            Métricas y estadísticas del chatbot
                        </p>
                    </div>
                    <button
                        onClick={refresh}
                        className="flex items-center gap-2 bg-white text-sky-700 px-4 py-2 rounded-lg border border-sky-200 hover:bg-sky-50 transition duration-150 ease-in-out shadow-sm"
                    >
                        <FiRefreshCw className="h-4 w-4" />
                        Actualizar
                    </button>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <KPICard
                        title="Total de Mensajes"
                        value={kpis.totalMessages.toString()}
                        icon={<FiMessageSquare className="h-6 w-6" />}
                        gradient="from-blue-500 to-blue-600"
                    />

                    <KPICard
                        title="Escenas Únicas"
                        value={kpis.sceneStatistics.length.toString()}
                        icon={<FiMap className="h-6 w-6" />}
                        gradient="from-green-500 to-green-600"
                    />

                    <KPICard
                        title="Intenciones Únicas"
                        value={kpis.intentStatistics.length.toString()}
                        icon={<FiBarChart2 className="h-6 w-6" />}
                        gradient="from-purple-500 to-purple-600"
                    />

                    <KPICard
                        title="Días Activos"
                        value={kpis.dailyMessages.length.toString()}
                        icon={<FiTrendingUp className="h-6 w-6" />}
                        gradient="from-orange-500 to-orange-600"
                    />
                </div>

                {/* Charts and Statistics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Gráfico de mensajes diarios */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-sky-900 mb-4">
                            Mensajes por Día (Últimos 7 días)
                        </h2>
                        <DailyMessagesChart data={kpis.dailyMessages.slice(-7)} />
                    </div>

                    {/* Escenas más visitadas */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                        <StatisticsList
                            title="Escenas Más Visitadas"
                            data={kpis.topScenes}
                            type="scene"
                        />
                    </div>

                    {/* Intenciones más comunes */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                        <StatisticsList
                            title="Intenciones Más Comunes"
                            data={kpis.topIntents}
                            type="intent"
                        />
                    </div>

                    {/* Estadísticas detalladas */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:col-span-2">
                        <h2 className="text-lg sm:text-xl font-semibold text-sky-900 mb-4">
                            Resumen General
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-gray-700 mb-3">Top Escenas</h3>
                                <div className="space-y-2">
                                    {kpis.topScenes.slice(0, 3).map((scene, index) => (
                                        <div key={scene.scene} className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">{scene.scene}</span>
                                            <span className="font-semibold text-sky-700">{scene.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-700 mb-3">Top Intenciones</h3>
                                <div className="space-y-2">
                                    {kpis.topIntents.slice(0, 3).map((intent, index) => (
                                        <div key={intent.intent} className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">{intent.intent}</span>
                                            <span className="font-semibold text-purple-700">{intent.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};