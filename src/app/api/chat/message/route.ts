import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Use the backend URL - NEXT_PUBLIC_API_URL should be base URL without /api suffix
        // e.g., http://localhost:2000 or http://192.168.10.159:2000
        let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';

        // Remove trailing /api if present to avoid double /api/api
        if (backendUrl.endsWith('/api')) {
            backendUrl = backendUrl.slice(0, -4);
        }

        const fullUrl = `${backendUrl}/api/chat/message`;

        console.log('Chat API: Calling backend at:', fullUrl);
        console.log('Chat API: Request body:', body);

        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.log('Chat API: Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Chat API: Backend error response:', errorText);
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Chat API: Backend response data:', data);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { response: 'Maaf, sistem sedang sibuk. Silakan coba lagi nanti atau hubungi Customer Service kami di 087865733233.' },
            { status: 500 }
        );
    }
}
