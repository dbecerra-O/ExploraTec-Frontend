import React from "react";
import { useUserConversations } from "../../hooks/useConversation";
import { Link } from "react-router-dom";

type ConversationListProps = {
  userId: number | null;
};

const UserConversationsList: React.FC<ConversationListProps> = ({ userId }) => {
  const { conversations, loading, error } = useUserConversations(userId);

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
        <div className="text-6xl mb-4">👤</div>
        <p className="text-gray-500 text-lg font-medium">Selecciona un usuario</p>
        <p className="text-gray-400 mt-2">Para ver sus conversaciones</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 border border-gray-200 rounded-xl">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
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
        <p className="text-red-700 font-medium text-lg mb-2">Error al cargar conversaciones</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💬</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Conversaciones</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="p-6">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-gray-300">💭</div>
            <p className="text-gray-500 text-lg font-medium">No hay conversaciones</p>
            <p className="text-gray-400 mt-2">Este usuario no tiene conversaciones aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="group border border-gray-200 rounded-xl p-4 hover:border-cyan-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 truncate">
                        {conv.title || "Conversación sin título"}
                      </h4>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span>{conv.message_count} mensajes</span>
                      </span>
                      
                      {conv.created_at && (
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {new Date(conv.created_at).toLocaleDateString('es-ES')}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 ml-4">
                    <Link
                      to={`/user/${userId}/conversations/${conv.id}/messages`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Ver Mensajes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span>
                Total: {conversations.length}
              </span>
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Mensajes totales: {conversations.reduce((acc, conv) => acc + conv.message_count, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserConversationsList;