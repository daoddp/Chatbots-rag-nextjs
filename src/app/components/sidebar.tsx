'use client';

import { FolderIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useChatContext } from './contextchat';
import { FormEvent, useRef, useEffect } from 'react';

export const Sidebar = () => {
    const { theme, setHistory, history, selectedChat, selectChat, startNewChat } = useChatContext();
    // Lấy danh sách lịch sử từ backend
    useEffect(() => {
        fetch('/api/chat/history')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched history:', data);
                setHistory(data);
            })
            .catch(err => console.error("Error fetching chat history:", err));
    }, []);
    return (
        <aside className={`flex-shrink-0 w-1/4 max-w-xs border-r ${theme === 'light' ? 'bg-gray-200 text-black' : 'bg-gray-800'} p-4 overflow-y-auto`}>
            <h1 className="max-w-sm mb-4 text-lg font-bold flex items-center gap-2">
                <FolderIcon className="w-5 h-5" />
                Chat History
            </h1>

            <button
                onClick={startNewChat}
                className={`max-w-sm px-4 py-2 mb-4 rounded-full flex items-left justify-left gap-2 transition-colors duration-200
                    ${theme === 'light' ? 'text-black bg-gray-300 hover:bg-blue-600' : 'text-black bg-yellow-400 hover:bg-yellow-500'} text-lg font-bold`}
            >
                <PlusIcon className="w-6 h-6" />
                New Chat
            </button>

            {history.length === 0 ? (
                <p className="text-center text-muted-foreground">No chats available</p>
            ) : (
                <ul>
                    {history.map((chat) => (
                        <li
                            key={chat.id}
                            className={`p-2 rounded-full cursor-pointer transition-colors duration-200 
                                ${selectedChat === chat.id 
                                ? theme === 'light' ? 'bg-gray-300' : 'bg-gray-700' 
                                : theme === 'light' ? 'hover:bg-blue-600' : 'hover:bg-yellow-400'}`}
                            onClick={() => selectChat(chat.id)}
                        >
                            {chat.title}
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
};
