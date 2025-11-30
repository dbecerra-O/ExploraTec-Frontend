import React from "react";
import { useConversationMessages } from "../../hooks/useConversationMessages";

type Props = {
  userId: number | null;
  conversationId: number | null;
};

const ConversationMessages: React.FC<Props> = ({ userId, conversationId }) => {
  const { conversation, loading, error } = useConversationMessages(
    userId,
    conversationId
  );

  if (!userId || !conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
        <div className="text-6xl mb-4">💬</div>
        <p className="text-gray-500 text-lg font-medium">Selecciona una conversación</p>
        <p className="text-gray-400 mt-2">Para ver los mensajes</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[70%] ${i % 2 === 0 ? "ml-auto bg-gray-200" : "mr-auto bg-gray-200"
                  }`}
              >
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <div className="text-red-500 text-4xl mb-3">⚠️</div>
        <p className="text-red-700 font-medium text-lg mb-2">Error al cargar la conversación</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-220px)]">
      {/* Header de la conversación */}
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="text-white font-semibold text-lg">
                {conversation?.title || "Conversación sin título"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor de mensajes con scroll */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="space-y-4">
          {conversation?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.is_from_user ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex flex-col max-w-[75%] sm:max-w-[70%] ${msg.is_from_user ? "items-end" : "items-start"
                  }`}
              >
                {/* Burbuja de mensaje */}
                <div
                  className={`px-4 py-3 rounded-2xl break-words ${msg.is_from_user
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                    }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Información del mensaje */}
                <div className={`flex items-center space-x-2 mt-1 ${msg.is_from_user ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>

                  {msg.is_from_user && (
                    <span className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleDateString('es-ES')}
                    </span>
                  )}
                </div>

                {/* Feedback */}
                {msg.feedback && (
                  <div
                    className={`mt-2 flex items-center space-x-2 px-3 py-2 rounded-lg border ${msg.feedback.is_positive
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                      } ${msg.is_from_user ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${msg.feedback.is_positive ? "bg-green-500" : "bg-red-500"
                      }`}></div>
                    <span className="text-sm font-medium">
                      {msg.feedback.is_positive ? "👍" : "👎"} Feedback:
                    </span>
                    <span className="text-sm">{msg.feedback.comment}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Estado vacío */}
          {(!conversation?.messages || conversation.messages.length === 0) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-gray-300">💭</div>
              <p className="text-gray-500 text-lg font-medium">No hay mensajes</p>
              <p className="text-gray-400 mt-2">Esta conversación está vacía</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer con estadísticas */}
      <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            {conversation?.messages && (
              <span>
                Mensajes: {conversation.messages.length}
              </span>
            )}
          </div>
          <div>
            {conversation?.created_at && (
              <span>
                Creada: {new Date(conversation.created_at).toLocaleDateString('es-ES')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationMessages;