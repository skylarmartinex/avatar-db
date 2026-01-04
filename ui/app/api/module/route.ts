import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = path.resolve(process.cwd(), '..');

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    if (!filePath) return NextResponse.json({ error: 'Path required' }, { status: 400 });

    const fullPath = path.join(ROOT_DIR, filePath);
    try {
        if (!fs.existsSync(fullPath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }
        const data = fs.readFileSync(fullPath, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Could not read module' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { filePath, content } = await request.json();
    const fullPath = path.join(ROOT_DIR, filePath);

    try {
        // 1. Temporary write to check lint
        const tempPath = fullPath + '.tmp';
        fs.writeFileSync(tempPath, JSON.stringify(content, null, 2));

        // 2. Run Python lint
        try {
            execSync('python3 -m src.cli lint', { cwd: ROOT_DIR, stdio: 'pipe' });
            // If lint succeeds, move temp to real
            fs.renameSync(tempPath, fullPath);
            return NextResponse.json({ success: true });
        } catch (lintError: any) {
            fs.unlinkSync(tempPath); // Clean up
            return NextResponse.json({
                success: false,
                error: 'Lint failed',
                details: lintError.stdout?.toString() || lintError.stderr?.toString() || 'Unknown lint error'
            }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
