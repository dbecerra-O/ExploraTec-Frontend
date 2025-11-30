import { Message } from "../../types/Message";

export interface KPIs {
    totalMessages: number;
    sceneStatistics: { scene: string; count: number; percentage: number }[];
    intentStatistics: { intent: string; count: number; avgConfidence: number; percentage: number }[];
    dailyMessages: { date: string; count: number }[];
    topIntents: { intent: string; count: number; avgConfidence: number; percentage: number }[];
    topScenes: { scene: string; count: number; percentage: number }[];
}

export const calculateKPIs = (messages: Message[]): KPIs => {
    // Estadísticas de escenas
    const sceneCounts: Record<string, number> = {};
    const intentCounts: Record<string, number> = {};
    const intentConfidences: Record<string, number[]> = {};
    const dailyCounts: Record<string, number> = {};

    messages.forEach(message => {
        // Contar por escena
        const scene = message.scene_context || 'sin_escena';
        sceneCounts[scene] = (sceneCounts[scene] || 0) + 1;

        // Contar por intención
        const intent = message.intent_category || 'sin_intencion';
        intentCounts[intent] = (intentCounts[intent] || 0) + 1;

        if (!intentConfidences[intent]) {
            intentConfidences[intent] = [];
        }
        intentConfidences[intent].push(message.intent_confidence);

        // Extraer fecha en UTC para evitar problemas de zona horaria
        const dateObj = new Date(message.created_at);
        const date = `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, '0')}-${String(dateObj.getUTCDate()).padStart(2, '0')}`;
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    // Calcular porcentajes y promedios
    const totalMessages = messages.length;

    const sceneStatistics = Object.entries(sceneCounts)
        .map(([scene, count]) => ({
            scene,
            count,
            percentage: (count / totalMessages) * 100
        }))
        .sort((a, b) => b.count - a.count);

    const intentStatistics = Object.entries(intentCounts)
        .map(([intent, count]) => ({
            intent,
            count,
            avgConfidence: intentConfidences[intent]
                ? intentConfidences[intent].reduce((a, b) => a + b, 0) / intentConfidences[intent].length
                : 0,
            percentage: (count / totalMessages) * 100
        }))
        .sort((a, b) => b.count - a.count);

    const dailyMessages = Object.entries(dailyCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

    return {
        totalMessages,
        sceneStatistics,
        intentStatistics,
        dailyMessages,
        topIntents: intentStatistics.slice(0, 5),
        topScenes: sceneStatistics.slice(0, 5)
    };
};