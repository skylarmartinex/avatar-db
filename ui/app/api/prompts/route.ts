import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        // Read from static index.json (generated at build time)
        const indexPath = path.join(process.cwd(), 'public/prompts/index.json');

        // Check if index exists
        if (!fs.existsSync(indexPath)) {
            return NextResponse.json({
                prompts: [],
                error: 'Prompts index not found. Run `npm run sync-prompts` to generate it.'
            });
        }

        // Read and parse index
        const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

        return NextResponse.json({
            prompts: indexData.prompts || [],
            generated: indexData.generated,
            count: indexData.count
        });
    } catch (error) {
        console.error('Error reading prompts index:', error);
        return NextResponse.json({
            error: 'Failed to read prompts index',
            prompts: []
        }, { status: 500 });
    }
}
