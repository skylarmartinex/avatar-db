import { NextResponse } from 'next/server';
import { buildPrompt } from '@/lib/prompt-builder';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { FA, BT, ET, HR, SC, ST, v, r, PH_REGION, VN_REGION } = body;
        
        // Validate required fields
        if (!FA || !BT || !ET || !HR || !SC || !ST) {
            return NextResponse.json({
                error: 'Missing required parameters'
            }, { status: 400 });
        }
        
        // Build the prompt using JavaScript (no Python required)
        const result = await buildPrompt({
            FA, BT, ET, HR, SC, ST,
            v: v || '01',
            r: r || '01',
            PH_REGION,
            VN_REGION
        });
        
        return NextResponse.json(result);
        
    } catch (error: any) {
        console.error('Build error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to build prompt'
        }, { status: 500 });
    }
}
