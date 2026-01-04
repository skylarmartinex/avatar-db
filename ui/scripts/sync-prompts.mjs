#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const REPO_ROOT = path.resolve(__dirname, '../..');
const SOURCE_DIR = path.join(REPO_ROOT, 'builds/prompts');
const DEST_DIR = path.join(__dirname, '../public/prompts');
const INDEX_FILE = path.join(DEST_DIR, 'index.json');

console.log('🔄 Syncing prompts to static assets...\n');
console.log(`Source: ${SOURCE_DIR}`);
console.log(`Destination: ${DEST_DIR}\n`);

// Check if source directory exists
if (!fs.existsSync(SOURCE_DIR)) {
    console.warn('⚠️  Source directory does not exist:', SOURCE_DIR);
    console.warn('   Creating empty index.json for deployment...\n');
    
    // Create destination directory
    fs.mkdirSync(DEST_DIR, { recursive: true });
    
    // Write empty index
    fs.writeFileSync(INDEX_FILE, JSON.stringify({ prompts: [] }, null, 2));
    console.log('✅ Created empty index.json');
    process.exit(0);
}

// Create destination directory
fs.mkdirSync(DEST_DIR, { recursive: true });

// Read all JSON files from source
const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith('.json'));

console.log(`📦 Found ${files.length} prompt files\n`);

// Copy files and build index
const index = [];
let copiedCount = 0;

for (const filename of files) {
    const sourcePath = path.join(SOURCE_DIR, filename);
    const destPath = path.join(DEST_DIR, filename);
    
    // Copy file
    fs.copyFileSync(sourcePath, destPath);
    copiedCount++;
    
    // Get file stats
    const stats = fs.statSync(destPath);
    
    // Parse canonical ID and extract dimensions
    // Format: FA-{FA}__BT-{BT}__ET-{ET}__[PH_REGION-{region}__]HR-{HR}__SC-{SC}__ST-{ST}__v{XX}.json
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
    
    // Add to index
    index.push({
        filename,
        canonicalId,
        dims,
        modified: stats.mtime.toISOString(),
        size: stats.size
    });
    
    // Progress indicator
    if (copiedCount % 25 === 0) {
        console.log(`   Copied ${copiedCount}/${files.length}...`);
    }
}

// Sort by modified date (newest first)
index.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

// Write index file
const indexData = {
    prompts: index,
    generated: new Date().toISOString(),
    count: index.length
};

fs.writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 2));

console.log(`\n✅ Sync complete!`);
console.log(`   Copied: ${copiedCount} files`);
console.log(`   Index: ${INDEX_FILE}`);
console.log(`   Size: ${(fs.statSync(INDEX_FILE).size / 1024).toFixed(2)} KB\n`);
