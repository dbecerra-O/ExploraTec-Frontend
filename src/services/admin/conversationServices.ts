import config from "../config";
import { ConversationDetail } from "../../types/Conversation";
import { MessagesResponse } from "../../types/Message";

export type Conversation = {
  id: number;
  title: string;
  scene_id: string | null;
  is_active: boolean;
  user_id: number;
  created_at: string;
  updated_at: string | null;
  message_count: number;
};

export const getUserConversations = async (userId: number): Promise<Conversation[]> => {
  const response = await config.get<Conversation[]>(`/admin/users/${userId}/conversations`);
  return response.data;
};

export const getConversationMessages = async (
  userId: number,
  conversationId: number
): Promise<ConversationDetail> => {
  const response = await config.get<ConversationDetail>(
    `/chatbot/admin/users/${userId}/conversations/${conversationId}/messages`
  );
  return response.data;
};

export const getMessages = async (
  skip?: number,
  limit?: number
): Promise<MessagesResponse> => {
  const params = new URLSearchParams();
  if (skip) params.append('skip', skip.toString());
  if (limit) params.append('limit', limit.toString());
  
  const response = await config.get<MessagesResponse>(
    `/chatbot/admin/messages?${params.toString()}`
  );
  return response.data;
};