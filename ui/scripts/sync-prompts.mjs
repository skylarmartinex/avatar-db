#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const REPO_ROOT = path.resolve(__dirname, '../..');
const SOURCE_PROMPTS = path.join(REPO_ROOT, 'builds/prompts');
const SOURCE_COMPONENTS = path.join(REPO_ROOT, 'components');
const SOURCE_REGISTRY = path.join(REPO_ROOT, 'registry');
const DEST_PROMPTS = path.join(__dirname, '../public/prompts');
const DEST_COMPONENTS = path.join(__dirname, '../public/components');
const DEST_REGISTRY = path.join(__dirname, '../public/registry');
const INDEX_FILE = path.join(DEST_PROMPTS, 'index.json');

console.log('🔄 Syncing data to static assets...\n');

// 1. Sync Components (required for Builder)
console.log('📦 Syncing components...');
if (fs.existsSync(SOURCE_COMPONENTS)) {
    copyDirectory(SOURCE_COMPONENTS, DEST_COMPONENTS);
    const componentCount = countFiles(DEST_COMPONENTS, '.json');
    console.log(`   ✅ Copied ${componentCount} component files\n`);
} else {
    console.warn('   ⚠️  Components directory not found\n');
}

// 2. Sync Registry (required for UI)
console.log('📦 Syncing registry...');
if (fs.existsSync(SOURCE_REGISTRY)) {
    copyDirectory(SOURCE_REGISTRY, DEST_REGISTRY);
    console.log(`   ✅ Copied registry files\n`);
} else {
    console.warn('   ⚠️  Registry directory not found\n');
}

// 3. Sync Prompts
console.log('📦 Syncing prompts...');
if (!fs.existsSync(SOURCE_PROMPTS)) {
    console.warn('   ⚠️  Prompts directory not found');
    console.warn('   Creating empty index.json...\n');
    fs.mkdirSync(DEST_PROMPTS, { recursive: true });
    fs.writeFileSync(INDEX_FILE, JSON.stringify({ prompts: [] }, null, 2));
    console.log('   ✅ Created empty index.json\n');
} else {
    fs.mkdirSync(DEST_PROMPTS, { recursive: true });
    
    const files = fs.readdirSync(SOURCE_PROMPTS).filter(f => f.endsWith('.json'));
    console.log(`   Found ${files.length} prompt files`);
    
    const index = [];
    let copiedCount = 0;
    
    for (const filename of files) {
        const sourcePath = path.join(SOURCE_PROMPTS, filename);
        const destPath = path.join(DEST_PROMPTS, filename);
        
        fs.copyFileSync(sourcePath, destPath);
        copiedCount++;
        
        const stats = fs.statSync(destPath);
        const canonicalId = filename.replace('.json', '');
        const parts = canonicalId.split('__');
        
        const dims = {};
        parts.forEach(part => {
            const match = part.match(/^([A-Z_]+)-(.+)$/);
            if (match) {
                const [, dimension, code] = match;
                dims[dimension] = code;
            } else if (part.startsWith('v')) {
                dims.v = part.substring(1);
            }
        });
        
        index.push({
            filename,
            canonicalId,
            dims,
            modified: stats.mtime.toISOString(),
            size: stats.size
        });
        
        if (copiedCount % 25 === 0) {
            console.log(`   Progress: ${copiedCount}/${files.length}...`);
        }
    }
    
    index.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
    
    const indexData = {
        prompts: index,
        generated: new Date().toISOString(),
        count: index.length
    };
    
    fs.writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 2));
    console.log(`   ✅ Copied ${copiedCount} prompts\n`);
}

console.log('✅ Sync complete!\n');

// Helper functions
function copyDirectory(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function countFiles(dir, ext) {
    let count = 0;
    
    if (!fs.existsSync(dir)) return 0;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            count += countFiles(fullPath, ext);
        } else if (entry.name.endsWith(ext)) {
            count++;
        }
    }
    
    return count;
}
