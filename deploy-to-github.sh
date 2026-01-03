#!/bin/bash

# Avatar-DB GitHub & Netlify Deployment Script
# Run this after creating your GitHub repository

echo "🚀 Avatar-DB Deployment to GitHub & Netlify"
echo "============================================"
echo ""

# Check if GitHub username is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy-to-github.sh YOUR_GITHUB_USERNAME"
    echo ""
    echo "Example: ./deploy-to-github.sh skylarmartinez"
    echo ""
    echo "Steps:"
    echo "1. Create a GitHub repository at: https://github.com/new"
    echo "   - Name it: avatar-db"
    echo "   - Keep it public or private (your choice)"
    echo "   - Don't initialize with README"
    echo ""
    echo "2. Run this script with your GitHub username"
    echo ""
    exit 1
fi

GITHUB_USER=$1
REPO_NAME="avatar-db"
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo "GitHub Username: $GITHUB_USER"
echo "Repository: $REPO_NAME"
echo "URL: $REPO_URL"
echo ""

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "⚠️  Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

echo "📡 Adding GitHub remote..."
git remote add origin "$REPO_URL"

echo "🌿 Setting branch to main..."
git branch -M main

echo "📤 Pushing to GitHub..."
if git push -u origin main; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎯 Next Step: Deploy to Netlify"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Go to: https://app.netlify.com/"
    echo ""
    echo "2. Click: 'Add new site' → 'Import an existing project'"
    echo ""
    echo "3. Choose: GitHub"
    echo ""
    echo "4. Select repository: $GITHUB_USER/$REPO_NAME"
    echo ""
    echo "5. Netlify will auto-detect these settings:"
    echo "   - Base directory: ui"
    echo "   - Build command: npm run build"
    echo "   - Publish directory: (auto)"
    echo ""
    echo "6. Click: 'Deploy site'"
    echo ""
    echo "7. Wait ~2-3 minutes for build to complete"
    echo ""
    echo "8. Your site will be live at:"
    echo "   https://[random-name].netlify.app"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "Common issues:"
    echo "1. Repository doesn't exist - create it at: https://github.com/new"
    echo "2. Authentication failed - you may need to:"
    echo "   - Set up a Personal Access Token"
    echo "   - Or use SSH: git remote set-url origin git@github.com:$GITHUB_USER/$REPO_NAME.git"
    echo ""
    exit 1
fi
