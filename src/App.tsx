import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./public/Login";
import { Register } from "./public/Register";
import { Main } from "./public/Main";
import { Dashboard } from "./private/Dashboard";
import { PublicRoute } from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import ChatbotTourPage from "./public/tour360/ChatbotWithTourPage";
import UserConversationsPage from "./private/UserConversationsPage";
import ConversationMessagesPage from "./private/ConversationMessagesPage ";
import AdminKPIsPage from "./private/AdminKPIsPage";
import EventsAdminPage from "./private/EventsAdminPage";
import { ChatbotProvider } from "./context/ChatbotContext";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas que SOLO deben ser accesibles para usuarios NO autenticados */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Rutas públicas que pueden ser accedidas*/}
        <Route path="/" element={<Main />} />
        <Route
          path="/tour360"
          element={
            <ChatbotProvider>
              <ChatbotTourPage />
            </ChatbotProvider>
          }
        />

        {/* Rutas protegidas que requieren autenticación */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <EventsAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kpis"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminKPIsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:userId/conversations"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UserConversationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/:userId/conversations/:conversationId/messages"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <ConversationMessagesPage />
            </ProtectedRoute>
          }
        />

        {/* Redirección default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;