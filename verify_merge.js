#!/usr/bin/env node
/**
 * Verify that merging component files recreates GOLD_STANDARD.json
 * This validates the deep-merge reconstruction logic
 */

const fs = require('fs');
const path = require('path');

// Deep merge function (same as used in prompt-builder.ts)
function deepMerge(...objects) {
    const result = {};
    
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

// Read JSON file
function readJSON(filename) {
    const filePath = path.join(__dirname, filename);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filename}`);
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Main verification
console.log('🔍 Verifying component merge reconstruction...\n');

// Read all component files in merge order
const base = readJSON('BASE_FROM_GOLD.json');
const subjectType = readJSON('SUBJECT_TYPE_FROM_GOLD.json');
const face = readJSON('FACE_FROM_GOLD.json');
const body = readJSON('BODY_FROM_GOLD.json');
const hair = readJSON('HAIR_FROM_GOLD.json');
const ethnicity = readJSON('ETHNICITY_FROM_GOLD.json');
const skin = readJSON('SKIN_FROM_GOLD.json');
const outfit = readJSON('OUTFIT_FROM_GOLD.json');
const pose = readJSON('POSE_FROM_GOLD.json');
const background = readJSON('BACKGROUND_FROM_GOLD.json');

console.log('✅ Loaded all component files');

// Merge in order
const merged = deepMerge(
    {},
    base,
    subjectType,
    face,
    body,
    hair,
    ethnicity,
    skin,
    outfit,
    pose,
    background
);

console.log('✅ Deep merge completed\n');

// Read gold standard
const goldStandard = readJSON('GOLD_STANDARD.json');

// Compare
const mergedJSON = JSON.stringify(merged, null, 2);
const goldJSON = JSON.stringify(goldStandard, null, 2);

if (mergedJSON === goldJSON) {
    console.log('🎉 SUCCESS! Merged output matches GOLD_STANDARD.json exactly!\n');
    console.log('✅ Component decomposition is correct');
    console.log('✅ Deep merge logic is working');
    console.log('✅ Nesting structure preserved');
    process.exit(0);
} else {
    console.log('⚠️  Merged output differs from GOLD_STANDARD.json\n');
    
    // Check if content is the same (ignoring key order)
    const mergedKeys = Object.keys(merged).sort();
    const goldKeys = Object.keys(goldStandard).sort();
    
    if (JSON.stringify(mergedKeys) === JSON.stringify(goldKeys)) {
        console.log('✅ Top-level keys match (difference may be key ordering)');
        
        // Deep content comparison
        function deepEqual(a, b) {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (typeof a !== 'object' || typeof b !== 'object') return false;
            
            const keysA = Object.keys(a).sort();
            const keysB = Object.keys(b).sort();
            
            if (JSON.stringify(keysA) !== JSON.stringify(keysB)) return false;
            
            for (const key of keysA) {
                if (!deepEqual(a[key], b[key])) return false;
            }
            
            return true;
        }
        
        if (deepEqual(merged, goldStandard)) {
            console.log('✅ Content matches exactly (key order differs)');
            console.log('\n🎉 VERIFICATION PASSED!\n');
            process.exit(0);
        }
    }
    
    console.log('❌ Content mismatch detected');
    console.log('\nWriting merged output to MERGED_OUTPUT.json for inspection...');
    fs.writeFileSync('MERGED_OUTPUT.json', mergedJSON);
    console.log('✅ Saved to MERGED_OUTPUT.json\n');
    process.exit(1);
}
