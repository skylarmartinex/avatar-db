import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const ROOT_DIR = path.resolve(process.cwd(), '..');

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const manifestPath = searchParams.get('path');
    if (!manifestPath) return NextResponse.json({ error: 'Path required' }, { status: 400 });

    const fullPath = path.isAbsolute(manifestPath) ? manifestPath : path.join(ROOT_DIR, manifestPath);

    try {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });
        return NextResponse.json(records);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
