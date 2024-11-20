'use client';

import { useRef, useEffect, useState, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Chat() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState<string>('');
    const [history, setHistory] = useState<{ id: string; title: string }[]>([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
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
            .then(data => setHistory(data))
            .catch(err => console.error("Error fetching chat history:", err));
    }, []);

    // Chọn một cuộc trò chuyện
    const selectChat = async (id: string) => {
        setSelectedChat(id);
        const res = await fetch(`/api/chat/history/${id}`);
        const { messages } = await res.json();
        setMessages(messages);
    };

    // Xử lý thay đổi input
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    // Xử lý New chat
    const startNewChat = () => {
        const newChatId = `chat_${Date.now()}`; // Tạo ID mới (có thể sử dụng UUID nếu cần)
        const newChatTitle = `Chat ${history.length + 1}`;
    
        // Cập nhật trạng thái
        setSelectedChat(newChatId);
        setMessages([]); // Xóa nội dung tin nhắn hiện tại
        setHistory((prevHistory) => [
            ...prevHistory,
            { id: newChatId, title: newChatTitle }
        ]);
    };
    
    // Xử lý gửi tin nhắn
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!input.trim()) return;
    
        const userMessage = { role: 'user', content: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
    
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage], chatId: selectedChat }),
            });
    
            if (!response.ok) throw new Error('Failed to fetch from API');
    
            const { answer, chatId } = await response.json();
            const botMessage = { role: 'assistant', content: answer };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
    
            // Kiểm tra và cập nhật chỉ khi `selectedChat` chưa tồn tại
            if (!selectedChat && chatId) {
                setSelectedChat(chatId);
                setHistory((prevHistory) => [...prevHistory, { id: chatId, title: `Chat ${prevHistory.length + 1}` }]);
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };    

    return (
        <main className="flex w-full h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-1/4 border-r bg-muted p-4 overflow-y-auto">
                <h2 className="text-lg font-bold mb-4">Chat History</h2>

                {/* Nút "New Chat" */}
                <button
                    onClick={startNewChat}
                    className="w-full p-2 mb-4 text-white bg-blue-500 hover:bg-blue-600 rounded"
                >
                    New Chat
                </button>

                <ul>
                    {history.map((chat) => (
                        <li
                            key={chat.id}
                            className={`p-2 rounded cursor-pointer ${selectedChat === chat.id ? 'bg-primary text-white' : 'bg-background'}`}
                            onClick={() => selectChat(chat.id)}
                        >
                            {chat.title}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Chat Area */}
            <section className="flex flex-col flex-grow">
                <header className="p-4 border-b">
                    <h1 className="text-2xl font-bold">LangChain Chat</h1>
                </header>

                <section className="flex-grow p-4 overflow-y-auto" ref={chatParent}>
                    <ul>
                        {messages.map((m, index) => (
                            <li key={index} className={`mb-4 ${m.role === 'user' ? 'text-left' : 'text-right'}`}>
                                <div className="inline-block p-3 rounded-lg shadow-md bg-background">
                                    <p className="text-primary">{m.content}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <form onSubmit={handleSubmit} className="p-4 flex items-center">
                    <Input
                        className="flex-grow"
                        placeholder="Type your message..."
                        value={input}
                        onChange={handleInputChange}
                    />
                    <Button type="submit" className="ml-2">Send</Button>
                </form>
            </section>
        </main>
    );
}
