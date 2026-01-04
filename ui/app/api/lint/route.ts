import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';

const ROOT_DIR = path.resolve(process.cwd(), '..');

export async function POST() {
    try {
        const stdout = execSync('python3 -m src.cli lint', { cwd: ROOT_DIR }).toString();
        return NextResponse.json({ success: true, output: stdout });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            output: error.stdout?.toString() || error.stderr?.toString() || error.message
        }, { status: 400 });
    }
}
