'use client';

import { useRef, useEffect, useState, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'; // Import useRouter
import { ThemeSwitch } from "@/components/ui/switch";
import { PlusIcon } from '@heroicons/react/24/solid';
import { FolderIcon } from '@heroicons/react/24/solid';

export function Chat() {
    const router = useRouter();
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState<string>('');
    const [history, setHistory] = useState<{ id: string; title: string; messages: { role: string; content: string }[] }[]>([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('light'); 
    const chatParent = useRef<HTMLUListElement>(null);

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        const domNode = chatParent.current;
        if (domNode) {
            domNode.scrollTop = domNode.scrollHeight;
        }
    }, [messages]);

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

    // Chọn một cuộc trò chuyện
    const selectChat = (id: string) => {
        setSelectedChat(id);
        const chat = history.find(chat => chat.id === id);
        if (chat) {
            setMessages(chat.messages); // Cập nhật các tin nhắn từ cuộc trò chuyện đã chọn
        }
    };

    // Xử lý thay đổi input
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    // Xử lý New chat
    const startNewChat = () => {
        setSelectedChat(null); // Đặt lại ID của cuộc trò chuyện
        setMessages([]); // Xóa nội dung tin nhắn hiện tại
    };

    // Xử lý gửi tin nhắn
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages]

        const userMessage = { role: 'user', content: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        newMessages.push(userMessage)
        setInput('');

        try {
            // Gửi tin nhắn lên backend
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

            // Cập nhật selectedChat nếu là cuộc trò chuyện mới
            if (!selectedChat && chatId) {
                setSelectedChat(chatId);  // Lưu chatId sau khi nhận được từ backend
                setHistory((prevHistory) => [
                    ...prevHistory, 
                    { id: chatId, title: `Chat: ${userMessage.content}`, messages: updatedMessages }
                ]);
                router.push(`/chat/${chatId}`); // Thêm ID vào URL
            } else {
                setHistory((prevHistory) => prevHistory.map((chat) => 
                    chat.id === chatId ? { ...chat, messages: updatedMessages } : chat
                ));
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    // Toggle theme
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <main className={`flex w-full h-screen ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
            {/* Sidebar */}
            <aside className={`flex-shrink-0 w-1/4 max-w-xs border-r ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-800'} p-4 overflow-y-auto`}>
                <h1 className="max-w-sm mb-4 text-lg font-bold flex items-center gap-2">
                    <FolderIcon className="w-5 h-5" /> 
                    Chat History
                </h1>

                {/* Nút "New Chat" */}
                <button
                    onClick={startNewChat}
                    className={`max-w-sm px-4 py-2 mb-4 rounded-full flex items-left justify-left gap-2 transition-colors duration-200
                        ${theme === 'light' 
                            ? 'text-black bg-gray-300 hover:bg-blue-600' 
                            : 'text-black bg-yellow-400 hover:bg-yellow-500'} text-lg font-bold`}
                >
                    <PlusIcon className="w-6 h-6" /> 
                    New Chat
                </button>

                {/* Kiểm tra nếu history trống */}
                {history.length === 0 ? (
                    <p className="text-center text-muted-foreground">No chats available</p>
                ) : (
                    <ul>
                        {Array.isArray(history) && history.length > 0 ? (
                            history.map((chat) => (
                                <li
                                    key={chat.id}
                                    className={`p-2 rounded-full cursor-pointer transition-colors duration-200 
                                                                                 ${selectedChat === chat.id 
                                                                                ? theme === 'light' ? 'bg-gray-300' : 'bg-gray-700' 
                                                                                : theme === 'light' ? 'bg-transparent hover:bg-blue-600' : 'bg-transparent hover:bg-yellow-400'}`}
                                    onClick={() => selectChat(chat.id)}
                                >
                                    {chat.title}
                                </li>
                            ))
                        ) : (
                            <p className="text-muted">No chat history available</p>
                        )}
                    </ul>
                )}
            </aside>

            {/* Chat Area */}
            <section className="flex flex-col flex-grow">
            <header className="p-4 border-b flex justify-between items-center">
                <h1 className="text-2xl font-bold">UIT ChatBot</h1>
                <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
            </header>

                <section className="flex-grow p-4 overflow-y-auto" ref={chatParent}>
                    <ul>
                        {messages.map((m, index) => (
                            <li key={index} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-3 rounded-2xl shadow-md ${m.role === 'user' 
                                                                                        ? theme === 'light' 
                                                                                            ? 'bg-gray-200 text-black' : 'bg-gray-700 text-white'
                                                                                            : ''}`}>
                                    <p>{m.content}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <form
                    onSubmit={handleSubmit}
                    className={`p-4 flex items-center ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-800'}`}
                >
                    <Input
                        className={`flex-grow p-3 rounded-full ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}
                        placeholder="Type your message..."
                        value={input}
                        onChange={handleInputChange}
                    />
                    <Button
                        type="submit"
                        className={`ml-2 px-4 py-2 rounded-full transition-colors duration-200
                            ${theme === 'light' 
                                ? 'text-black bg-gray-300 hover:bg-blue-600' 
                                : 'text-black bg-yellow-400 hover:bg-yellow-500'}`}
                    >
                        Send
                    </Button>
                </form>
            </section>
        </main>
    );
}
