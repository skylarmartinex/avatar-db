# Phase 1.5: Philippines Regional Facial Modifiers

## Overview

Phase 1.5 adds **optional regional facial variation** for Filipina ethnicity without destabilizing the Phase 1 architecture.

---

## Purpose

Allow realistic regional Filipina facial diversity while maintaining:
- ✅ Locked BASE and POSTURE_FRAMING
- ✅ Consistent editorial vibe
- ✅ No impact on body, posture, mood, camera, lighting, or outfit

---

## New Dimension: PH_REGION

### **Scope**: Facial Features & Skin Nuance ONLY

**Does Modify**:
- ✅ Skin tone adjustments (within golden tan spectrum)
- ✅ Facial structure nuances (face shape, cheekbones, jawline)
- ✅ Feature details (eyes, nose, lips)

**Does NOT Modify**:
- ❌ Body type or proportions
- ❌ Posture or stance
- ❌ Mood or expression
- ❌ Camera or lighting
- ❌ Outfit or styling
- ❌ Background or scene

---

## Regional Options

### **1. ILOCOS** (Ilocos & Cordillera - Northern Luzon)
**Characteristics**:
- Skin: Slightly lighter tan with cool undertones
- Face: Slightly angular with defined bone structure
- Cheekbones: High and prominent with subtle angularity
- Eyes: Almond-shaped with slight epicanthic fold, deep-set
- Nose: Straight bridge with slightly broader base

**Cultural Context**: Northern highlands, cooler climate influence

---

### **2. TAGALOG** (Central Luzon & Metro Manila)
**Characteristics**:
- Skin: Medium golden tan with warm undertones
- Face: Balanced oval with harmonious proportions
- Cheekbones: Moderately high with soft roundness
- Eyes: Almond-shaped with warm expressive quality
- Nose: Refined bridge with softly rounded tip

**Cultural Context**: Central plains, urban centers, diverse mixing

---

### **3. BICOL** (Southeastern Luzon)
**Characteristics**:
- Skin: Warm golden tan with rich undertones
- Face: Heart-shaped with gentle taper
- Cheekbones: High and softly rounded with natural lift
- Eyes: Large expressive almond eyes with warm depth
- Nose: Delicate bridge with softly upturned tip

**Cultural Context**: Volcanic region, known for expressive beauty

---

### **4. VISAYAS** (Central Philippines)
**Characteristics**:
- Skin: Warm honey tan with golden undertones
- Face: Soft oval with balanced proportions
- Cheekbones: Moderately high with gentle roundness
- Eyes: Almond-shaped with warm inviting gaze, naturally bright
- Nose: Refined with soft bridge and rounded tip

**Cultural Context**: Island provinces, coastal influence, sun-kissed

---

### **5. MINDANAO** (Mindanao Lowland - Southern Philippines)
**Characteristics**:
- Skin: Rich golden tan with warm bronze undertones
- Face: Oval with soft contours and balanced proportions
- Cheekbones: Moderately high with gentle definition
- Eyes: Expressive almond eyes with warm depth and natural brightness
- Nose: Soft bridge with gently rounded tip

**Cultural Context**: Southern lowlands, tropical warmth

---

### **6. BANGSAMORO** (Southwestern Mindanao)
**Characteristics**:
- Skin: Deep golden tan with warm olive undertones
- Face: Oval with refined proportions and subtle angularity
- Cheekbones: High and defined with elegant structure
- Eyes: Almond-shaped with deep expressive gaze and natural intensity
- Nose: Refined bridge with elegant definition

**Cultural Context**: Southwestern region, distinct cultural heritage

---

## Merge Order

```
BASE (locked)
  ↓
POSTURE_FRAMING (locked)
  ↓
SC (scene)
  ↓
ET (ethnicity - PH)
  ↓
PH_REGION (NEW - optional, facial modifier only) ← Inserted here
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

**Key**: PH_REGION merges **after ET** and **before FA**

**Rationale**: 
- ET establishes base Filipina characteristics
- PH_REGION adds regional facial nuance
- FA applies archetype on top of regional base

---

## UI Behavior

### **Conditional Display**:
```
IF ethnicity == "PH" (Filipina):
  SHOW PH_REGION dropdown
ELSE:
  HIDE PH_REGION dropdown
