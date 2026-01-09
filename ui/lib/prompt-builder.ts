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
    AGE?: string;
    OUTFIT: string;
    POSE: string;
    BACKGROUND: string;
    v: string;
    r: string;
    overrides?: any;
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
    'AGE': 'age',
    'OUTFIT': 'outfit',
    'POSE': 'pose',
    'BACKGROUND': 'background'
};

/**
 * Renders the body components clause (Pure Components architecture).
 */
function renderBodyComponentsClause(bc: any): string | null {
    if (!bc || bc.enabled === false) return null;
    
    const test_mode = bc.test_mode || {};
    const single_only = test_mode.single_component_only !== false;
    const active_comp = test_mode.active_component || "glutes";
    const components = bc.components || {};
    const global_constraints = bc.constraints || [];
    
    const comp_clauses: string[] = [];
    const target_keys = single_only ? [active_comp] : Object.keys(components);
    
    const safetyMap: Record<string, string> = {
        "glutes": "natural proportions, no exaggerated BBL",
        "breasts": "natural proportions, no exaggerated cleavage"
    };
    
    for (const k of target_keys) {
        const comp = components[k];
        if (!comp || comp.enabled === false) continue;
        
        const emphasis = comp.emphasis || "Off";
        if (emphasis === "Off" && !single_only) continue;
        
        const definition = comp.definition || "Defined";
        const size = comp.size || "Athletic";
        const shape = comp.shape || "";
        const notes = comp.notes || "";
        
        let comp_str = "";
        if (k === "abs" && definition === "Shredded" && emphasis === "High") {
            comp_str = `${k}: competition-lean abs with deep etched separations, sharply visible obliques and serratus lines; no smoothness, no softness`;
        } else {
            const c_parts = [];
            c_parts.push(`${emphasis.toLowerCase()} emphasis`);
            c_parts.push(definition.toLowerCase());
            c_parts.push(`${size.toLowerCase()} size`);
            if (shape) c_parts.push(shape.toLowerCase());
            if (notes) {
                c_parts.push(`(${notes.toLowerCase()})`);
            }
            comp_str = `${k}: ${c_parts.join(", ")}`;
        }
        
        if (safetyMap[k]) {
            comp_str += `; ${safetyMap[k]}`;
        }
        
        comp_clauses.push(comp_str);
    }
    
    if (comp_clauses.length === 0) return null;
    
    let res = `Body components: ${comp_clauses.join("; ")}`;
    if (global_constraints && global_constraints.length > 0) {
        res += `. ${global_constraints.join("; ")}.`;
    }
    
    return res;
}

/**
 * Renders the body clause (blueprint).
 */
function renderBodyClause(bodyData: any): string | null {
    if (!bodyData) return null;
    
    const profile = bodyData.profile || "Ripped Athletic";
    const g = bodyData.global || {};
    const regions = bodyData.regions || {};
    
    const clauses: string[] = [];
    
    // 1. Global clause
    const globalParts = [`Body profile: ${profile}`];
    if (g.leanness) globalParts.push(`${g.leanness} leanness`);
    if (g.muscle_definition) globalParts.push(`${g.muscle_definition} muscle definition`);
    if (g.vascularity) globalParts.push(`${g.vascularity} vascularity`);
    if (g.softness_policy) globalParts.push(g.softness_policy);
    
    clauses.push(globalParts.join("; "));
    
    // 2. Regional clauses
    for (const [regionName, r] of Object.entries(regions) as [string, any][]) {
        if (r.enabled) {
            const size = r.size || "Medium";
            const definition = r.definition || "Toned";
            const shape = r.shape_cue || "";
            const constraints = r.constraints || [];
            
            let regStr = `${regionName.charAt(0).toUpperCase() + regionName.slice(1)}: ${size}, ${definition}`;
            if (shape) regStr += `, ${shape}`;
            
            if (constraints && constraints.length > 0) {
                if (Array.isArray(constraints)) {
                    regStr += `; ${constraints.join(", ")}`;
                } else {
                    regStr += `; ${constraints}`;
                }
            }
            
            clauses.push(regStr);
        }
    }
    
    if (clauses.length === 0) return null;
    return clauses.join(". ") + ".";
}

/**
 * Renders the youth profile clause.
 */
function renderAgeClause(subjectData: any): string | null {
    if (!subjectData || !subjectData.age_profile) {
        return null;
    }
    
    const age_profile = subjectData.age_profile;
    const cues = subjectData.age_cues || {};
    
    if (cues.enabled === false) {
        return null;
    }
    
    let res = `Youth profile: ${age_profile.toLowerCase()}; `;
    const sub_parts = [];
    
    if (cues.face_youthfulness) sub_parts.push(cues.face_youthfulness.toLowerCase());
    if (cues.eye_area) sub_parts.push(cues.eye_area.toLowerCase());
    if (cues.age_markers) sub_parts.push(cues.age_markers.toLowerCase());
    
    res += sub_parts.join(', ');
    
    if (cues.skin_texture_policy) {
        res += `; ${cues.skin_texture_policy.toLowerCase()}`;
    }
    
    if (cues.anti_gaunt_guard) {
        res += `; ${cues.anti_gaunt_guard.toLowerCase()}`;
    }

    if (cues.constraints) {
        res += `; constraints: ${cues.constraints.toLowerCase()}`;
    }
    
    return res;
}

