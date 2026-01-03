# 🚀 Netlify Deployment - Quick Reference

## Your Configuration

**UI Location**: `/ui` ✅  
**Netlify Config**: `netlify.toml` ✅  
**Builds Tracked**: Yes (20 prompts ready) ✅

---

## Exact Netlify Settings

When you create the site on Netlify, use these settings:

| Setting | Value |
|---------|-------|
| **Base directory** | `ui` |
| **Build command** | `npm run build` |
| **Publish directory** | *(leave blank)* |

Everything else is configured in `netlify.toml` ✅

---

## 3-Step Deployment

### 1. Create GitHub Repo
Go to: https://github.com/new
- Name: `avatar-db` (or your choice)
- **Don't** initialize with README

### 2. Push to GitHub
```bash
cd /Users/skylarmartinez/.gemini/antigravity/scratch/avatar-db

# Commit everything
git commit -m "Initial commit: Avatar-DB with expanded module library"

# Add your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/avatar-db.git

# Push
git branch -M main
git push -u origin main
```

### 3. Deploy on Netlify
1. Go to: https://app.netlify.com/
2. Click: **"Add new site"** → **"Import an existing project"**
3. Choose: **GitHub**
4. Select: Your `avatar-db` repository
5. Click: **"Deploy site"** (settings auto-detected from netlify.toml)

**Done!** Your site will be live at `random-name-123.netlify.app`

---

## What's Deployed

### ✅ Available (Read-Only)
- View all 32 modules (10 faces, 5 bodies, 5 ethnicities, 3 hair, 3 scenes, 5 outfits, 1 negative)
- View 22 packs (11 subject + 11 style)
- Browse 20 generated prompts
- View run history
- Copy JSON / Copy text
- Search and filter

### ❌ Disabled in Production
- Editing modules
- Saving changes
- Generating prompts on server
- Writing notes/favorites

---

## Update Your Deployed Site

Whenever you want to add new content:

```bash
# 1. Generate new prompts locally
python3 -m src.cli build --FA EM-PH-A --BT SM --ET PH --HR ST --SC BEACH --ST RESORT --v 01 --r 01

# 2. Commit and push
git add builds/
git commit -m "Add new prompts: Editorial Model + Beach Resort"
git push

# 3. Netlify auto-deploys (takes ~2 minutes)
```

---

## Files You Created

- ✅ `netlify.toml` - Netlify configuration
- ✅ `.gitignore` - Updated to track builds/
- ✅ `docs/NETLIFY_DEPLOYMENT.md` - Full deployment guide
- ✅ `docs/EXPANSION_SUMMARY.md` - Module library summary
- ✅ `docs/UI_INTEGRATION.md` - UI integration guide
- ✅ `ui/utils/deployment.ts` - Read-only mode utilities
- ✅ `setup-netlify.sh` - Setup automation script

---

## Troubleshooting

### "Build failed"
Check Netlify deploy logs. Common issues:
- Missing dependencies → Check `ui/package.json`
- Wrong base directory → Should be `ui`

### "Prompts not showing"
Ensure builds/ is committed:
```bash
git ls-files builds/  # Should show files
git add builds/
git commit -m "Add builds"
git push
```

### "Can't edit modules"
This is expected in production (read-only mode).  
Edit locally and push to update.

---

## Support Links

- **Netlify Docs**: https://docs.netlify.com/
- **Next.js on Netlify**: https://docs.netlify.com/frameworks/next-js/
- **Full Guide**: `docs/NETLIFY_DEPLOYMENT.md`

---

## Current Status

```
✅ Git initialized
✅ All files staged
✅ Builds tracked (20 prompts)
✅ Netlify config created
✅ Documentation complete

🎯 Ready to push to GitHub and deploy!
```

---

**Next Command**:
```bash
git commit -m "Initial commit: Avatar-DB with expanded module library"
```

Then create your GitHub repo and push! 🚀
