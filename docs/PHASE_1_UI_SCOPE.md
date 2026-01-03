# Phase 1 UI Scope - Locked vs Editable

## Overview

Phase 1 UI is **intentionally limited** to prevent drift while maintaining creative control over key dimensions.

---

## ✏️ **EDITABLE in UI** (User Control)

### **Face Archetype** (FA)
**Current Options**:
- `SG-A`: Soft Goddess (A)
- `SG-B`: Soft Goddess (B)
- `MB-A`: Modern Bombshell (A)
- `MB-B`: Modern Bombshell (B)
- `EM-A`: Editorial Model (A)
- `EM-B`: Editorial Model (B)
- `RS-A`: Romantic Sweet (A)
- `RS-B`: Romantic Sweet (B)
- `FD-A`: Fitness Defined (A)
- `FD-B`: Fitness Defined (B)

**UI Control**: Dropdown or card selector

---

### **Body Type** (BT)
**Current Options**:
- `FR`: Fitness Ripped
- `AL`: Athletic Lean
- `CF`: Curvy Fit
- `SM`: Slender Model
- `SC`: Soft Curvy

**UI Control**: Dropdown or card selector

---

### **Ethnicity** (ET)
**Current Options**:
- `PH`: Filipina
- `EA`: East Asian
- `LA`: Latina
- `ME`: Middle Eastern
- `NE`: Northern European

**UI Control**: Dropdown or card selector

---

### **Hair Style** (HR)
**Current Options**:
- `ST`: Straight Hair
- `WV`: Soft Waves
- `PK`: Ponytail

**UI Control**: Dropdown or card selector

---

### **Scene/Background** (SC)
**Phase 1 Options** (Limited):
- `BEACH`: Editorial Beach
- `JUNGLE`: Editorial Jungle

**Future Options**:
- `DOOR`: Doorway Editorial (deprecated for Phase 1)
- Studio, Urban, etc. (Phase 2+)

**UI Control**: Dropdown or card selector

---

### **Outfit/Style** (ST)
**Phase 1 Options** (Limited):
- `POCA`: Pocahontas-Inspired Tribal Bikini

**Future Options**:
- `SPORT`: Athletic Sportswear
- `STREET`: Casual Streetwear
- `RESORT`: Elegant Resort Wear
- `ACTIVE`: Performance Activewear

**UI Control**: Dropdown or card selector

---

## 🔒 **LOCKED/HIDDEN in UI** (Not User-Editable)

### **BASE** (Technical & Editorial Foundation)
**Location**: `components/base/BASE.json`

**Contains**:
- Camera settings (shot, angle, perspective)
- Lighting (source, direction, contrast, temperature)
- Composition (framing, silhouette, depth)
- Image quality (style, resolution, sharpness)
- Global mood (emotion, vibe, prohibitions)

**Why Locked**: These settings define the core editorial aesthetic and prevent 90% of drift

**UI Visibility**: Hidden (automatically included in all builds)

---

### **POSTURE_FRAMING** (Stance & Composition Anchor)
**Location**: `components/base/POSTURE_FRAMING.json`

**Contains**:
- Posture anchor (stance, alignment, weight distribution)
- Movement constraints (no running/walking/lounging)
- Framing anchor (composition bias, background relationship)

**Why Locked**: Preserves editorial stance without requiring specific backgrounds

**UI Visibility**: Hidden (automatically included in all builds)

---

### **Negative Prompt** (NB)
**Location**: `components/negative/NB.json`

**Contains**:
- Quality exclusions
- Anatomy exclusions
- Expression exclusions (horror, scared, fearful)
- Clothing exclusions (costumes, dresses, polka dots)
- Style exclusions (cartoon, anime)
- Pose exclusions (running, walking, lounging)
- Environment exclusions (clutter, props)

**Why Locked**: Critical for preventing drift and maintaining output fidelity

**UI Visibility**: Hidden (automatically included in all builds)

**Note**: User should NEVER be able to disable or modify the negative prompt in Phase 1

---

## 🎛️ **UI Implementation Guidelines**

### **Builder Page Layout**:

```
┌─────────────────────────────────────────────┐
│  Avatar Builder                             │
├─────────────────────────────────────────────┤
│                                             │
│  Face Archetype:     [Dropdown: SG-A ▼]    │
│  Body Type:          [Dropdown: FR ▼]      │
│  Ethnicity:          [Dropdown: PH ▼]      │
│  Hair Style:         [Dropdown: ST ▼]      │
│  Background:         [Dropdown: BEACH ▼]   │
│  Outfit:             [Dropdown: POCA ▼]    │
│                                             │
│  [Generate Prompt]                          │
│                                             │
└─────────────────────────────────────────────┘

Hidden/Auto-Included:
- BASE (locked)
- POSTURE_FRAMING (locked)
- NB (negative prompt - locked)
```

---

### **Dropdown Content**:

Each dropdown should show:
- **Label** (primary): "Soft Goddess (A)"
- **Code** (secondary, muted): "SG-A"
- **Description** (optional tooltip): "Soft, feminine goddess-like beauty..."

