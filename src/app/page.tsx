"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ChatProvider } from "../features/chat/hooks/use-chat";
import { Sidebar } from "../features/chat/components/sidebar";
import { Chat } from "../features/chat/components/chat";

export default function Page() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <p>Đang kiểm tra trạng thái đăng nhập...</p>;
  }

  if (!isSignedIn) {
    redirect("/login"); // Điều hướng về trang login nếu chưa đăng nhập
  }

  return (
    <ChatProvider>
      <div className="flex w-full h-screen">
        <Sidebar />
        <Chat />
      </div>
    </ChatProvider>
  );
}
