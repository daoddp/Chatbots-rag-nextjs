import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const chatId = uuidv4(); // Tạo chatId duy nhất

        // Kết nối MongoDB
        const { db } = await connectToDatabase();
        const chatCollection = db.collection("chats");

        // Lưu tin nhắn vào MongoDB
        await chatCollection.updateOne(
            { chatId },
            { 
                $setOnInsert: { 
                    chatId, 
                    createdAt: new Date(),
                    title: `Chat ${new Date().toLocaleString()}` 
                },
                $push: { messages: { $each: messages } },
            },
            { upsert: true } // Tạo mới nếu chưa tồn tại
        );

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

        // Lưu câu trả lời của bot
        await chatCollection.updateOne(
            { chatId },
            { $push: { messages: { role: "assistant", content: answer } } }
        );

        return NextResponse.json({ chatId, answer });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
