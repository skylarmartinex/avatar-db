import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const filename = searchParams.get('name');

        if (!filename) {
            return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }

        // Security: ensure filename doesn't contain path traversal
        if (filename.includes('..') || filename.includes('/')) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        const promptsDir = path.join(process.cwd(), 'public/prompts');
        const filePath = path.join(promptsDir, filename);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(content);

        return NextResponse.json(json);
    } catch (error) {
        console.error('Error reading prompt file:', error);
        return NextResponse.json({ error: 'Failed to read prompt file' }, { status: 500 });
    }
}
