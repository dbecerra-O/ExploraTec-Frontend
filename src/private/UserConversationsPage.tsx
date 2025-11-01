// src/pages/private/UserConversationsPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ConversationList from "../components/UserConversationsList/UserConversationList";
import AdminNavbar from "../components/AdminNavbar/AdminNavbar";

const UserConversationsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <>
    <AdminNavbar />
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Las conversaciones del usuario
        </h2>
        <Link
          to={`/dashboard`}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Volver
        </Link>
      </div>
      <ConversationList userId={userId ? Number(userId) : null} />
    </div>
    </>
  );
};

export default UserConversationsPage;
