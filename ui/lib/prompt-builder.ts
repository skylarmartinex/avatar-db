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

interface ComponentData {
    code: string;
    label: string;
    description?: string;
    prompt?: string;
    [key: string]: any;
}

/**
 * Build a prompt by reading component files and assembling them
 * This is a pure JavaScript implementation that works on Netlify
 */
export async function buildPrompt(params: BuildParams) {
    const { FA, BT, ET, HR, SC, ST, v, r, PH_REGION, VN_REGION } = params;
    
    // Determine the root directory (one level up from ui/)
    const rootDir = path.resolve(process.cwd(), '..');
    const componentsDir = path.join(rootDir, 'components');
    
    // Read component files
    const components: Record<string, ComponentData> = {};
    
    try {
        // Read each dimension's component
        components.FA = readComponent(componentsDir, 'FA', FA);
        components.BT = readComponent(componentsDir, 'BT', BT);
        components.ET = readComponent(componentsDir, 'ET', ET);
        components.HR = readComponent(componentsDir, 'HR', HR);
        components.SC = readComponent(componentsDir, 'SC', SC);
        components.ST = readComponent(componentsDir, 'ST', ST);
        
        // Read region if specified
        if (PH_REGION) {
            components.PH_REGION = readComponent(componentsDir, 'PH_REGION', PH_REGION);
        }
        if (VN_REGION) {
            components.VN_REGION = readComponent(componentsDir, 'VN_REGION', VN_REGION);
        }
        
        // Read negative prompt (default)
        components.NG = readComponent(componentsDir, 'NG', 'DEFAULT');
        
    } catch (error: any) {
        throw new Error(`Failed to read component: ${error.message}`);
    }
    
    // Assemble the prompt
    const prompt = {
        subject: components.FA.prompt || '',
        identity: assembleIdentity(components.ET, components.PH_REGION, components.VN_REGION),
        body: components.BT.prompt || '',
        hair: components.HR.prompt || '',
        background: components.SC.prompt || '',
        outfit: components.ST.prompt || '',
        negative: components.NG.prompt || ''
    };
    
    // Build canonical ID
    const idParts = [`FA-${FA}`, `BT-${BT}`, `ET-${ET}`];
    if (PH_REGION) idParts.push(`PH_REGION-${PH_REGION}`);
    if (VN_REGION) idParts.push(`VN_REGION-${VN_REGION}`);
    idParts.push(`HR-${HR}`, `SC-${SC}`, `ST-${ST}`, `v${v}`);
    
    const canonical_id = idParts.join('__');
    
    return {
        success: true,
        canonical_id,
        promptContent: prompt,
        dims: { FA, BT, ET, HR, SC, ST, v, r, PH_REGION, VN_REGION }
    };
}

/**
 * Read a component file from the components directory
 */
function readComponent(componentsDir: string, dimension: string, code: string): ComponentData {
    const filePath = path.join(componentsDir, dimension, `${code}.json`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`Component not found: ${dimension}/${code}.json`);
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}

/**
 * Assemble the identity string from ethnicity and region
 */
function assembleIdentity(
    ethnicity: ComponentData,
    phRegion?: ComponentData,
    vnRegion?: ComponentData
): string {
    let identity = ethnicity.prompt || '';
    
    // Append region if specified
    if (phRegion && phRegion.prompt) {
        identity += `, ${phRegion.prompt}`;
    } else if (vnRegion && vnRegion.prompt) {
        identity += `, ${vnRegion.prompt}`;
    }
    
    return identity;
}
