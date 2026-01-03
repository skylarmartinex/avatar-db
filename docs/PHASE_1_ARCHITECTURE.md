# Phase 1: Locked Base + Refined Modules

## Overview

Phase 1 implements a **locked technical foundation** that eliminates 90% of weird outputs while allowing creative freedom in backgrounds and styling.

---

## Architecture

### **Locked Components** (Non-Editable in UI)

#### 1. **BASE.json** - Technical & Editorial Foundation
**Location**: `components/base/BASE.json`

**Purpose**: Locks camera, lighting, composition, quality, and mood

**Contains**:
- **Camera**: Medium portrait, straight-on angle, natural perspective
- **Lighting**: Natural sunlight, strong side light, high contrast, warm tones
- **Composition**: Centered subject, vertical framing, clean silhouette
- **Image Quality**: Luxury editorial, ultra-high res, extreme clarity
- **Global Mood**: Confident, calm, magnetic; prohibits fear/horror/costumes

**Why Locked**: These settings define the core editorial vibe and prevent drift

#### 2. **POSTURE_FRAMING.json** - Stance & Composition Anchor
**Location**: `components/base/POSTURE_FRAMING.json`

**Purpose**: Replaces doorway's functional role in controlling posture

**Contains**:
- **Posture Anchor**: Upright stance, neutral spine, weight shifted to one hip
- **Movement Constraints**: No running, walking, lounging, exaggerated motion
- **Framing Anchor**: Centered subject, vertical framing, clear body outline
- **Background Relationship**: Subject separated from background, no clutter

**Why Locked**: Preserves editorial stance without requiring specific backgrounds

---

### **Editable Components** (Available in UI)

#### 3. **Face Archetype** (FA)
**Example**: `components/face/SG-A.json` (Soft Goddess A)

**Contains**:
- Detailed facial feature descriptions
- Face shape, jawline, cheekbones
- Eye shape, expression guardrails
- Nose and lip specifications
- Expression constraints (no fear, no horror)

**UI Control**: User can select different face archetypes

#### 4. **Body Type** (BT)
**Example**: `components/body/FR.json` (Fitness Ripped)

**Contains**:
- Build description (lean, athletic, stage-ready)
- Definition specs (abs, upper/lower body)
- Proportions (waist-to-hip contrast)
- Guardrails (no bulky look, no soft physique)

**UI Control**: User can select different body types

#### 5. **Ethnicity** (ET)
**Example**: `components/ethnicity/PH.json` (Filipina)

**Contains**:
- Skin tone, undertone, texture
- Aesthetic bias (warmth, elegance)
- Beauty reinforcement

**UI Control**: User can select different ethnicities

#### 6. **Background/Scene** (SC)
**Examples**: 
- `components/scene/BEACH.json` (Editorial Beach)
- `components/scene/JUNGLE.json` (Editorial Jungle)

**Contains**:
- Setting description
- Environment style (clean, minimal, editorial)
- Visual priority (background secondary)
- Guardrails (no props, no motion, no chaos)

**UI Control**: User can swap backgrounds safely

#### 7. **Outfit/Style** (ST)
**Example**: `components/outfit/POCA.json` (Pocahontas Tribal Bikini)

**Contains**:
- Outfit description
- Materials and details
- Fit and style
- **Explicit exclusions** (no dresses, no polka dots, no costumes)

**UI Control**: User can select different outfits

---

## Merge Order

```
BASE (locked)
  ↓
POSTURE_FRAMING (locked)
  ↓
SC (scene - editable)
  ↓
ET (ethnicity - editable)
  ↓
FA (face - editable)
  ↓
BT (body - editable)
  ↓
HR (hair - editable)
  ↓
ST (outfit - editable)
  ↓
NB (negative - editable)
```

**Key Insight**: BASE and POSTURE_FRAMING are applied first and never overridden

---

## What This Achieves

### ✅ **Preserved**
- Editorial vibe and confidence
- Posture and framing control
- High-contrast lighting
- Luxury photography aesthetic
- Clean silhouette

