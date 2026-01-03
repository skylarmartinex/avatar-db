# Phase 1.5: Vietnam Regional Facial Modifiers

## Overview

Phase 1.5 extension adds **optional regional facial variation** for Vietnamese ethnicity, following the same surgical pattern as Philippines regional modifiers.

---

## Purpose

Enable realistic regional Vietnamese facial diversity while maintaining:
- ✅ Locked BASE and POSTURE_FRAMING
- ✅ Consistent editorial vibe
- ✅ No impact on body, posture, mood, camera, lighting, or outfit

---

## New Dimension: VN_REGION

### **Scope**: Facial Features, Skin Nuance & Hair Texture ONLY

**Does Modify**:
- ✅ Skin tone adjustments (within Vietnamese spectrum)
- ✅ Facial structure nuances (face shape, cheekbones, jawline)
- ✅ Feature details (eyes, nose, lips)
- ✅ Hair texture and color tendencies

**Does NOT Modify**:
- ❌ Body type or proportions
- ❌ Posture or stance
- ❌ Mood or expression
- ❌ Camera or lighting
- ❌ Outfit or styling
- ❌ Background or scene

---

## Regional Options

### **1. NORTHERN** (Northern Vietnam - Hanoi / Red River Delta)
**Characteristics**:
- Skin: Fair to light golden with cool undertones, porcelain-like quality
- Face: Oval to heart-shaped with refined proportions
- Cheekbones: High and delicately defined
- Eyes: Almond-shaped with subtle monolid or double lid, expressive
- Nose: Delicate bridge with softly rounded tip
- Hair: Naturally straight with silky quality, deep black with cool undertones

**Cultural Context**: Capital region, cooler climate, refined urban aesthetic

---

### **2. HIGHLANDS** (Northern Highlands)
**Characteristics**:
- Skin: Light tan with warm peachy undertones
- Face: Round to oval with soft contours
- Cheekbones: Moderately high with gentle roundness
- Eyes: Round to almond with warm expressive quality, often monolid
- Nose: Soft bridge with rounded tip
- Hair: Straight to slightly wavy with natural body, deep black with warm undertones

**Cultural Context**: Mountainous regions, ethnic minority influence, natural warmth

---

### **3. CENTRAL** (Central Vietnam)
**Characteristics**:
- Skin: Medium golden tan with warm undertones, sun-kissed luminosity
- Face: Balanced oval with harmonious proportions
- Cheekbones: Moderately high with elegant definition
- Eyes: Almond-shaped with warm depth and natural brightness
- Nose: Refined bridge with softly defined tip
- Hair: Straight with natural shine, rich black with subtle warm highlights

**Cultural Context**: Coastal central region, balanced features, sun exposure

---

### **4. SOUTHERN** (Southern Vietnam - Urban / HCMC)
**Characteristics**:
- Skin: Warm golden tan with rich undertones, natural radiance
- Face: Heart to oval with soft feminine contours
- Cheekbones: High and softly rounded with natural lift
- Eyes: Large expressive almond eyes with warm inviting gaze
- Nose: Delicate bridge with softly upturned tip
- Hair: Straight to soft waves with natural volume, deep black with warm brown undertones

**Cultural Context**: Urban Saigon/HCMC, cosmopolitan, expressive beauty

---

### **5. MEKONG** (Mekong Delta / Rural South)
**Characteristics**:
- Skin: Warm honey tan with golden bronze undertones, sun-kissed quality
- Face: Round to oval with soft natural contours
- Cheekbones: Moderately high with gentle definition
- Eyes: Warm almond eyes with natural brightness and gentle expression
- Nose: Soft bridge with gently rounded tip
- Hair: Straight with natural thickness and slight wave tendency, rich black with warm highlights

**Cultural Context**: Rural delta region, agricultural warmth, natural sun exposure

---

## Merge Order

```
BASE (locked)
  ↓
POSTURE_FRAMING (locked)
  ↓
SC (scene)
  ↓
ET (ethnicity - VN)
  ↓
VN_REGION (NEW - optional, facial modifier only) ← Inserted here
  ↓
FA (face archetype)
  ↓
BT (body)
  ↓
HR (hair)
  ↓
ST (outfit)
  ↓
NB (negative)
```

**Key**: VN_REGION merges **after ET** and **before FA**

**Rationale**:
- ET establishes base Vietnamese characteristics
- VN_REGION adds regional facial and hair nuance
- FA applies archetype on top of regional base

---

## UI Behavior

### **Conditional Display**:
```
IF ethnicity == "VN" (Vietnamese):
  SHOW VN_REGION dropdown
ELSE:
  HIDE VN_REGION dropdown
```

### **Default Behavior**:
- If no region selected: Use neutral Vietnamese ethnicity (no regional modifier)
- If region selected: Apply regional facial and hair nuance

### **UI Layout**:
```
┌─────────────────────────────────────────────┐
│  Avatar Builder                             │
├─────────────────────────────────────────────┤
│  Ethnicity:          [Dropdown: VN ▼]      │
│                                             │
│  ↓ Vietnam Region (Optional):              │
│  [Dropdown: Northern ▼]                    │
│  (Only shown when Ethnicity = Vietnamese)  │
│                                             │
│  Face Archetype:     [Dropdown: SG-A ▼]    │
│  Body Type:          [Dropdown: FR ▼]      │
│  Hair Style:         [Dropdown: ST ▼]      │
│  Background:         [Dropdown: BEACH ▼]   │
│  Outfit:             [Dropdown: POCA ▼]    │
│                                             │
│  [Generate Prompt]                          │
└─────────────────────────────────────────────┘
```