```

### **Default Behavior**:
- If no region selected: Use neutral PH ethnicity (no regional modifier)
- If region selected: Apply regional facial nuance

### **UI Layout**:
```
┌─────────────────────────────────────────────┐
│  Avatar Builder                             │
├─────────────────────────────────────────────┤
│  Ethnicity:          [Dropdown: PH ▼]      │
│                                             │
│  ↓ Philippines Region (Optional):          │
│  [Dropdown: Tagalog ▼]                     │
│  (Only shown when Ethnicity = Filipina)    │
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
  --ethnicity PH \
  --hair ST \
  --scene BEACH \
  --outfit POCA \
  --negative NB
```

**Result**: Neutral Filipina with Soft Goddess archetype

---

### **With Visayas Regional Modifier**:
```bash
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity PH \
  --ph-region VISAYAS \
  --hair ST \
  --scene BEACH \
  --outfit POCA \
  --negative NB
```

**Result**: Visayan Filipina with Soft Goddess archetype
- Honey tan skin (regional nuance)
- Soft oval features (regional nuance)
- Warm inviting gaze (regional nuance)
- + Soft Goddess archetype characteristics

---

### **With Ilocos Regional Modifier**:
```bash
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity PH \
  --ph-region ILOCOS \
  --hair ST \
  --scene BEACH \
  --outfit POCA \
  --negative NB
```

**Result**: Ilocano Filipina with Soft Goddess archetype
- Slightly lighter tan (regional nuance)
- Angular features (regional nuance)
- High prominent cheekbones (regional nuance)
- + Soft Goddess archetype characteristics

---

## Canonical ID Format

### **Without Region**:
```
FA-SG-A__BT-FR__ET-PH__HR-ST__SC-BEACH__ST-POCA__v01__r01
```

### **With Region**:
```
FA-SG-A__BT-FR__ET-PH__PH_REGION-VISAYAS__HR-ST__SC-BEACH__ST-POCA__v01__r01
```

**Note**: PH_REGION appears after ET in canonical ID

---

## Architectural Safeguards

### **1. Scope Limitation**:
Every PH_REGION module explicitly states:
```json
"scope": "facial features and skin nuance only - does not affect body, posture, mood, camera, lighting, or outfit"
```

### **2. No Overrides**:
PH_REGION modules only ADD nuance, they don't override:
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
python3 -m src.cli build --face SG-A --body FR --ethnicity PH --hair ST --scene BEACH --outfit POCA --negative NB

# Tagalog variant
python3 -m src.cli build --face SG-A --body FR --ethnicity PH --ph-region TAGALOG --hair ST --scene BEACH --outfit POCA --negative NB

# Visayas variant
python3 -m src.cli build --face SG-A --body FR --ethnicity PH --ph-region VISAYAS --hair ST --scene BEACH --outfit POCA --negative NB
```

### **Expected Results**:
- ✅ All have identical posture, body, outfit, vibe
- ✅ Only facial features and skin tone vary
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
- [ ] No polka dots, dresses, or horror elements

---

## Phase 1.5 Status

### **Files Created**: 6 regional modules
- `components/ph_region/ILOCOS.json`
- `components/ph_region/TAGALOG.json`
- `components/ph_region/BICOL.json`
- `components/ph_region/VISAYAS.json`
- `components/ph_region/MINDANAO.json`
- `components/ph_region/BANGSAMORO.json`

### **Registry Updated**:
- Added PH_REGION dimension with 6 options
- Each with label, description, region, status

### **Documentation**:
- This file: `docs/PHASE_1_5_REGIONAL_MODIFIERS.md`

---

## Future Expansion

### **Phase 2+**: Regional modifiers for other ethnicities
- East Asian regions (e.g., Korean, Japanese, Chinese)
- Latina regions (e.g., Mexican, Colombian, Brazilian)
- Middle Eastern regions
- Northern European regions

**Same Pattern**:
- Optional dimension
- Facial features only
- Merge after ET, before FA
- Conditional UI display

---

## Success Criteria

**Phase 1.5 is successful if**:
- ✅ Regional variation adds realistic facial diversity
- ✅ No impact on Phase 1 locked architecture
- ✅ Body, posture, mood, camera, lighting unchanged
- ✅ UI conditionally shows PH_REGION only for Filipina
- ✅ Default (no region) still works correctly
- ✅ All regional builds pass regression tests

---

## Bottom Line

**Phase 1.5 adds surgical precision**:
- Realistic regional Filipina facial variation
- Zero impact on Phase 1 stability
- Optional and conditional
- Extensible pattern for future ethnicities

**The Phase 1 architecture remains rock-solid.**
