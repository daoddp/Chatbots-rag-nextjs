"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/switch";
import { useChat } from "../hooks/use-chat";
import { UserButton } from "@clerk/nextjs";
import { FolderIcon } from "@heroicons/react/24/solid";


export const Chat = () => {
  const {
    theme,
    messages,
    input,
    handleSubmit,
    setInput,
    toggleTheme,
    handleSuggestionClick,
    toggleSidebar,
    sidebarOpen,
  } = useChat();

  const chatParent = useRef<HTMLUListElement>(null);

  const faqSuggestions = [
    "Các phương thức tuyển sinh vào UIT?",
    "Làm sao để vào được UIT?",
    "Giới thiệu về ngành khoa học máy tính ở UIT?",
    "Học ngành An toàn thông tin ở UIT thì ra trường làm gì?",
    "Có thể học chương trình văn bằng 2 ở UIT không?",
    "Cách liên hệ với phòng công tác sinh viên ở UIT?",
    
  ];

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  console.log(messages);
  return (
    <section
      className={`flex flex-col flex-grow ${theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"}`}
      // Thanh cuộn chat
      style={{
        scrollbarColor: theme === "light" ? "#000000 #f0f0f0" : "#ffffff #000000",
        scrollbarWidth: "thin",
      }}
    >
      <header className="p-4 border-b flex justify-between items-center">
        {/* hiển thị nút folder nếu sidebar đang đóng */}
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 text-white bg-gray-800 rounded-full"
          >
            <FolderIcon className="w-6 h-6" />
          </button>
        )}
        {/* Tiêu đề chatbot */}
        <h1 className="text-2xl font-bold flex-shrink-0">UITChatBot</h1>
        <div className="flex items-center gap-4">
          {/* Nút điều chỉnh theme */}
          <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
          <UserButton />
        </div>
      </header>

      <section className="flex-grow px-8 lg:px-32 xl:px-64 py-4 overflow-y-auto" ref={chatParent}
        >
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center space-y-4 mt-4">
              {/* Hiển thị danh sách các câu hỏi thường gặp */}
              <p className="text-lg font-semibold">Một vài câu hỏi thường gặp:</p>
              <ul className="space-y-4">
                {faqSuggestions.map((question, index) => (
                    <li key={index} className="text-center">
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
              {/* Hiển thị đoạn chat */}
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
        </div>
      </section>

      {/* Hiển thị ô nhập input */}
      <form
        onSubmit={handleSubmit}
        className={`p-4 flex items-center justify-between rounded-t-xl ${theme === "light" ? "white" : "black"}`}
        style={{
          fontSize: "20px",
        }}
      >
        <div className="max-w-4xl mx-auto w-full flex items-center gap-4">
          <Input
            className={`flex-grow p-3 rounded-2xl ${theme === "light" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${
              theme === "light"
                ? "text-black bg-gray-300 hover:bg-blue-600"
                : "text-black bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            Send
          </Button>
        </div>
      </form>
      <p className="p-2 text-center flex-shrink-0 text-gray-300" style={{fontSize: "15px"}}>Chatbot có thể mắc lỗi. Hãy kiểm trả những thông tin quan trọng.</p>
    </section>
  );
};
