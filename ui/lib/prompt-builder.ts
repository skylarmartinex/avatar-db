import fs from 'fs';
import path from 'path';

interface BuildParams {
    BASE: string;
    SUBJECT_TYPE: string;
    FACE: string;
    BODY: string;
    HAIR: string;
    ETHNICITY: string;
    SKIN: string;
    APPEARANCE: string;
    OUTFIT: string;
    POSE: string;
    BACKGROUND: string;
    v: string;
    r: string;
}

// Map dimension codes to folder names
const DIMENSION_FOLDERS: Record<string, string> = {
    'BASE': 'base',
    'SUBJECT_TYPE': 'subject',
    'FACE': 'face',
    'BODY': 'body',
    'HAIR': 'hair',
    'ETHNICITY': 'ethnicity',
    'SKIN': 'skin',
    'APPEARANCE': 'appearance',
    'OUTFIT': 'outfit',
    'POSE': 'pose',
    'BACKGROUND': 'background'
};

/**
 * Build a prompt by reading component files and merging them
 * This is a pure JavaScript implementation that works on Netlify
 */
export async function buildPrompt(params: BuildParams) {
    const { BASE, SUBJECT_TYPE, FACE, BODY, HAIR, ETHNICITY, SKIN, APPEARANCE, OUTFIT, POSE, BACKGROUND, v, r } = params;
    
    // Read from public/components (synced at build time)
    const componentsDir = path.join(process.cwd(), 'public/components');
    
    try {
        // Read each component as full JSON objects in merge order
        const baseComponent = readComponent(componentsDir, 'BASE', BASE);
        const subjectTypeComponent = readComponent(componentsDir, 'SUBJECT_TYPE', SUBJECT_TYPE);
        const faceComponent = readComponent(componentsDir, 'FACE', FACE);
        const bodyComponent = readComponent(componentsDir, 'BODY', BODY);
        const hairComponent = readComponent(componentsDir, 'HAIR', HAIR);
        const ethnicityComponent = readComponent(componentsDir, 'ETHNICITY', ETHNICITY);
        const skinComponent = readComponent(componentsDir, 'SKIN', SKIN);
        const appearanceComponent = readComponent(componentsDir, 'APPEARANCE', APPEARANCE);
        const outfitComponent = readComponent(componentsDir, 'OUTFIT', OUTFIT);
        const poseComponent = readComponent(componentsDir, 'POSE', POSE);
        const backgroundComponent = readComponent(componentsDir, 'BACKGROUND', BACKGROUND);
        
        // Deep merge all components in the correct order
        // Order matters: later merges override earlier ones for conflicting keys
        const mergedPrompt = deepMerge(
            {},
            baseComponent,           // Technical foundation
            subjectTypeComponent,    // Subject type
            faceComponent,           // Facial features
            bodyComponent,           // Body build
            hairComponent,           // Hair structure
            ethnicityComponent,      // Ethnicity
            skinComponent,           // Skin foundation
            appearanceComponent,     // Color and tone
            outfitComponent,         // Clothing
            poseComponent,           // Pose
            backgroundComponent      // Background/surrounding
        );
        
        // Build canonical ID
        const idParts = [
            `BASE-${BASE}`,
            `FACE-${FACE}`,
            `BODY-${BODY}`,
            `HAIR-${HAIR}`,
            `APPEARANCE-${APPEARANCE}`,
            `ETHNICITY-${ETHNICITY}`,
            `SKIN-${SKIN}`,
            `OUTFIT-${OUTFIT}`,
            `POSE-${POSE}`,
            `BACKGROUND-${BACKGROUND}`,
            `v${v}`
        ];
        
        const canonical_id = idParts.join('__');
        
        // Build human-readable title
        const title = `Gold Avatar · ${BACKGROUND}`;

        // Simple JS rendering of clauses (mirrors Python logic)
        const clauses: string[] = [];
        
        // Add Physique/Build
        if (mergedPrompt.subject?.build) {
            clauses.push(mergedPrompt.subject.build);
        }
        
        // Add Skin Tone
        if (mergedPrompt.appearance?.skin_tone?.enabled !== false) {
            const st = mergedPrompt.appearance?.skin_tone || {};
            const base = st.base || "Medium";
            const tone_str = `Skin tone: ${base.toLowerCase()}${st.undertone ? `, ${st.undertone.toLowerCase()} undertone` : ''}; ${st.complexion_finish ? st.complexion_finish.toLowerCase() + ' finish' : 'natural finish'}; ${st.blemish_policy ? st.blemish_policy.toLowerCase() + ' blemishes' : 'minimal blemishes'}; skin tone remains consistent across shots; avoid lighting-induced color shift.`;
            clauses.push(tone_str);
        }
        
        // Add Hair Structure
        if (mergedPrompt.subject?.hair?.enabled !== false) {
            const h = mergedPrompt.subject?.hair || {};
            const hair_str = `Hair: ${h.length || 'medium'} ${h.texture || 'natural'} ${h.style || 'style'}${h.bangs ? ` with ${h.bangs}` : ''}${h.volume ? `, ${h.volume.toLowerCase()} volume` : ''}.`;
            clauses.push(hair_str);
        }
        
        // Add Hair Color
        if (mergedPrompt.appearance?.hair_color?.enabled !== false) {
            const hc = mergedPrompt.appearance?.hair_color || {};
            const color_str = `Hair color: ${hc.base_color || 'natural'}${hc.highlights?.enabled ? ` with ${hc.highlights.color} highlights` : ''}${hc.gray_percentage ? `, ${hc.gray_percentage} gray` : ''}; ${hc.finish ? hc.finish.toLowerCase() + ' finish' : 'natural finish'}.`;
            clauses.push(color_str);
        }

        // Add Scene
        if (mergedPrompt.setting?.environment) {
            clauses.push(`Scene: ${mergedPrompt.setting.environment}`);
        }

        const rendered_prompt = clauses.join(" ");

        // Add to result metadata
        if (!mergedPrompt.metadata) mergedPrompt.metadata = {};
        mergedPrompt.metadata.rendered_prompt = rendered_prompt;
        
        return {
            success: true,
            canonical_id,
            title,
            prompt: mergedPrompt,
            dims: { BASE, SUBJECT_TYPE, FACE, BODY, HAIR, ETHNICITY, SKIN, APPEARANCE, OUTFIT, POSE, BACKGROUND, v, r }
        };
        
    } catch (error: any) {
        throw new Error(`Failed to build prompt: ${error.message}`);
    }
}

/**
 * Deep merge multiple objects
 * Later objects override earlier ones for conflicting keys
 */
function deepMerge(...objects: any[]): any {
    const result: any = {};
    
    for (const obj of objects) {
        if (!obj || typeof obj !== 'object') continue;
        
        for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            
            const value = obj[key];
            
            // If both are objects (and not arrays), merge recursively
            if (
                value && 
                typeof value === 'object' && 
                !Array.isArray(value) &&
                result[key] &&
                typeof result[key] === 'object' &&
                !Array.isArray(result[key])
            ) {
                result[key] = deepMerge(result[key], value);
            } else {
                // Otherwise, override
                result[key] = value;
            }
        }
    }
    
    return result;
}

/**
 * Read a component file from the components directory
 */
function readComponent(componentsDir: string, dimension: string, code: string): any {
    const folder = DIMENSION_FOLDERS[dimension];
    if (!folder) {
        throw new Error(`Unknown dimension: ${dimension}`);
    }
    
    const filePath = path.join(componentsDir, folder, `${code}.json`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`Component not found: ${folder}/${code}.json`);
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}
