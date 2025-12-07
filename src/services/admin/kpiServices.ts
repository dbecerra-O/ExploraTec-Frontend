import { Message } from "../../types/Message";

export interface KPIs {
    totalMessages: number;
    sceneStatistics: { scene: string; count: number; percentage: number }[];
    intentStatistics: { intent: string; count: number; avgConfidence: number; percentage: number }[];
    dailyMessages: { date: string; count: number }[];
    topIntents: { intent: string; count: number; avgConfidence: number; percentage: number }[];
    topScenes: { scene: string; count: number; percentage: number }[];
}

export const calculateKPIs = (
    messages: Message[],
    totalMessagesCount?: number,
    backendIntentStats?: { category: string; count: number; avg_confidence: number }[]
): KPIs => {
    // Estadísticas de escenas
    const sceneCounts: Record<string, number> = {};
    const dailyCounts: Record<string, number> = {};

    // Si no se proveen estadísticas del backend, las calculamos manualmente (fallback)
    const intentCounts: Record<string, number> = {};
    const intentConfidences: Record<string, number[]> = {};

    messages.forEach(message => {
        // Contar por escena
        const scene = message.scene_context || 'sin_escena';
        sceneCounts[scene] = (sceneCounts[scene] || 0) + 1;

        // Extraer fecha en UTC para evitar problemas de zona horaria
        const dateObj = new Date(message.created_at);
        const date = `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, '0')}-${String(dateObj.getUTCDate()).padStart(2, '0')}`;
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;

        if (!backendIntentStats) {
            // Contar por intención solo si no tenemos datos del backend
            const intent = message.intent_category || 'sin_intencion';
            intentCounts[intent] = (intentCounts[intent] || 0) + 1;

            if (!intentConfidences[intent]) {
                intentConfidences[intent] = [];
            }
            intentConfidences[intent].push(message.intent_confidence);
        }
    });

    // Calcular porcentajes y promedios
    const total = totalMessagesCount || messages.length;

    const sceneStatistics = Object.entries(sceneCounts)
        .map(([scene, count]) => ({
            scene,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count);

    let intentStatistics;

    if (backendIntentStats) {
        // Usar datos del backend
        intentStatistics = backendIntentStats
            .map(stat => ({
                intent: stat.category,
                count: stat.count,
                avgConfidence: stat.avg_confidence,
                percentage: total > 0 ? (stat.count / total) * 100 : 0
            }))
            .sort((a, b) => b.count - a.count);
    } else {
        // Usar cálculo manual
        intentStatistics = Object.entries(intentCounts)
            .map(([intent, count]) => ({
                intent,
                count,
                avgConfidence: intentConfidences[intent]
                    ? intentConfidences[intent].reduce((a, b) => a + b, 0) / intentConfidences[intent].length
                    : 0,
                percentage: total > 0 ? (count / total) * 100 : 0
            }))
            .sort((a, b) => b.count - a.count);
    }

    const dailyMessages = Object.entries(dailyCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

    return {
        totalMessages: total,
        sceneStatistics,
        intentStatistics,
        dailyMessages,
        topIntents: intentStatistics.slice(0, 5),
        topScenes: sceneStatistics.slice(0, 5)
    };
};