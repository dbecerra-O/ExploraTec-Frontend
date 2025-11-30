import api from "../config";

interface SendMessagePayload {
  content: string;
  conversation_id?: number | null;
  scene_context?: string | null;
}

export const sendMessage = async (payload: SendMessagePayload) => {
  const { data } = await api.post("/chatbot/message", payload);
  return data;
};

export const getConversations = async () => {
  const { data } = await api.get("/chatbot/conversations");
  return data;
};

export const getConversationDetails = async (conversationId: number) => {
  const { data } = await api.get(`/chatbot/conversations/${conversationId}`);
  return data;
};

export const sendFeedback = async (messageId: number, feedback: "like" | "dislike") => {
  const isPositive = feedback === "like";
  const { data } = await api.post(`/chatbot/messages/${messageId}/feedback`, { is_positive: isPositive });
  return data;
};