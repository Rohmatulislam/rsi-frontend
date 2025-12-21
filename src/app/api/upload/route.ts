import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'File must be an image' },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size must be less than 5MB' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const fileExt = file.name.split('.').pop();
        const fileName = `banner-${timestamp}-${randomString}.${fileExt}`;

        // Upload to Supabase via backend API
        const uploadFormData = new FormData();
        uploadFormData.append('file', new Blob([buffer], { type: file.type }), fileName);
        uploadFormData.append('bucket', 'banners');

        const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:2000';

        const response = await fetch(`${backendUrl}/api/upload`, {
            method: 'POST',
            body: uploadFormData,
        });

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json(
                { error: `Upload failed: ${error}` },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            url: data.url,
            filename: fileName,
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Upload failed' },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
