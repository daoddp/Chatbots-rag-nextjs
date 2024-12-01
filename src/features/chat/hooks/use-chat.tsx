"use client";

import { Chat, Message, Prisma } from '@prisma/client';
import { NextRouter } from 'next/router';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FormEvent,
  useEffect,
} from "react";

type WithMessagesChat = Prisma.ChatGetPayload<{include: {messages: true}}>

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  history: Chat[];
  setHistory: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChat: string | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
  theme: "light" | "dark";
  toggleTheme: () => void;
  startNewChat: () => void;
  handleSubmit: (event: FormEvent) => Promise<void>;
  handleSuggestionClick: (question: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ chat, children }: { chat?: WithMessagesChat, children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (chat) {
      setMessages(chat.messages)
    }
  }, [chat])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const startNewChat = () => {
    setSelectedChat(null);
    setMessages([]);
  };
  
  const handleSubmit = async (event: FormEvent) => {
    // event.preventDefault();
    // if (!input.trim()) return;

    // const newMessage = { role: "user", content: input };
    // setMessages((prevMessages) => [...prevMessages, newMessage]);
    // setInput("");
    
    // const url = selectedChat ? `api/messages?chatId=${selectedChat}` : `api/messages`
    // try {
    //   const response = await fetch( url, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(newMessage),
    //   });

    //   if (!response.ok) throw new Error("Failed to fetch from API");
    //   const { content, chatId } = await response.json();

    //   const botMessage = { role: "assistant", content: content };

    //   setMessages((prevMessages) => [...prevMessages, botMessage]);
    //   setHistory((prevHistory) => {
    //     const updatedHistory = prevHistory.map((chat) =>
    //       chat.id === chatId
    //         ? {
    //             ...chat,
    //             messages: [...chat.messages, newMessage, botMessage],
    //           }
    //         : chat,
    //     );
    //     if (!prevHistory.find((chat) => chat.id === chatId)) {
    //       updatedHistory.push({
    //         id: chatId,
    //         title: newMessage.content,
    //         messages: [newMessage, botMessage],
    //       });
    //     }
    //     return updatedHistory;
    //   });
    // } catch (error) {
    //   console.error("Error occurred:", error);
    // }
  };

  const handleSuggestionClick = async (question: string) => {
    // if (!question.trim()) return;

    // const newMessage = { role: "user", content: question };
    // setMessages((prevMessages) => [...prevMessages, newMessage]);
    // setInput("");
    
    // try {
    //   const response = await fetch("api/messages", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(newMessage),
    //   });

    //   if (!response.ok) throw new Error("Failed to fetch from API");
    //   const { content, chatId } = await response.json();

    //   const botMessage = { role: "assistant", content: content };

    //   setMessages((prevMessages) => [...prevMessages, botMessage]);
    //   setHistory((prevHistory) => {
    //     const updatedHistory = prevHistory.map((chat) =>
    //       chat.id === chatId
    //         ? {
    //             ...chat,
    //             messages: [...chat.messages, newMessage, botMessage],
    //           }
    //         : chat,
    //     );
    //     if (!prevHistory.find((chat) => chat.id === chatId)) {
    //       updatedHistory.push({
    //         id: chatId,
    //         title: newMessage.content,
    //         messages: [newMessage, botMessage],
    //       });
    //     }
    //     return updatedHistory;
    //   });
    // } catch (error) {
    //   console.error("Error occurred:", error);
    // }
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
        handleSuggestionClick,
        handleSubmit,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
