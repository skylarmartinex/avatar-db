# Golden Reference - Phase 1 Baseline

## Purpose
This is the **golden reference** for Phase 1 output fidelity. Use this to verify that builds produce consistent, high-quality editorial results without drift.

---

## Golden Configuration

### **Preset Name**: `GOLDEN_BEACH_SG_FR_PH`

### **Module Selection**:
```json
{
  "BASE": "BASE",
  "POSTURE_FRAMING": "POSTURE_FRAMING",
  "FA": "SG-A",
  "BT": "FR",
  "ET": "PH",
  "HR": "ST",
  "SC": "BEACH",
  "ST": "POCA",
  "NB": "NB",
  "v": "01",
  "r": "01"
}
```

### **Canonical ID**:
```
FA-SG-A__BT-FR__ET-PH__HR-ST__SC-BEACH__ST-POCA__v01__r01
```

---

## Expected Output Characteristics

### **Visual Vibe** (Must Match):
✅ **Confident, calm, magnetic** editorial presence  
✅ **Upright, grounded stance** with weight on one hip  
✅ **Centered subject** with vertical framing  
✅ **High-contrast lighting** from camera-left  
✅ **Warm golden tones** throughout  
✅ **Clean silhouette** - subject separated from background  

### **Face** (Soft Goddess A):
✅ Soft oval-to-heart face shape  
✅ Large almond-shaped eyes with calm expression  
✅ High, softly rounded cheekbones  
✅ Full lips with defined cupid's bow  
✅ **Never**: Fearful, scared, or exaggerated expression  

### **Body** (Fitness Ripped):
✅ Extremely lean, stage-ready physique  
✅ Deeply defined six-pack abs  
✅ Clear muscle separation in shoulders/arms  
✅ Razor-thin waist with strong contrast  
✅ **Never**: Bulky or soft/undefined  

### **Ethnicity** (Filipina):
✅ Golden tan skin with warm undertone  
✅ Smooth, luminous texture  
✅ Natural elegance and warmth  

### **Hair** (Straight):
✅ Mostly straight, smooth hair  
✅ Natural body and gloss  

### **Background** (Beach):
✅ Clean, minimal, editorial beach  
✅ Soft sand, distant ocean, low horizon  
✅ Background visually secondary  
✅ **Never**: Props, walking poses, wide scenic emphasis  

### **Outfit** (Pocahontas Tribal Bikini):
✅ Leather-inspired tribal fashion bikini  
✅ Fringe accents and subtle beadwork  
✅ Earth-toned, minimal coverage  
✅ **Never**: Dresses, polka dots, modern casual, costumes  

---

## Negative Prompt Enforcement

### **Must NOT Appear**:
❌ Horror or scared expression  
❌ Costumes or theatrical clothing  
❌ Dresses or full coverage  
❌ **Polka dots** or polka dot patterns  
❌ Haunted or dark vibes  
❌ Cartoon or anime style  
❌ Bad anatomy or deformed features  
❌ Running, walking, or lounging poses  
❌ Cluttered or busy background  
❌ Props in hands  

---

## Regression Test Checklist

### **Build the Golden Reference**:
```bash
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity PH \
  --hair ST \
  --scene BEACH \
  --outfit POCA \
  --negative NB \
  --version 01 \
  --revision 01
```

### **Visual Inspection Checklist**:

#### **1. Posture & Framing** ✓
- [ ] Subject is upright and centered
- [ ] Vertical framing emphasis
- [ ] Weight shifted to one hip
- [ ] No running, walking, or lounging
- [ ] Clean body outline

#### **2. Expression & Mood** ✓
- [ ] Calm, confident expression
- [ ] No fear, horror, or surprise
- [ ] Magnetic, editorial presence
- [ ] Warm, inviting energy

#### **3. Lighting & Quality** ✓
- [ ] High contrast from camera-left
- [ ] Warm golden tones
- [ ] Ultra-high resolution
- [ ] Extreme clarity on face/torso
- [ ] Luxury editorial aesthetic

#### **4. Body Definition** ✓
- [ ] Deeply defined abs visible
- [ ] Clear muscle separation
- [ ] Razor-thin waist
- [ ] Strong waist-to-hip contrast
- [ ] Not bulky or soft