---

## Example Builds

### **Without Regional Modifier**:
```bash
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity VN \
  --hair ST \
  --scene BEACH \
  --outfit POCA \
  --negative NB
```

**Result**: Neutral Vietnamese with Soft Goddess archetype

---

### **With Northern Regional Modifier**:
```bash
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity VN \
  --vn-region NORTHERN \
  --hair ST \
  --scene BEACH \
  --outfit POCA \
  --negative NB
```

**Result**: Northern Vietnamese (Hanoi) with Soft Goddess archetype
- Fair to light golden skin (regional nuance)
- Refined oval features (regional nuance)
- Porcelain-like skin quality (regional nuance)
- Silky straight hair (regional nuance)
- + Soft Goddess archetype characteristics

---

### **With Southern Regional Modifier**:
```bash
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity VN \
  --vn-region SOUTHERN \
  --hair ST \
  --scene BEACH \
  --outfit POCA \
  --negative NB
```

**Result**: Southern Vietnamese (HCMC) with Soft Goddess archetype
- Warm golden tan (regional nuance)
- Heart-shaped face (regional nuance)
- Large expressive eyes (regional nuance)
- Soft waves tendency (regional nuance)
- + Soft Goddess archetype characteristics

---

## Canonical ID Format

### **Without Region**:
```
FA-SG-A__BT-FR__ET-VN__HR-ST__SC-BEACH__ST-POCA__v01__r01
```

### **With Region**:
```
FA-SG-A__BT-FR__ET-VN__VN_REGION-NORTHERN__HR-ST__SC-BEACH__ST-POCA__v01__r01
```

**Note**: VN_REGION appears after ET in canonical ID

---

## Architectural Safeguards

### **1. Scope Limitation**:
Every VN_REGION module explicitly states:
```json
"scope": "facial features, skin nuance, and hair texture only - does not affect body, posture, mood, camera, lighting, or outfit"
```

### **2. No Overrides**:
VN_REGION modules only ADD nuance, they don't override:
- BASE settings
- POSTURE_FRAMING settings
- Body type specifications
- Outfit details

### **3. Merge Position**:
Placed between ET and FA ensures:
- Regional nuance applied to ethnic base
- Face archetype can still express on top
- No conflict with locked modules

---

## Testing

### **Regression Test**:
Build same configuration with different regions:

```bash
# Baseline (no region)
python3 -m src.cli build --face SG-A --body FR --ethnicity VN --hair ST --scene BEACH --outfit POCA --negative NB

# Northern variant
python3 -m src.cli build --face SG-A --body FR --ethnicity VN --vn-region NORTHERN --hair ST --scene BEACH --outfit POCA --negative NB

# Southern variant
python3 -m src.cli build --face SG-A --body FR --ethnicity VN --vn-region SOUTHERN --hair ST --scene BEACH --outfit POCA --negative NB
```

### **Expected Results**:
- ✅ All have identical posture, body, outfit, vibe
- ✅ Only facial features, skin tone, and hair texture vary
- ✅ No drift in camera, lighting, or mood
- ✅ No impact on editorial aesthetic

### **Verification Checklist**:
- [ ] Same upright stance across all regions
- [ ] Same body definition across all regions
- [ ] Same outfit (tribal bikini) across all regions
- [ ] Same background treatment across all regions
- [ ] Same lighting quality across all regions
- [ ] Facial features show regional variation
- [ ] Skin tone shows regional variation
- [ ] Hair texture shows regional variation
- [ ] No polka dots, dresses, or horror elements

---

## Phase 1.5 Vietnam Status

### **Files Created**: 5 regional modules
- `components/vn_region/NORTHERN.json`
- `components/vn_region/HIGHLANDS.json`
- `components/vn_region/CENTRAL.json`
- `components/vn_region/SOUTHERN.json`
- `components/vn_region/MEKONG.json`

### **Registry Updated**:
- Added VN_REGION dimension with 5 options
- Each with label, description, region, status

### **Documentation**:
- This file: `docs/PHASE_1_5_VIETNAM_REGIONAL_MODIFIERS.md`

---

## Comparison: Philippines vs Vietnam

### **Similarities**:
- Both are optional dimensions
- Both modify facial features, skin, and hair only
- Both merge after ET, before FA
- Both use conditional UI display
- Both default to neutral if not selected

### **Differences**:
- **Philippines**: 6 regions (Ilocos, Tagalog, Bicol, Visayas, Mindanao, Bangsamoro)
- **Vietnam**: 5 regions (Northern, Highlands, Central, Southern, Mekong)
- **Hair texture**: Vietnam includes explicit hair texture bias (straight, wavy)
- **Skin range**: Vietnam ranges from fair (Northern) to honey tan (Mekong)

---

## Success Criteria

**Phase 1.5 Vietnam is successful if**:
- ✅ Regional variation adds realistic facial diversity
- ✅ Hair texture variation is subtle and natural
- ✅ No impact on Phase 1 locked architecture
- ✅ Body, posture, mood, camera, lighting unchanged
- ✅ UI conditionally shows VN_REGION only for Vietnamese
- ✅ Default (no region) still works correctly
- ✅ All regional builds pass regression tests

---

## Bottom Line

**Phase 1.5 Vietnam adds surgical precision**:
- Realistic regional Vietnamese facial variation
- Includes hair texture nuance
- Zero impact on Phase 1 stability
- Optional and conditional
- Follows established pattern from Philippines

**The Phase 1 architecture remains rock-solid.**
