import { getMessages } from './conversationServices';
import { Message} from '../../types/Message';

export type KPIs = {
    totalMessages: number;
    sceneStatistics: Array<{
        scene: string;
        count: number;
        percentage: number;
    }>;
    intentStatistics: Array<{
        intent: string;
        count: number;
        avgConfidence: number;
        percentage: number;
    }>;
    dailyMessages: Array<{
        date: string;
        count: number;
    }>;
    topIntents: Array<{
        intent: string;
        count: number;
    }>;
    topScenes: Array<{
        scene: string;
        count: number;
    }>;
};

export const getKPIs = async (): Promise<KPIs> => {
    try {
        const messagesData: Message[] = [];
        let skip = 0;
        const limit = 100;
        let totalMessages = 0;

        const firstResponse = await getMessages(0, 1);
        totalMessages = firstResponse.total_messages;

        while (skip < totalMessages) {
            const response = await getMessages(skip, limit);
            messagesData.push(...response.messages);

            if (response.messages.length < limit) {
                break;
            }
            skip += limit;
        }

        return calculateKPIs(messagesData);
    } catch (error) {
        console.error('Error fetching KPIs:', error);
        throw new Error('No se pudieron cargar las métricas del chatbot');
    }
};

const calculateKPIs = (messages: Message[]): KPIs => {
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

        const date = new Date(message.created_at).toISOString().split('T')[0];
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