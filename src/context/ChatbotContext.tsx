import React, { createContext, useContext, ReactNode } from 'react';
import { useChatbot } from '../hooks/useChatbot';

// Define the shape of the context based on what useChatbot returns
type ChatbotContextType = ReturnType<typeof useChatbot>;

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const chatbotState = useChatbot();

    return (
        <ChatbotContext.Provider value={chatbotState}>
            {children}
        </ChatbotContext.Provider>
    );
};

export const useChatbotContext = () => {
    const context = useContext(ChatbotContext);
    if (context === undefined) {
        throw new Error('useChatbotContext must be used within a ChatbotProvider');
    }
    return context;
};
