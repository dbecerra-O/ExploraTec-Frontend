import { useState, useEffect } from "react";
import { sendMessage, sendFeedback as sendFeedbackApi } from "../services/user/chatService";
import { findShortestPath } from "../utils/dijkstra";

interface Message {
  id?: number;
  sender: "user" | "bot";
  text: string;
  actions?: any;
  feedback?: "like" | "dislike";
}


// Normaliza el texto del assistant para eliminar líneas de 'Ruta sugerida' cuando
// la respuesta JSON incluye metadata de navegación. También intenta comparar
// la ruta textual con navigation.path para deduplicar con más seguridad.
function normalizeAssistantText(responseJson: any) {
  if (!responseJson) return responseJson;

  const nav = responseJson.navigation || responseJson.navigation_data || null;
  if (!nav) return responseJson;

  let text: string = responseJson.assistant_message?.content ?? "";
  if (typeof text !== 'string' || text.trim() === '') return responseJson;

  const lines = text.split(/\r?\n/);
  const filteredLines: string[] = [];
  let removed = false;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (line.includes("🗺️") || lower.includes("ruta sugerida")) {
      removed = true;
      continue;
    }
    filteredLines.push(line);
  }

  if (!removed && nav?.path && Array.isArray(nav.path) && nav.path.length > 0) {
    const pathCandidates = [
      nav.path.join(' → '),
      nav.path.join(' - '),
      nav.path.join(' -> '),
      nav.path.join(', '),
      nav.path.join(' ')
    ];

    const newFiltered: string[] = [];
    for (const line of lines) {
      const lowered = line.toLowerCase();
      let matched = false;
      for (const cand of pathCandidates) {
        if (cand && lowered.includes(cand.toLowerCase())) {
          matched = true;
          break;
        }
      }
      if (matched) {
        removed = true;
        continue;
      }
      newFiltered.push(line);
    }
    if (removed) {
      filteredLines.length = 0;
      filteredLines.push(...newFiltered);
    }
  }

  if (removed) {
    const last = filteredLines[filteredLines.length - 1] ?? "";
    if (!/que\s+accion\s+desear/i.test(last)) {
      filteredLines.push("Que accion deseas realizar:");
    }
    responseJson.assistant_message.content = filteredLines.join('\n');
  }

  return responseJson;
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
      console.log("[useChatbot] Sending message with scene_context:", sceneContextId);
      const response = await sendMessage({
        content,
        conversation_id: conversationId,
        scene_context: sceneContextId,
      });

      // DEBUG: log raw response to help detect duplicate suggestions
      // (remove or guard this in production)
      try {
        console.log("[useChatbot] sendMessage response:", response);
      } catch (err) { }

      // Validar respuesta
      if (!response?.assistant_message?.content) {
        throw new Error("Respuesta inválida del servidor");
      }

      if (response.is_new_conversation) {
        setConversationId(response.conversation.id);
      }

      // Normalize assistant text to remove duplicated route lines when navigation metadata exists
      const normalizedResponse = normalizeAssistantText(response);
      const assistantText = normalizedResponse.assistant_message?.content ?? response.assistant_message?.content ?? "";
      const nav = response.navigation || response.navigation_data || null;

      setMessages((prev) => [
        ...prev,
        {
          id: response.assistant_message?.id,
          sender: "bot",
          text: assistantText
        }
      ]);
      // nav already computed below
      const intent = response.assistant_message?.intent_category || response.intent_category || null;
      const toScene = nav?.to_scene || nav?.to_scene_id || nav?.to_scene_name || null;

      if ((intent === "navegacion" || nav) && toScene) {
        // try to compute shortest path using current sceneContextId and app data
        const fromId = sceneContextId || response.from_scene || nav?.from_scene || null;
        const toId = typeof toScene === "string" ? toScene : String(toScene);
        console.log("[useChatbot] Navigation path calculation:", {
          sceneContextId,
          fromId,
          toId,
          response_from_scene: response.from_scene,
          nav_from_scene: nav?.from_scene
        });
        const pathResult = fromId ? findShortestPath(fromId, toId) : null;

        // Determine whether navigation should be offered:
        // - if backend explicitly indicates already_here, don't offer
        // - if backend indicates should_navigate === false, don't offer
        // - if pathResult indicates zero distance or same from/to, don't offer
        const backendAlreadyHere = nav?.already_here === true;
        const backendShouldNavigateFalse = nav?.should_navigate === false;
        const sameScene = !!(fromId && toId && String(fromId) === String(toId));
        const zeroDistance = !!(pathResult && Array.isArray(pathResult.path) && pathResult.path.length <= 1);

        const offerNavigation = !(backendAlreadyHere || backendShouldNavigateFalse || sameScene || zeroDistance);

        if (offerNavigation) {
          const actionPayload = {
            navigation: nav,
            intent_category: intent,
            // pathResult removed - will be calculated dynamically when button is clicked
          };

          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "", actions: { type: "navigation", payload: actionPayload } }
          ]);
        } else {
          // Optionally, we could append a short confirmation action or do nothing.
          // For now, do not add navigation buttons when user is already at destination.
        }
      }
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

  const setFeedback = async (index: number, feedback: "like" | "dislike") => {
    // Optimistic update
    setMessages((prev) => {
      const newMessages = [...prev];
      if (newMessages[index]) {
        if (newMessages[index].feedback === feedback) {
          const { feedback: _, ...rest } = newMessages[index];
          newMessages[index] = rest;
        } else {
          newMessages[index] = { ...newMessages[index], feedback };
        }
      }
      return newMessages;
    });

    // API call
    const message = messages[index];
    if (message && message.id) {
      try {
        await sendFeedbackApi(message.id, feedback);
      } catch (error) {
        console.error("Failed to send feedback:", error);
        // Optionally revert optimistic update here
      }
    }
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
    updateSceneContext,
    setFeedback
  };
};