#!/bin/bash

# Avatar-DB Netlify Deployment Setup Script
# This script helps prepare your repository for Netlify deployment

set -e  # Exit on error

echo "🚀 Avatar-DB Netlify Deployment Setup"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "netlify.toml" ]; then
    echo "❌ Error: netlify.toml not found. Please run this script from the avatar-db root directory."
    exit 1
fi

echo "✅ Found netlify.toml"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""

# Check if builds directory exists and has content
if [ -d "builds/prompts" ] && [ "$(ls -A builds/prompts 2>/dev/null)" ]; then
    PROMPT_COUNT=$(ls builds/prompts/*.json 2>/dev/null | wc -l | tr -d ' ')
    echo "✅ Found $PROMPT_COUNT prompt(s) in builds/prompts/"
else
    echo "⚠️  Warning: No prompts found in builds/prompts/"
    echo "   Generate some prompts first with:"
    echo "   python3 -m src.cli build --FA SG-PH-A --BT FR --ET PH --HR ST --SC DOOR --ST POCA --v 01 --r 01"
    echo ""
fi

# Check if builds is tracked
echo ""
echo "📋 Checking if builds/ is tracked by git..."
if git ls-files --error-unmatch builds/ >/dev/null 2>&1; then
    echo "✅ builds/ is already tracked"
else
    echo "📝 Adding builds/ to git..."
    git add builds/
    echo "✅ builds/ added"
fi

echo ""
echo "📝 Staging all files..."
git add .

echo ""
echo "📊 Git status:"
git status --short

echo ""
echo "======================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Commit your changes:"
echo "   git commit -m \"Initial commit: Avatar-DB with expanded module library\""
echo ""
echo "2️⃣  Create a GitHub repository at: https://github.com/new"
echo ""
echo "3️⃣  Add the remote and push:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/avatar-db.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4️⃣  Deploy to Netlify:"
echo "   - Go to https://app.netlify.com/"
echo "   - Click 'Add new site' → 'Import an existing project'"
echo "   - Select your GitHub repo"
echo "   - Netlify will auto-detect settings from netlify.toml"
echo "   - Click 'Deploy site'"
echo ""
echo "📚 For detailed instructions, see: docs/NETLIFY_DEPLOYMENT.md"
echo ""
