# Netlify Deployment Guide - Avatar-DB Read-Only Viewer

## Overview
This guide will help you deploy the Avatar-DB UI as a **read-only library browser** on Netlify. The deployed site will allow viewing modules, prompts, and run history, but will not allow editing or saving.

---

## ✅ Pre-Deployment Checklist

- [x] `.gitignore` updated to track `builds/` directory
- [x] `netlify.toml` configuration created
- [ ] GitHub repository created
- [ ] Builds directory has content to display
- [ ] UI configured for read-only mode in production

---

## Step 1: Initialize Git and Push to GitHub

### 1.1 Initialize Git (if not already done)
```bash
cd /Users/skylarmartinez/.gemini/antigravity/scratch/avatar-db
git init
git add .
git commit -m "Initial commit: Avatar-DB with expanded module library"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., `avatar-db`)
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)

### 1.3 Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/avatar-db.git
git branch -M main
git push -u origin main
```

---

## Step 2: Verify Builds Directory is Tracked

### Check what's being tracked:
```bash
git status
git ls-files builds/
```

You should see files like:
- `builds/prompts/*.json`
- `builds/runs/*.json`
- `builds/manifests/*.json`

### If builds/ is not tracked:
```bash
git add builds/
git commit -m "Track builds output for Netlify viewer"
git push
```

---

## Step 3: Deploy to Netlify

### 3.1 Sign in to Netlify
Go to https://app.netlify.com/

### 3.2 Create New Site
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub** as your Git provider
3. Authorize Netlify to access your GitHub account
4. Select your `avatar-db` repository

### 3.3 Configure Build Settings

**Netlify will auto-detect Next.js, but verify these settings:**

| Setting | Value |
|---------|-------|
| **Base directory** | `ui` |
| **Build command** | `npm run build` |
| **Publish directory** | *(leave blank - handled by Next.js plugin)* |
| **Node version** | `20` (set in netlify.toml) |

### 3.4 Deploy
Click **"Deploy site"**

Netlify will:
1. Clone your repo
2. Install dependencies in `/ui`
3. Build the Next.js app
4. Deploy to a random URL (e.g., `random-name-123.netlify.app`)

---

## Step 4: Configure Read-Only Mode (Recommended)

To make the UI truly read-only in production, add environment detection:

### 4.1 Create a utility file for read-only detection

Create `ui/lib/deployment.ts`:
```typescript
export const isProduction = process.env.NODE_ENV === 'production';
export const isReadOnly = isProduction;

export function assertWriteAccess() {
  if (isReadOnly) {
    throw new Error('Read-only mode: This action is not available in production');
  }
}
```

### 4.2 Update API routes to block writes

Example for `ui/app/api/modules/route.ts`:
```typescript
import { isReadOnly } from '@/lib/deployment';

export async function POST(request: Request) {
  if (isReadOnly) {
    return Response.json(
      { error: 'Read-only mode: Editing is disabled in production' },
      { status: 403 }
    );
  }
  
  // ... existing POST logic
}
```

### 4.3 Update UI components to hide edit buttons

Example:
```typescript
import { isReadOnly } from '@/lib/deployment';

export function ModuleEditor() {
  return (
    <div>
      {/* ... */}
      {!isReadOnly && (
        <Button onClick={handleSave}>Save Changes</Button>
      )}
      {isReadOnly && (
        <div className="text-sm text-muted-foreground">
          Read-only mode - editing disabled
        </div>
      )}
    </div>
  );
}
```

---

## Step 5: Add a Prompts Browser Page (Optional but Recommended)

Create `ui/app/prompts/page.tsx`:

