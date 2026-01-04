import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve(process.cwd(), '..');

export async function GET() {
    const codesPath = path.join(ROOT_DIR, 'registry', 'codes.json');
    try {
        const data = fs.readFileSync(codesPath, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Could not read registry' }, { status: 500 });
    }
}
