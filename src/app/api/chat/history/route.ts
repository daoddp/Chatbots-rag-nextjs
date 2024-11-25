import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Giả sử API này trả về danh sách các cuộc trò chuyện và tin nhắn tương ứng  
export async function GET(req: Request) {
    try {
        const { db } = await connectToDatabase();
        
        // Lấy danh sách các cuộc trò chuyện kèm theo tin nhắn (nếu có)
        const chats = await db.collection("chats").find().toArray();

        if (!chats.length) {
            return NextResponse.json({ message: "No chat history found" }, { status: 404 });
        }

        // Chuyển đổi _id thành id
        const transformedChats = chats.map(chat => ({
            ...chat,
            id: chat._id.toString(), // MongoDB ObjectId cần được chuyển thành chuỗi
            _id: undefined,          // Loại bỏ trường _id
        }));

        // Trả về danh sách các cuộc trò chuyện
        return NextResponse.json(transformedChats);

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error}, { status: 500 });
    }
}