#### **5. Face Features** ✓
- [ ] Soft oval-to-heart face shape
- [ ] Large almond eyes
- [ ] High, rounded cheekbones
- [ ] Full lips with cupid's bow
- [ ] Calm, serene expression

#### **6. Outfit Accuracy** ✓
- [ ] Tribal bikini (NOT a dress)
- [ ] Leather-inspired textures
- [ ] Fringe and beadwork visible
- [ ] **NO polka dots**
- [ ] **NO costume elements**
- [ ] Minimal coverage, editorial

#### **7. Background Control** ✓
- [ ] Beach is clean and minimal
- [ ] Background visually secondary
- [ ] Subject clearly separated
- [ ] No props or clutter
- [ ] No wide scenic emphasis

#### **8. Negative Enforcement** ✓
- [ ] No horror vibes
- [ ] No scared expression
- [ ] No dresses
- [ ] **No polka dots**
- [ ] No cartoon style
- [ ] No bad anatomy
- [ ] No exaggerated motion

---

## Jungle Variant Test

### **Configuration**:
Same as above, but change:
- `SC`: `BEACH` → `JUNGLE`

### **Expected Difference**:
- Background changes to lush tropical jungle
- **Everything else identical**: posture, expression, outfit, vibe

### **Jungle-Specific Checks**:
- [ ] Dense greenery visible
- [ ] Filtered sunlight
- [ ] No chaotic foliage crossing body
- [ ] No survival or crouching poses
- [ ] Subject still clearly separated

---

## Failure Modes to Watch For

### **Common Drift Patterns**:
1. **Polka Dot Dress**: If outfit becomes a polka dot dress → FAIL
2. **Horror Expression**: If face shows fear/terror → FAIL
3. **Costume Look**: If outfit becomes theatrical → FAIL
4. **Soft Body**: If abs disappear or body softens → FAIL
5. **Walking Pose**: If subject appears to be walking → FAIL
6. **Cluttered BG**: If background becomes busy → FAIL
7. **Cartoon Style**: If image becomes illustrated → FAIL
8. **Bad Anatomy**: If hands/fingers are malformed → FAIL

---

## Version Control

### **Golden Reference Version**: `v01-r01`
**Date Created**: 2026-01-03  
**Status**: ✅ Baseline Established  

### **Change Log**:
- `v01-r01`: Initial golden reference with Phase 1 locked base

---

## Automated Check (Future)

### **Proposed Script** (`scripts/regression_test.sh`):
```bash
#!/bin/bash
# Regression test for golden reference

echo "Building golden reference..."
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity PH \
  --hair ST \
  --scene BEACH \
  --outfit POCA \
  --negative NB \
  --version 01 \
  --revision 01

echo "Checking output..."
OUTPUT_FILE="builds/prompts/FA-SG-A__BT-FR__ET-PH__HR-ST__SC-BEACH__ST-POCA__v01__r01.json"

if [ ! -f "$OUTPUT_FILE" ]; then
  echo "❌ FAIL: Output file not created"
  exit 1
fi

# Check for banned terms in output
BANNED_TERMS=("polka dot" "dress" "costume" "horror" "scared" "cartoon")
for term in "${BANNED_TERMS[@]}"; do
  if grep -qi "$term" "$OUTPUT_FILE"; then
    echo "❌ FAIL: Banned term '$term' found in output"
    exit 1
  fi
done

echo "✅ PASS: Golden reference build successful"
```

---

## Usage

### **Before Major Changes**:
1. Build golden reference
2. Save output for comparison
3. Make changes
4. Rebuild golden reference
5. Compare outputs visually
6. Verify checklist items match

### **After Module Updates**:
1. Rebuild golden reference
2. Run through checklist
3. Verify no drift occurred
4. Document any intentional changes

---

## Success Criteria

**Golden reference is valid if**:
- ✅ All checklist items pass
- ✅ No banned terms in output
- ✅ Visual vibe matches original reference
- ✅ Beach and Jungle variants differ only in background
- ✅ No polka dots, dresses, or horror elements
- ✅ Confident editorial stance maintained

**If any item fails**: Investigate module drift and fix before proceeding.
