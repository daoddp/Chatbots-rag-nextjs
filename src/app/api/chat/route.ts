import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        const { messages, chatId: providedChatId } = await req.json();
        console.log(providedChatId)
        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        // Kết nối MongoDB
        const { db } = await connectToDatabase();
        const chatCollection = db.collection("chats");

        let chatId = providedChatId;

        // Nếu không có chatId, tạo mới một cuộc trò chuyện
        if (!chatId) {
            const result = await chatCollection.insertOne({
                createdAt: new Date(),
                title: `Chat: ${messages[messages.length - 1].content}`,
                messages: [messages[messages.length - 1]],  // Lưu luôn tin nhắn vào khi tạo mới
            });
            chatId = result.insertedId.toString();  // Lấy ID mới từ MongoDB
        } else {
        // console.log(chatId)
        // Cập nhật tin nhắn vào cuộc trò chuyện
        const userMessage = messages[messages.length - 1];
        await chatCollection.updateOne(
            { _id: new ObjectId(chatId) },
            { $push: { messages: userMessage } } 
        );
        }
        // console.log(chatId)
        // Gửi yêu cầu tới FastAPI
        const response = await fetch('http://localhost:8000/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages, id: chatId }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from chatbot API');
        }

        const { answer } = await response.json();
        console.log(answer)

        // Lưu câu trả lời của bot
        const res = await chatCollection.updateOne(
            { _id: new ObjectId(chatId) },
            { $push: { messages: { role: "assistant", content: answer } } }
        );
        console.log(res)
        return NextResponse.json({ chatId, answer });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error}, { status: 500 });
    }
}