Example:
```
┌────────────────────────────────────┐
│ Face Archetype                 ▼   │
├────────────────────────────────────┤
│ Soft Goddess (A)          SG-A     │
│ Soft Goddess (B)          SG-B     │
│ Modern Bombshell (A)      MB-A     │
│ Modern Bombshell (B)      MB-B     │
│ Editorial Model (A)       EM-A     │
│ Editorial Model (B)       EM-B     │
│ Romantic Sweet (A)        RS-A     │
│ Romantic Sweet (B)        RS-B     │
│ Fitness Defined (A)       FD-A     │
│ Fitness Defined (B)       FD-B     │
└────────────────────────────────────┘
```

---

### **Phase 1 Restrictions**:

#### **Scene/Background** (SC):
- Only show `BEACH` and `JUNGLE`
- Hide `DOOR` (deprecated for Phase 1)
- Add note: "More backgrounds coming in Phase 2"

#### **Outfit/Style** (ST):
- Only show `POCA`
- Hide other outfits (SPORT, STREET, RESORT, ACTIVE)
- Add note: "More outfits coming in Phase 2"

---

## 🚫 **What Users CANNOT Do in Phase 1**

❌ Modify camera settings  
❌ Change lighting direction or quality  
❌ Adjust composition rules  
❌ Edit posture or framing constraints  
❌ Disable negative prompt  
❌ Add custom negative terms  
❌ Select doorway background  
❌ Select non-POCA outfits  
❌ Override locked base settings  

---

## ✅ **What Users CAN Do in Phase 1**

✅ Choose face archetype (10 options)  
✅ Choose body type (5 options)  
✅ Choose ethnicity (5 options)  
✅ Choose hair style (3 options)  
✅ Choose background (2 options: Beach, Jungle)  
✅ Choose outfit (1 option: Tribal Bikini)  
✅ Generate prompt  
✅ View merged JSON output  
✅ Copy prompt to clipboard  
✅ Save prompt to library  

---

## 🎯 **Rationale**

### **Why Lock BASE and POSTURE_FRAMING?**
- These define the core editorial vibe
- Changing them would break the aesthetic
- Users want consistent high-quality output
- Prevents 90% of weird/bad results

### **Why Lock Negative Prompt?**
- Critical for preventing drift
- Bans horror, costumes, polka dots, bad anatomy
- Users should never need to modify this
- Ensures output fidelity

### **Why Limit SC and ST in Phase 1?**
- Beach and Jungle are proven safe
- POCA outfit is proven to work correctly
- Other backgrounds/outfits need Phase 1 validation first
- Prevents overwhelming users with untested options

---

## 📊 **Phase Progression**

### **Phase 1** (Current):
- Editable: FA, BT, ET, HR
- Limited: SC (Beach/Jungle), ST (POCA only)
- Locked: BASE, POSTURE_FRAMING, NB

### **Phase 2** (Future):
- Unlock more SC options (Studio, Urban, etc.)
- Unlock more ST options (Sport, Street, Resort, Active)
- Still lock BASE, POSTURE_FRAMING, NB

### **Phase 3** (Future):
- Add dynamic lighting variations (within locked constraints)
- Add seasonal/time-of-day controls
- Still lock core BASE settings

---

## 🛠️ **Implementation Checklist**

### **UI Developer Tasks**:

- [ ] Create dropdown components for FA, BT, ET, HR
- [ ] Create limited dropdown for SC (Beach/Jungle only)
- [ ] Create single-option display for ST (POCA)
- [ ] Hide BASE, POSTURE_FRAMING, NB from UI
- [ ] Auto-include BASE, POSTURE_FRAMING, NB in all builds
- [ ] Show plain English labels (not codes)
- [ ] Add tooltips with descriptions
- [ ] Disable/hide deprecated options (DOOR, old FA codes)
- [ ] Add "Phase 2 coming soon" notes for limited options
- [ ] Validate that locked modules are never exposed

---

## 📝 **Testing**

### **Verify UI Scope**:
1. User should see 6 controls (FA, BT, ET, HR, SC, ST)
2. User should NOT see BASE, POSTURE_FRAMING, or NB controls
3. SC dropdown should only show Beach and Jungle
4. ST should show POCA (or be fixed if only one option)
5. Generated prompts should include all locked modules
6. User cannot bypass or disable locked modules

### **Regression Test**:
1. Build with UI selections
2. Verify output includes BASE + POSTURE_FRAMING + NB
3. Verify output matches golden reference vibe
4. Verify no polka dots, dresses, or horror elements

---

## ✅ **Success Criteria**

**UI is correctly scoped if**:
- ✅ User can select FA, BT, ET, HR freely
- ✅ User can only select Beach or Jungle for SC
- ✅ User can only select POCA for ST
- ✅ User cannot see or modify BASE, POSTURE_FRAMING, NB
- ✅ All generated prompts include locked modules
- ✅ Output matches golden reference quality

**If any locked module is exposed or bypassable**: Fix immediately to prevent drift.
