import config from "../config";

export interface FeedbackStatistics {
    total_feedbacks: number;
    positive_feedbacks: number;
    negative_feedbacks: number;
    positive_rate_percent: number;
}

export const getFeedbackStatistics = async (): Promise<FeedbackStatistics> => {
    const response = await config.get<FeedbackStatistics>(
        '/chatbot/admin/analytics/feedback-overview'
    );
    return response.data;
};
