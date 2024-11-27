'use client';

import { FormEvent, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/switch";
import { useChatContext } from './contextchat';

export const Chat = () => {
    const {
        theme,
        messages,
        input,
        handleSubmit,
        setInput,
        toggleTheme,
    } = useChatContext();
    const chatParent = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const domNode = chatParent.current;
        if (domNode) {
            domNode.scrollTop = domNode.scrollHeight;
        }
    }, [messages]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    return (
        <section className={`flex flex-col flex-grow ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
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
                                                                                        ? 'bg-gray-200 text-black' 
                                                                                        : 'bg-gray-700 text-white' 
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
                        ${theme === 'light' ? 'text-black bg-gray-300 hover:bg-blue-600' : 'text-black bg-yellow-400 hover:bg-yellow-500'}`}
                >
                    Send
                </Button>
            </form>
        </section>
    );
};
