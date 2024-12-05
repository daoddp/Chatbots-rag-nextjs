"use client";

import { FolderIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useChat } from "../hooks/use-chat";
import { useEffect } from "react";
import Link from "next/link";
import { size } from "lodash";

export const Sidebar = () => {
  const { 
    theme, 
    setHistory, 
    history, 
    selectedChat, 
    startNewChat, 
    toggleSidebar, 
    sidebarOpen 
  } = useChat();

  // Lấy danh sách lịch sử từ backend
  useEffect(() => {
    fetch("/api/chats")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
      })
      .catch((err) => console.error("Error fetching chat history:", err));
  }, []);
  return (
    <>
    {sidebarOpen && (

      <aside
        className={`relative flex-shrink-0 max-w-xs border-r ${theme === "light" ? "bg-gray-200 text-black" : "bg-gray-800"} p-4 overflow-y-auto`}
        style={{
            lineHeight: "30px",
            fontSize: "17,5px",
            tabSize: "4",
            width: "260 px",
            overflow: "hidden",
            overflowY: "auto",
            /* CSS tùy chỉnh cho thanh cuộn */
            scrollbarColor: theme === "light" ? "#000000 #f0f0f0" : "#ffffff #000000", /* Thumb màu đen, Track màu sáng */
            scrollbarWidth: "thin", /* Chỉnh kích thước thanh cuộn */
          }}
      >
        {/* Nút đóng sidebar */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 z-10 p-2 text-white bg-gray-800 rounded-full"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="max-w-sm mb-4 text-lg font-bold flex items-center gap-2">
          <FolderIcon className="w-5 h-5" />
          Chat History
        </h1>

        <button
          onClick={startNewChat}
          className={`max-w-sm px-4 py-2 mb-4 rounded-full flex items-left justify-left gap-2 transition-colors duration-200
                      ${theme === "light" ? "text-black bg-gray-300 hover:bg-blue-600" : "text-black bg-yellow-400 hover:bg-yellow-500"} text-lg font-bold`}
        >
          <PlusIcon className="w-6 h-6" />
          New Chat
        </button>

        {history.length === 0 ? (
          <p className="text-center text-muted-foreground">Không tồn tại lịch sử trò chuyện</p>
        ) : (
          <ul>
            {history.map((chat) => (
              <Link href={`/chat/${chat.id}`}>
                <li
                  key={chat.id}
                  className={`p-2 rounded-2xl cursor-pointer transition-colors duration-200
                                    ${
                                      selectedChat === chat.id
                                        ? theme === "light"
                                          ? "bg-gray-300"
                                          : "bg-gray-700"
                                        : theme === "light"
                                          ? "hover:bg-blue-600"
                                          : "hover:bg-yellow-400"
                                    }`}
                                    style={{
                                      display: "block",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "clip", // Không dùng dấu "..."
                                      maxWidth: "220px",
                                      maskImage: "linear-gradient(to right, black 80%, transparent)", // Tạo hiệu ứng mờ dần
                                      WebkitMaskImage: "linear-gradient(to right, black 80%, transparent)", // Tương thích Webkit
                                    }}
                >
                  {chat.title}
                </li>
              </Link>
            ))}
          </ul>
        )}
      </aside>
    )}
    </>
  );
};
