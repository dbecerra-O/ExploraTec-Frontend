import React from "react";
import { useParams, Link } from "react-router-dom";
import ConversationMessages from "../components/ConversationMessages/ConversationMessages";
import AdminNavbar from "../components/AdminNavbar/AdminNavbar";

const ConversationMessagesPage: React.FC = () => {
  const { userId, conversationId } = useParams<{
    userId: string;
    conversationId: string;
  }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Mensajes de la conversación {conversationId}
        </h2>
        <Link
          to={`/users/${userId}/conversations`}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Volver
        </Link>
      </div>

      <ConversationMessages
        userId={userId ? Number(userId) : null}
        conversationId={conversationId ? Number(conversationId) : null}
      />
    </div>
  </div>
  );
};

export default ConversationMessagesPage;
