'use client';

import { useEffect } from 'react';
import { useChat } from '@/features/chat/hooks/use-chat';

const ChatPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { setSelectedChat } = useChat();

  useEffect(() => {
    // Thiết lập chat hiện tại và fetch dữ liệu
    setSelectedChat(id);
  }, [id, setSelectedChat]);

  return (
    <div>
      <h1>Chat ID: {id}</h1>
      {/* Render nội dung chat */}
    </div>
  );
};

export default ChatPage;
