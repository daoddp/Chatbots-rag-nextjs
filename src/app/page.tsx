import { ChatProvider } from './components/contextchat';
import { Sidebar } from './components/sidebar';
import { Chat } from './components/chat';

export default function Page() {
    return (
        <ChatProvider>
            <div className="flex w-full h-screen">
                <Sidebar />
                <Chat />
            </div>
        </ChatProvider>
    );
}
