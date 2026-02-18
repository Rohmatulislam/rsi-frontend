import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
        }

        let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
        if (backendUrl.endsWith('/api')) {
            backendUrl = backendUrl.slice(0, -4);
        }

        const fullUrl = `${backendUrl}/api/chat/history/${sessionId}`;

        console.log('Chat History API: Calling backend at:', fullUrl);

        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend responded with status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Chat History API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
