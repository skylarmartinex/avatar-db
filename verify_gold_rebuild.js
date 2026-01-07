#!/usr/bin/env node
/**
 * Verify that the new minimal components rebuild GOLD_STANDARD correctly
 */

const fs = require('fs');
const path = require('path');

function deepMerge(...objects) {
    const result = {};
    for (const obj of objects) {
        if (!obj || typeof obj !== 'object') continue;
        for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            const value = obj[key];
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
                result[key] = value;
            }
        }
    }
    return result;
}

function readJSON(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

console.log('🔍 Verifying Gold Standard rebuild...\n');

// Read new minimal components
const base = readJSON('components/base/BASE.json');
const subjectType = readJSON('components/subject/TYPE.json');
const face = readJSON('components/face/GOLD.json');
const body = readJSON('components/body/GOLD.json');
const hair = readJSON('components/hair/GOLD.json');
const ethnicity = readJSON('components/ethnicity/GOLD.json');
const skin = readJSON('components/skin/GOLD.json');
const outfit = readJSON('components/outfit/GOLD.json');
const pose = readJSON('components/pose/GOLD.json');
const background = readJSON('components/background/DOORWAY_GOLD.json');

console.log('✅ Loaded all minimal components\n');

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
    console.log('🎉 SUCCESS! Minimal components rebuild GOLD_STANDARD perfectly!\n');
    console.log('✅ Component decomposition is correct');
    console.log('✅ Deep merge logic is working');
    console.log('✅ Nesting structure preserved');
    console.log('✅ Ready for background swapping\n');
    process.exit(0);
} else {
    console.log('❌ Content mismatch detected\n');
    console.log('Writing merged output to REBUILD_OUTPUT.json for inspection...');
    fs.writeFileSync('REBUILD_OUTPUT.json', JSON.stringify(merged, null, 2));
    console.log('✅ Saved to REBUILD_OUTPUT.json\n');
    process.exit(1);
}
