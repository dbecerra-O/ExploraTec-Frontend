import { useState, useEffect } from "react";
import { sendMessage } from "../services/user/chatService";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const STORAGE_KEY = "chatbot_messages";
const CONVERSATION_ID_KEY = "chatbot_conversation_id";
const SCENE_CONTEXT_KEY = "chatbot_scene_context_id";

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { sender: "bot", text: "¡Hola! Soy tu asistente virtual 🤖, ¿en qué puedo ayudarte?" }
    ];
  });
  
  const [conversationId, setConversationId] = useState<number | null>(() => {
    const saved = localStorage.getItem(CONVERSATION_ID_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [sceneContextId, setSceneContextId] = useState<string | null>(() => {
    const saved = localStorage.getItem(SCENE_CONTEXT_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loading, setLoading] = useState(false);

  // Persistir mensajes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Persistir conversationId
  useEffect(() => {
    if (conversationId !== null) {
      localStorage.setItem(CONVERSATION_ID_KEY, JSON.stringify(conversationId));
    } else {
      localStorage.removeItem(CONVERSATION_ID_KEY);
    }
  }, [conversationId]);

  // Persistir sceneContextId
  useEffect(() => {
    if (sceneContextId !== null) {
      localStorage.setItem(SCENE_CONTEXT_KEY, JSON.stringify(sceneContextId));
    } else {
      localStorage.removeItem(SCENE_CONTEXT_KEY);
    }
  }, [sceneContextId]);

  const sendUserMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: content }]);
    setLoading(true);

    try {
      const response = await sendMessage({
        content,
        conversation_id: conversationId,
        scene_context: sceneContextId,
      });

      // Validar respuesta
      if (!response?.assistant_message?.content) {
        throw new Error("Respuesta inválida del servidor");
      }

      if (response.is_new_conversation) {
        setConversationId(response.conversation.id);
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.assistant_message.content }
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `Error: ${error.message}`
        : "Error al conectar con el servidor";
      
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: errorMessage }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateSceneContext = (sceneId: string | null) => {
    setSceneContextId(sceneId);
  };

  const clearConversation = () => {
    setMessages([
      { sender: "bot", text: "¡Hola! Soy tu asistente virtual 🤖, ¿en qué puedo ayudarte?" }
    ]);
    setConversationId(null);
    setSceneContextId(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONVERSATION_ID_KEY);
    localStorage.removeItem(SCENE_CONTEXT_KEY);
  };

  return { 
    messages, 
    sendUserMessage, 
    loading, 
    clearConversation,
    conversationId,
    sceneContextId,
    updateSceneContext
  };
};