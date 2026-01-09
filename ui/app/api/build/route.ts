import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt } from '@/lib/prompt-builder';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { BASE, SUBJECT_TYPE, FACE, BODY, HAIR, ETHNICITY, SKIN, APPEARANCE, OUTFIT, POSE, BACKGROUND, v, r } = body;

        // Validate required parameters
        if (!BASE || !SUBJECT_TYPE || !FACE || !BODY || !HAIR || !ETHNICITY || !SKIN || !OUTFIT || !POSE || !BACKGROUND) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Build the prompt using JavaScript (no Python required)
        const result = await buildPrompt({
            BASE, SUBJECT_TYPE, FACE, BODY, HAIR, ETHNICITY, SKIN, APPEARANCE, OUTFIT, POSE, BACKGROUND,
            v: v || '01',
            r: r || '01'
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Build error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to build prompt' },
            { status: 500 }
        );
    }
}
