import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiLogIn, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { useChatbotContext } from "../../context/ChatbotContext";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

// Componente para renderizar mensajes con Markdown
const MessageContent: React.FC<{ text: string; sender: "user" | "bot" }> = ({ text, sender }) => {
  if (sender === "user") {
    return <div className="whitespace-pre-wrap">{text}</div>;
  }

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
};

export const ChatbotModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { messages, sendUserMessage, loading, clearConversation, setFeedback } = useChatbotContext();
  const [input, setInput] = useState("");
  const navigateToTour = useNavigate();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendUserMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleClearChat = () => {
    clearConversation();
  };

  // Si no está autenticado, mostrar versión de login
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-start p-4 sm:items-center sm:justify-center sm:p-0">
        {/* Overlay para móviles */}
        <div className="fixed inset-0 bg-black bg-opacity-50 sm:hidden" onClick={onClose}></div>

        <div
          ref={modalRef}
          className="w-full max-w-sm h-[85vh] sm:h-[550px] sm:max-h-[80vh] bg-white rounded-2xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden border relative sm:absolute sm:bottom-28 sm:left-18"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-sky-600 text-white">
            <h2 className="text-sm font-semibold">Asistente Virtual</h2>
            <button onClick={onClose} className="hover:text-gray-200">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido para usuarios no autenticados */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-sky-50 text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
              <FiLogIn className="w-8 h-8 text-sky-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Inicia sesión para usar el asistente
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Accede a tu cuenta para poder chatear con nuestro asistente virtual y obtener ayuda personalizada.
            </p>
            <button
              onClick={handleLogin}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <FiLogIn className="w-4 h-4" />
              <span>Iniciar sesión</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Versión normal para usuarios autenticados
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-start p-4 sm:items-center sm:justify-center sm:p-0">
      {/* Overlay para móviles */}
      <div className="fixed inset-0 bg-black bg-opacity-50 sm:hidden" onClick={onClose}></div>

      <div
        ref={modalRef}
        className="w-full max-w-sm h-[85vh] sm:h-[550px] sm:max-h-[80vh] bg-white rounded-2xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden border relative sm:absolute sm:bottom-28 sm:left-18"
      >
        {/* Header con botones */}
        <div className="flex justify-between items-center px-4 py-3 bg-sky-600 text-white">
          <h2 className="text-sm font-semibold">Asistente Virtual</h2>
          {/* Botón de cerrar solo en móvil */}
          <button onClick={onClose} className="sm:hidden hover:text-gray-200">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Chat body */}
        <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-sky-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg text-sm break-words max-w-[85%] ${msg.sender === "user"
                  ? "bg-sky-600 text-white rounded-br-none"
                  : "bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm"
                  }`}
              >
                <MessageContent text={msg.text} sender={msg.sender} />

                {/* Feedback buttons for bot messages */}
                {msg.sender === "bot" && (
                  <div className="mt-2 flex items-center space-x-2 border-t border-gray-100 pt-2">
                    <button
                      onClick={() => setFeedback(idx, "like")}
                      className={`p-1 rounded hover:bg-gray-100 transition-colors ${msg.feedback === "like" ? "text-green-500" : "text-gray-400"
                        }`}
                      title="Me gusta"
                    >
                      <FiThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFeedback(idx, "dislike")}
                      className={`p-1 rounded hover:bg-gray-100 transition-colors ${msg.feedback === "dislike" ? "text-red-500" : "text-gray-400"
                        }`}
                      title="No me gusta"
                    >
                      <FiThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Render navigation action buttons when present */}
                {msg.actions && msg.actions.type === "navigation" && (
                  <div className="mt-2 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <button
                      className="bg-white border border-sky-600 text-sky-600 px-3 py-2 sm:py-1 rounded-md text-sm flex-1"
                      onClick={() => {
                        const payload = msg.actions.payload;
                        const path = payload?.pathResult?.path || payload?.navigation?.path || null;
                        if (path) {
                          localStorage.setItem("navigation_path", JSON.stringify(path));
                          // start at first element (from)
                          localStorage.setItem("navigation_step_index", "0");
                        }
                        // dispatch event so VirtualTour (if already mounted) will start stepping immediately
                        try {
                          const ev = new CustomEvent('tour:navigate', { detail: { mode: 'step', path } });
                          window.dispatchEvent(ev);
                        } catch (err) { }
                        // navigate to tour page which will process the navigation_path if not mounted
                        navigateToTour("/tour360");
                        onClose();
                      }}
                    >
                      Guiar paso a paso
                    </button>

                    <button
                      className="bg-sky-600 text-white px-3 py-2 sm:py-1 rounded-md text-sm flex-1"
                      onClick={() => {
                        const payload = msg.actions.payload;
                        const to = payload?.navigation?.to_scene || payload?.pathResult?.path?.slice(-1)[0];
                        if (to) {
                          localStorage.setItem("current_scene_id", String(to));
                        }
                        // clear any pending navigation path
                        localStorage.removeItem("navigation_path");
                        // dispatch event so VirtualTour can switch immediately if mounted
                        try {
                          const ev = new CustomEvent('tour:navigate', { detail: { mode: 'direct', to } });
                          window.dispatchEvent(ev);
                        } catch (err) { }
                        navigateToTour("/tour360");
                        onClose();
                      }}
                    >
                      Ir directo
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-lg bg-white border border-gray-200 rounded-bl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-white flex items-center">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="ml-2 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white p-2 rounded-full transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};