```typescript
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default async function PromptsPage() {
  const promptsDir = path.join(process.cwd(), '../builds/prompts');
  
  let promptFiles: string[] = [];
  try {
    promptFiles = fs.readdirSync(promptsDir)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse(); // Most recent first
  } catch (error) {
    console.error('Error reading prompts directory:', error);
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Generated Prompts</h1>
      
      {promptFiles.length === 0 ? (
        <p className="text-muted-foreground">
          No prompts found. Generate prompts locally and commit them to see them here.
        </p>
      ) : (
        <div className="grid gap-4">
          {promptFiles.map(file => (
            <Link
              key={file}
              href={`/prompts/${file.replace('.json', '')}`}
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-mono text-sm">{file}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

And create `ui/app/prompts/[id]/page.tsx` for viewing individual prompts.

---

## Step 6: Update Your Library (Continuous Deployment)

Whenever you want to add new prompts to the hosted viewer:

### 6.1 Generate prompts locally
```bash
cd /Users/skylarmartinez/.gemini/antigravity/scratch/avatar-db

# Example: Build a new prompt
python3 -m src.cli build \
  --FA EM-PH-A \
  --BT SM \
  --ET PH \
  --HR ST \
  --SC BEACH \
  --ST RESORT \
  --v 01 \
  --r 01
```

### 6.2 Commit and push
```bash
git add builds/
git commit -m "Add new prompts: Editorial Model + Beach Resort"
git push
```

### 6.3 Netlify auto-deploys
Netlify will automatically detect the push and redeploy your site with the new prompts!

---

## Step 7: Custom Domain (Optional)

### 7.1 In Netlify Dashboard
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `avatar-db.yourdomain.com`)

### 7.2 Update DNS
Add a CNAME record pointing to your Netlify subdomain:
```
CNAME  avatar-db  random-name-123.netlify.app
```

Netlify will automatically provision SSL certificates.

---

## Netlify Settings Summary

### Build Settings
```toml
[build]
  base = "ui"
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NODE_ENV = "production"
```

### What Works on Netlify ✅
- ✅ View all modules (faces, bodies, ethnicities, hair, scenes, outfits)
- ✅ View registry with metadata
- ✅ Browse generated prompts
- ✅ View run history
- ✅ Copy JSON / Copy flattened text
- ✅ Search and filter modules
- ✅ View packs (subject + style)

### What Doesn't Work ❌
- ❌ Editing modules (read-only)
- ❌ Saving changes (disabled in production)
- ❌ Generating new prompts on the server (local CLI only)
- ❌ Writing run notes/favorites (no database)

---

## Troubleshooting

### Build fails with "Cannot find module"
**Solution**: Ensure all dependencies are in `ui/package.json` and `package-lock.json` is committed.

### Prompts not showing up
**Solution**: 
1. Verify `builds/` is tracked: `git ls-files builds/`
2. Ensure files are committed: `git add builds/ && git commit -m "Add builds"`
3. Push to GitHub: `git push`

### "Read-only mode" not working
**Solution**: Check that `NODE_ENV=production` is set in Netlify environment variables.

### 404 on API routes
**Solution**: Ensure `netlify.toml` has the redirect rules for `/api/*`

---

## Quick Commands Reference

```bash
# Check what's tracked in builds/
git ls-files builds/

# Add new prompts
git add builds/
git commit -m "Add new prompts"
git push

# View deployment logs
# Go to Netlify dashboard → Deploys → Click on latest deploy

# Test build locally (simulates Netlify)
cd ui
npm run build
npm start
```

---

## Your Exact Netlify Settings

**Repository**: `https://github.com/YOUR_USERNAME/avatar-db`

**Build Settings**:
- Base directory: `ui`
- Build command: `npm run build`
- Publish directory: *(auto-detected by Next.js plugin)*
- Node version: `20`

**Environment Variables** (if needed):
- `NODE_ENV`: `production` (already in netlify.toml)

---

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Deploy to Netlify
4. ✅ Verify deployment works
5. ✅ (Optional) Add custom domain
6. ✅ (Optional) Add read-only mode UI indicators
7. ✅ (Optional) Add prompts browser page

---

**Your UI folder is**: `/ui` ✅

**Configuration file**: `netlify.toml` ✅

**Ready to deploy!** 🚀
