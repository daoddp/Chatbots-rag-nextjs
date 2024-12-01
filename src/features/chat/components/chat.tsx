"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/switch";
import { useChat } from "../hooks/use-chat";

export const Chat = () => {
  const {
    theme,
    messages,
    input,
    handleSubmit,
    setInput,
    setMessages,
    toggleTheme,
    handleSuggestionClick,
  } = useChat();

  const chatParent = useRef<HTMLUListElement>(null);

  const faqSuggestions = [
    "Các phương thức tuyển sinh vào UIT?",
    "Giới thiệu về ngành khoa học máy tính ở UIT?",
    "Học ngành An toàn thông tin ở UIT thì ra trường làm gì?",
    "Cách liên hệ với phòng công tác sinh viên ở UIT?",
    "Làm sao để vào được UIT?",
  ];

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  console.log(messages);
  return (
    <section
      className={`flex flex-col flex-grow ${theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"}`}
    >
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">UIT ChatBot</h1>
        <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
      </header>

      <section className="flex-grow p-4 overflow-y-auto" ref={chatParent}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-start space-y-4">
            <p className="text-lg font-semibold">Câu hỏi thường gặp:</p>
            <ul className="space-y-4">
              {faqSuggestions.map((question, index) => (
                <li key={index} className="text-left">
                  <button
                    onClick={() => handleSuggestionClick(question)}
                    className={`inline-block p-3 rounded-2xl shadow-md cursor-pointer transition-colors duration-200 ${
                      theme === "light"
                        ? "bg-gray-300 text-black hover:bg-blue-600"
                        : "bg-gray-700 text-white hover:bg-yellow-400"
                    }`}
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul>
            {messages.map((m, index) => (
              <li
                key={index}
                className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block p-3 rounded-2xl shadow-md ${
                    m.role === "user"
                      ? theme === "light"
                        ? "bg-gray-200 text-black"
                        : "bg-gray-700 text-white"
                      : ""
                  }`}
                >
                  <p>{m.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form
        onSubmit={handleSubmit}
        className={`p-4 flex items-center rounded-t-xl ${theme === "light" ? "bg-gray-200" : "bg-gray-800"}`}
      >
        <Input
          className={`flex-grow p-3 rounded-full ${theme === "light" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
        />
        <Button
          type="submit"
          className={`ml-2 px-4 py-2 rounded-full transition-colors duration-200
                        ${theme === "light" ? "text-black bg-gray-300 hover:bg-blue-600" : "text-black bg-yellow-400 hover:bg-yellow-500"}`}
        >
          Send
        </Button>
      </form>
    </section>
  );
};
