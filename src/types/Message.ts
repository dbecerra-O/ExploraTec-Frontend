export type Message = {
    id: number;
    content: string;
    username: string;
    conversation_title: string;
    scene_context: string;
    is_from_user: boolean;
    intent_category: string;
    intent_confidence: number;
    intent_keywords: string[];
    requires_clarification: boolean;
    tokens_used: number | null;
    created_at: string;
};

export type MessagesResponse = {
    total_messages: number;
    showing: number;
    skip: number;
    limit: number;
    intent_statistics: Array<{
        category: string;
        count: number;
        avg_confidence: number;
    }>;
    messages: Message[];
};