import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';

const ROOT_DIR = path.resolve(process.cwd(), '..');

export async function POST(request: Request) {
    const body = await request.json();
    const { grid, preset, v, runs, batch_name } = body;

    let cmd = `python3 -m src.cli batch --v ${v} --runs ${runs} --batch_name ${batch_name}`;
    if (preset) cmd += ` --preset ${preset}`;
    else if (grid) cmd += ` --grid "${grid}"`;

    try {
        const stdout = execSync(cmd, { cwd: ROOT_DIR }).toString();
        return NextResponse.json({ success: true, output: stdout });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.stdout?.toString() || error.stderr?.toString() || error.message
        }, { status: 500 });
    }
}