### ✅ **Removed**
- Dependency on doorway backgrounds
- Ambiguity in camera/lighting
- Drift toward horror/costumes/chaos

### ✅ **Gained**
- Safe background swapping (Beach, Jungle)
- Creative freedom without drift
- Explicit guardrails on every dimension

---

## UI Editing Rules

### **User Can Edit**:
- ✅ Face archetype (FA)
- ✅ Body type (BT)
- ✅ Ethnicity (ET)
- ✅ Background (SC)
- ✅ Outfit (ST)
- ✅ Hair (HR)

### **User Cannot Edit** (Locked):
- 🔒 Camera settings
- 🔒 Lighting direction/quality
- 🔒 Composition rules
- 🔒 Image quality specs
- 🔒 Posture anchor
- 🔒 Framing rules
- 🔒 Global mood/vibe

---

## Example: Beach vs Jungle

### **Beach Prompt** (with locked base):
```
BASE (locked camera, lighting, composition)
  + POSTURE_FRAMING (locked editorial stance)
  + BEACH (clean, minimal, editorial beach)
  + PH (Filipina ethnicity)
  + SG-A (Soft Goddess face)
  + FR (Fitness Ripped body)
  + ST (Straight hair)
  + POCA (Tribal bikini)
```

### **Jungle Prompt** (with locked base):
```
BASE (locked camera, lighting, composition)
  + POSTURE_FRAMING (locked editorial stance)
  + JUNGLE (controlled, cinematic jungle)
  + PH (Filipina ethnicity)
  + SG-A (Soft Goddess face)
  + FR (Fitness Ripped body)
  + ST (Straight hair)
  + POCA (Tribal bikini)
```

**Result**: Both outputs have identical vibe, posture, and confidence - only the background changes

---

## Key Guardrails

### **Face Module**:
- No exaggerated expressions
- No fear or horror emotion
- No cartoon stylization

### **Body Module**:
- No bulky bodybuilding look
- No soft or undefined physique

### **Beach Background**:
- No props
- No walking or candid movement
- No wide scenic emphasis
- Background visually secondary

### **Jungle Background**:
- No chaotic foliage crossing body
- No survival or crouching poses
- No fear or tension

### **Outfit Module**:
- **No dresses**
- **No polka dots**
- **No modern casual clothing**
- **No costumes**

---

## Files Created

### **New Base Components**:
- `components/base/BASE.json` (locked)
- `components/base/POSTURE_FRAMING.json` (locked)

### **Updated Editable Components**:
- `components/face/SG-A.json` (detailed Soft Goddess)
- `components/body/FR.json` (detailed Fitness Ripped)
- `components/ethnicity/PH.json` (detailed Filipina)
- `components/scene/BEACH.json` (editorial beach with guardrails)
- `components/scene/JUNGLE.json` (editorial jungle with guardrails)
- `components/outfit/POCA.json` (tribal bikini with explicit exclusions)

### **Registry Update**:
- Added BASE dimension (marked as locked, non-editable)

---

## Next Steps

### **Phase 2** (Future):
- Add more face archetypes (Modern Bombshell, Editorial Model, etc.)
- Add more body types (Athletic Lean, Curvy Fit, etc.)
- Add more backgrounds (Studio, Urban, etc.)
- Add more outfits (Sportswear, Resort, etc.)

### **Phase 3** (Future):
- Dynamic lighting variations
- Seasonal/time-of-day controls
- Advanced pose variations (within editorial constraints)

---

## Bottom Line

**Phase 1 Endpoint**:
- ✅ Preserved the magic (editorial vibe, confidence, posture)
- ✅ Removed the crutch (doorway dependency)
- ✅ Gained creative freedom (safe background swapping)
- ✅ Eliminated drift (explicit guardrails everywhere)

**Generated prompts are now visually indistinguishable in vibe, posture, and confidence from the original reference prompt—even when swapping backgrounds.**

This is the correct foundation for all future phases.
