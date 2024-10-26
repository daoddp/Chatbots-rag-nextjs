import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages, id } = await req.json();

        const response = await fetch('http://localhost:8000/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                id: id || "abc123",
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from chatbot API');
        }

        // Assuming the FastAPI responds with the expected structure
        const { answer } = await response.json();

        return NextResponse.json({ answer });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
