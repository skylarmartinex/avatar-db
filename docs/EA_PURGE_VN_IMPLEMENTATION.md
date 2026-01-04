# EA Purge & Vietnamese Ethnicity Implementation

## ✅ **COMPLETE: EA Removed, VN Implemented**

---

## 🗑️ **Step 1: Purged EA Prompts**

### **Deleted**:
- 10 saved prompts containing `__ET-EA__`
- All prompts with "East Asian" ethnicity removed from library

### **Verification**:
```bash
ls builds/prompts/ | grep "ET-EA"
# Result: 0 files found
```

**Status**: ✅ Zero EA prompts remain

---

## 🔧 **Step 2: Removed EA from Registry**

### **Before**:
```json
"ET": {
  "EA": {
    "label": "East Asian",
    "description": "Fair skin tones and East Asian features"
  }
}
```

### **After**:
```json
"ET": {
  "VN": {
    "label": "Vietnamese",
    "description": "Vietnamese features with warm golden to light tan skin tones",
    "tags": ["Southeast Asian", "Vietnamese", "warm"]
  }
}
```

**Status**: ✅ EA completely removed from registry

---

## 🇻🇳 **Step 3: Created Vietnamese Ethnicity Module**

### **File**: `components/ethnicity/VN.json`

### **Contents** (Detailed & Opinionated):

#### **Skin**:
- Tone: Warm golden tan to light tan
- Undertone: Warm with golden peachy notes
- Texture: Smooth with natural luminosity
- Finish: Healthy radiant glow (not matte)

#### **Facial Characteristics**:
- Face shape: Oval to heart-shaped with balanced proportions
- Cheekbones: Moderately high with soft definition
- Jawline: Softly contoured with feminine grace
- Eyes: Almond-shaped with warm expressive quality
- Nose: Refined bridge with softly defined tip
- Lips: Medium to full with natural softness

#### **Aesthetic Bias**:
- Overall: Refined, modern, naturally elegant
- Archetype: Sophisticated Southeast Asian beauty
- Cultural context: Contemporary Vietnamese with traditional grace
- Emphasis: Natural radiance, warm approachability, refined elegance, youthful vitality

#### **Hair Characteristics**:
- Color: Deep black to dark brown with warm undertones
- Texture: Naturally straight with silky quality
- Volume: Medium to thick with natural body
- Finish: Glossy with healthy shine

#### **Guardrails**:
- Avoid overly pale or cool-toned skin
- Avoid harsh angular features
- Maintain warm undertones
- Preserve natural elegance
- No exaggerated stylization

**Status**: ✅ Detailed Vietnamese module created

---

## 🎯 **Key Differences: EA vs VN**

### **EA (Removed)**:
- ❌ Generic "East Asian" label
- ❌ Vague "fair skin" description
- ❌ No cultural specificity
- ❌ No detailed characteristics

### **VN (New)**:
- ✅ Country-specific "Vietnamese" label
- ✅ Detailed skin tone range (warm golden to light tan)
- ✅ Cultural context (contemporary Vietnamese aesthetic)
- ✅ Comprehensive facial, skin, hair, and aesthetic specifications
- ✅ Guardrails to maintain authenticity

---

## 📊 **Impact**

### **Registry**:
- ❌ EA: Removed
- ✅ VN: Added with full details

### **Saved Prompts**:
- ❌ 10 EA prompts: Deleted
- ✅ 10 PH prompts: Retained
- ✅ 0 VN prompts: Ready to generate

### **UI**:
- ❌ "East Asian" will never appear
- ✅ "Vietnamese" will appear for ET=VN
- ✅ Registry-driven labels only

---

## 🚀 **Next Steps**

### **Generate Vietnamese Prompts**:

```bash
# Golden reference (Vietnamese + Beach)
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity VN \
  --hair ST \
  --scene BEACH \
  --outfit POCA \
  --negative NB \
  --version 01 \
  --revision 01

# With Northern Vietnam regional modifier
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity VN \
  --vn-region NORTHERN \
  --hair ST \
  --scene BEACH \
  --outfit POCA \
  --negative NB \
  --version 01 \
  --revision 01

# With Southern Vietnam regional modifier
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity VN \
  --vn-region SOUTHERN \
  --hair ST \
  --scene JUNGLE \
  --outfit POCA \
  --negative NB \
  --version 01 \
  --revision 01
```

### **Expected Results**:
- Canonical ID: `FA-SG-A__BT-FR__ET-VN__HR-ST__SC-BEACH__ST-POCA__v01__r01`
- Merged JSON includes VN ethnicity module content
- Skin: "warm golden tan to light tan"
- Ethnicity: "Vietnamese"
- No "East Asian" anywhere

---

## ✅ **Validation**

### **Registry Check**:
```bash
grep -i "east asian" registry/codes.json
# Expected: No results
```

### **Prompts Check**:
```bash
ls builds/prompts/ | grep "ET-EA"
# Expected: No results
```

### **VN Module Check**:
```bash
cat components/ethnicity/VN.json | grep "ethnicity"
# Expected: "ethnicity": "Vietnamese"
```

---

## 📝 **Summary**

**EA Status**: ✅ **PURGED**
- Removed from registry
- Removed from saved prompts
- Will never appear in UI

**VN Status**: ✅ **IMPLEMENTED**
- Added to registry with proper label
- Detailed ethnicity module created
- Ready for prompt generation
- Compatible with VN_REGION modifiers

**Result**: Clean, country-specific Vietnamese ethnicity with no EA legacy.

---

## 🎉 **Bottom Line**

- ❌ **EA is gone** - completely removed, not aliased
- ✅ **VN is real** - detailed, opinionated, Vietnamese-specific
- ✅ **Clean slate** - ready for Phase 1.5 regional modifiers
- ✅ **No legacy** - no generic "East Asian" content

**Vietnamese ethnicity is now properly implemented as a first-class citizen.**
