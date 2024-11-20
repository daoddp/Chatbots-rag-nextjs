import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const chatId = url.searchParams.get("id");

        if (!chatId) {
            return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        const chat = await db.collection("chats").findOne({ chatId });

        if (!chat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        return NextResponse.json(chat);

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}