/**
 * Build a prompt by reading component files and merging them
 * This is a pure JavaScript implementation that works on Netlify
 */
export async function buildPrompt(params: BuildParams) {
    const { BASE, SUBJECT_TYPE, FACE, BODY, HAIR, ETHNICITY, SKIN, APPEARANCE, AGE, OUTFIT, POSE, BACKGROUND, v, r, overrides } = params;
    
    // Read from public/components (synced at build time)
    const componentsDir = path.join(process.cwd(), 'public/components');
    
    try {
        // Read each component as full JSON objects in merge order
        const baseComponent = readComponent(componentsDir, 'BASE', BASE);
        const subjectTypeComponent = readComponent(componentsDir, 'SUBJECT_TYPE', SUBJECT_TYPE);
        const faceComponent = readComponent(componentsDir, 'FACE', FACE);
        
        // Skip body archetype if components system is enabled
        const isBodyComponentsEnabled = overrides?.body_components?.enabled === true;
        const bodyComponent = isBodyComponentsEnabled ? {} : readComponent(componentsDir, 'BODY', BODY);
        
        const hairComponent = readComponent(componentsDir, 'HAIR', HAIR);
        const ethnicityComponent = readComponent(componentsDir, 'ETHNICITY', ETHNICITY);
        const skinComponent = readComponent(componentsDir, 'SKIN', SKIN);
        const appearanceComponent = readComponent(componentsDir, 'APPEARANCE', APPEARANCE);
        const ageComponent = AGE ? readComponent(componentsDir, 'AGE', AGE) : {};
        const outfitComponent = readComponent(componentsDir, 'OUTFIT', OUTFIT);
        const poseComponent = readComponent(componentsDir, 'POSE', POSE);
        const backgroundComponent = readComponent(componentsDir, 'BACKGROUND', BACKGROUND);
        
        // Deep merge all components in the correct order
        // Order matters: later merges override earlier ones for conflicting keys
        let mergedPrompt = deepMerge(
            {},
            baseComponent,           // Technical foundation
            subjectTypeComponent,    // Subject type
            faceComponent,           // Facial features
            bodyComponent,           // Body build
            hairComponent,           // Hair structure
            ethnicityComponent,      // Ethnicity
            skinComponent,           // Skin foundation
            appearanceComponent,     // Color and tone
            ageComponent,            // Age profile
            outfitComponent,         // Clothing
            poseComponent,           // Pose
            backgroundComponent      // Background/surrounding
        );

        // Apply granular overrides if provided
        if (overrides) {
            mergedPrompt = deepMerge(mergedPrompt, overrides);
        }
        
        // Build canonical ID
        const idParts = [
            `BASE-${BASE}`,
            `FACE-${FACE}`,
            `BODY-${BODY}`,
            `HAIR-${HAIR}`,
            `APPEARANCE-${APPEARANCE}`
        ];
        
        if (AGE) idParts.push(`AGE-${AGE}`);
        
        idParts.push(
            `ETHNICITY-${ETHNICITY}`,
            `SKIN-${SKIN}`,
            `OUTFIT-${OUTFIT}`,
            `POSE-${POSE}`,
            `BACKGROUND-${BACKGROUND}`,
            `v${v}`
        );
        
        const canonical_id = idParts.join('__');
        
        // Build human-readable title
        const title = `Gold Avatar · ${BACKGROUND}`;

        // Simple JS rendering of clauses (mirrors Python logic)
        const clauses: string[] = [];
        
        // Body (Archetype/Base)
        const bodyBlueClause = renderBodyClause(mergedPrompt.body);
        if (bodyBlueClause) {
            clauses.push(bodyBlueClause);
        } else if (mergedPrompt.subject?.build) {
            clauses.push(mergedPrompt.subject.build);
        }
        
        // Body Components (Additive Composition)
        const bodyCompClause = renderBodyComponentsClause(mergedPrompt.body_components);
        if (bodyCompClause) {
            clauses.push(bodyCompClause);
        }

        // Add Age Profile
        const ageClause = renderAgeClause(mergedPrompt.subject);
        if (ageClause) {
            clauses.push(ageClause);
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
            const hair_str = `Hair: ${h.length || 'medium'} ${h.texture || 'natural'} ${h.style_mode || h.style || 'style'}${h.bangs ? ` with ${h.bangs}` : ''}${h.volume ? `, ${h.volume.toLowerCase()} volume` : ''}.`;
            clauses.push(hair_str);
        }
        
        // Add Hair Color
        if (mergedPrompt.appearance?.hair_color?.enabled !== false) {
            const hc = mergedPrompt.appearance?.hair_color || {};
            const color_str = `Hair color: ${hc.base_color || 'natural'}${hc.highlights?.enabled ? ` with ${hc.highlights.color || 'natural'} highlights` : ''}${hc.gray_percentage && hc.gray_percentage !== 'None' ? `, ${hc.gray_percentage} gray` : ''}; ${hc.finish ? hc.finish.toLowerCase() + ' finish' : 'natural finish'}.`;
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
            dims: { BASE, SUBJECT_TYPE, FACE, BODY, HAIR, ETHNICITY, SKIN, APPEARANCE, AGE, OUTFIT, POSE, BACKGROUND, v, r }
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

