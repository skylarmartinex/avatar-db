import fs from 'fs';
import path from 'path';

interface BuildParams {
    FA: string;
    BT: string;
    ET: string;
    HR: string;
    SC: string;
    ST: string;
    v: string;
    r: string;
    PH_REGION?: string;
    VN_REGION?: string;
}

// Map dimension codes to folder names
const DIMENSION_FOLDERS: Record<string, string> = {
    'FA': 'face',
    'BT': 'body',
    'ET': 'ethnicity',
    'HR': 'hair',
    'SC': 'scene',
    'ST': 'outfit',
    'NG': 'negative',
    'PH_REGION': 'ph_region',
    'VN_REGION': 'vn_region'
};

/**
 * Build a prompt by reading component files and merging them
 * This is a pure JavaScript implementation that works on Netlify
 */
export async function buildPrompt(params: BuildParams) {
    const { FA, BT, ET, HR, SC, ST, v, r, PH_REGION, VN_REGION } = params;
    
    // Read from public/components (synced at build time)
    const componentsDir = path.join(process.cwd(), 'public/components');
    
    try {
        // Read each component as full JSON objects
        const faComponent = readComponent(componentsDir, 'FA', FA);
        const btComponent = readComponent(componentsDir, 'BT', BT);
        const etComponent = readComponent(componentsDir, 'ET', ET);
        const hrComponent = readComponent(componentsDir, 'HR', HR);
        const scComponent = readComponent(componentsDir, 'SC', SC);
        const stComponent = readComponent(componentsDir, 'ST', ST);
        const ngComponent = readComponent(componentsDir, 'NG', 'NB');
        
        // Read region if specified
        let regionComponent = null;
        if (PH_REGION) {
            regionComponent = readComponent(componentsDir, 'PH_REGION', PH_REGION);
        } else if (VN_REGION) {
            regionComponent = readComponent(componentsDir, 'VN_REGION', VN_REGION);
        }
        
        // Deep merge all components in the correct order
        // Order matters: later merges override earlier ones for conflicting keys
        const mergedPrompt = deepMerge(
            {},
            faComponent,      // Face archetype (base subject)
            btComponent,      // Body type
            etComponent,      // Ethnicity
            regionComponent,  // Region (if specified)
            hrComponent,      // Hair
            scComponent,      // Scene/background
            stComponent,      // Outfit/clothing
            ngComponent       // Negative prompt
        );
        
        // Build canonical ID
        const idParts = [`FA-${FA}`, `BT-${BT}`, `ET-${ET}`];
        if (PH_REGION) idParts.push(`PH_REGION-${PH_REGION}`);
        if (VN_REGION) idParts.push(`VN_REGION-${VN_REGION}`);
        idParts.push(`HR-${HR}`, `SC-${SC}`, `ST-${ST}`, `v${v}`);
        
        const canonical_id = idParts.join('__');
        
        // Build human-readable title
        const title = buildTitle(params, faComponent, btComponent, etComponent, regionComponent);
        
        return {
            success: true,
            canonical_id,
            title,
            prompt: mergedPrompt,
            dims: { FA, BT, ET, HR, SC, ST, v, r, PH_REGION, VN_REGION }
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

/**
 * Build a human-readable title
 */
function buildTitle(
    params: BuildParams,
    faComponent: any,
    btComponent: any,
    etComponent: any,
    regionComponent: any
): string {
    const parts = [];
    
    if (faComponent?.label) parts.push(faComponent.label);
    if (btComponent?.label) parts.push(btComponent.label);
    if (etComponent?.label) {
        let ethLabel = etComponent.label;
        if (regionComponent?.label) {
            ethLabel += ` (${regionComponent.label})`;
        }
        parts.push(ethLabel);
    }
    
    return parts.join(' · ') || 'Assembled Prompt';
}
