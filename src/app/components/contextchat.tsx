'use client';

import React, { createContext, useContext, useState, ReactNode, FormEvent } from 'react';

interface Message {
    role: string;
    content: string;
}

interface Chat {
    id: string;
    title: string;
    messages: Message[];
}

interface ChatContextType {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    history: Chat[];
    setHistory: React.Dispatch<React.SetStateAction<Chat[]>>;
    selectedChat: string | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    startNewChat: () => void;
    selectChat: (id: string) => void;
    handleSubmit: (event: FormEvent) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const startNewChat = () => {
        setSelectedChat(null);
        setMessages([]);
    };

    const selectChat = (id: string) => {
        setSelectedChat(id);
        const chat = history.find((chat) => chat.id === id);
        if (chat) setMessages(chat.messages);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages, chatId: selectedChat }),
            });

            if (!response.ok) throw new Error('Failed to fetch from API');

            const { answer, chatId } = await response.json();
            const botMessage = { role: 'assistant', content: answer };

            const updatedMessages = [...newMessages, botMessage];
            setMessages(updatedMessages);

            if (!selectedChat && chatId) {
                setSelectedChat(chatId);
                setHistory((prev) => [
                    ...prev,
                    { id: chatId, title: `Chat: ${input}`, messages: updatedMessages },
                ]);
            } else {
                setHistory((prev) =>
                    prev.map((chat) =>
                        chat.id === chatId ? { ...chat, messages: updatedMessages } : chat
                    )
                );
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                setMessages,
                input,
                setInput,
                history,
                setHistory,
                selectedChat,
                setSelectedChat,
                theme,
                toggleTheme,
                startNewChat,
                selectChat,
                handleSubmit,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};
