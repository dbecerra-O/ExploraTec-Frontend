import React, { useEffect, useState } from 'react';
import { DailyMessagesChart } from '../DailyMessagesChart/DailyMessagesChart';
import { StatisticsList } from '../StatisticsList/StatisticsList';
import { calculateKPIs, KPIs } from '../../services/admin/kpiServices';
import { getMessages } from '../../services/admin/conversationServices';
import { getFeedbackStatistics, FeedbackStatistics } from '../../services/admin/feedbackServices';

export const KPIDashboard: React.FC = () => {
    const [kpis, setKpis] = useState<KPIs | null>(null);
    const [feedbackStats, setFeedbackStats] = useState<FeedbackStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [messagesResponse, feedbackResponse] = await Promise.all([
                    getMessages(),
                    getFeedbackStatistics()
                ]);
                const kpiData = calculateKPIs(messagesResponse.messages);
                setKpis(kpiData);
                setFeedbackStats(feedbackResponse);
            } catch (err) {
                setError('Error al cargar los KPIs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-4 text-center">Cargando estadísticas...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
    if (!kpis) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actividad Diaria */}
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-sky-900 mb-4">Actividad Diaria</h3>
                    <DailyMessagesChart data={kpis.dailyMessages.slice(-7)} />
                </div>

                {/* Feedback de Usuarios */}
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-sky-900 mb-4">Feedback de Usuarios</h3>
                    {feedbackStats ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total de Feedbacks</span>
                                <span className="text-2xl font-bold text-sky-700">{feedbackStats.total_feedbacks}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-600 mb-1">Positivos</div>
                                    <div className="text-xl font-semibold text-green-600">{feedbackStats.positive_feedbacks}</div>
                                </div>
                                <div className="bg-red-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-600 mb-1">Negativos</div>
                                    <div className="text-xl font-semibold text-red-600">{feedbackStats.negative_feedbacks}</div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Tasa de Satisfacción</span>
                                    <span className={`text-lg font-bold ${feedbackStats.positive_rate_percent >= 70 ? 'text-green-600' :
                                            feedbackStats.positive_rate_percent >= 40 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {feedbackStats.positive_rate_percent.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${feedbackStats.positive_rate_percent >= 70 ? 'bg-green-500' :
                                                feedbackStats.positive_rate_percent >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${feedbackStats.positive_rate_percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-4">
                            No hay datos de feedback disponibles
                        </div>
                    )}
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
                                {kpis.topScenes.slice(0, 3).map((scene) => (
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
                                {kpis.topIntents.slice(0, 3).map((intent) => (
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
    );
};