# Prompts Page Data Issue - Analysis & Solution

## 🔍 **Root Cause Analysis**

### **What's Happening**:
The Prompts page UI is **working correctly** - it's displaying what's actually in the saved prompt files.

The issue is that **the saved prompts are using old deprecated codes** from before Phase 1.

---

## 📊 **Current Saved Prompts**

### **Filenames** (Old Format):
```
FA-SG-PH-A__BT-FR__ET-PH__HR-ST__SC-DOOR__ST-POCA__v01.json
FA-SG-PH-A__BT-AL__ET-EA__HR-ST__SC-DOOR__ST-POCA__v01.json
FA-MB-PH-A__BT-AL__ET-EA__HR-ST__SC-DOOR__ST-POCA__v01.json
```

### **Issues**:
1. ❌ **FA codes**: `SG-PH-A`, `MB-PH-A` (deprecated - includes ethnicity)
2. ❌ **ET codes**: Mix of `EA` (East Asian - too generic) and `PH` (Filipina)
3. ❌ **SC codes**: `DOOR` (deprecated doorway scene)
4. ❌ **Content**: Contains "white polka dot sundress" (the polka dot problem!)

---

## 🎯 **Phase 1 New Format**

### **Should Be**:
```
FA-SG-A__BT-FR__ET-PH__HR-ST__SC-BEACH__ST-POCA__v01__r01.json
```

### **Changes**:
1. ✅ **FA**: `SG-A` (ethnicity-neutral)
2. ✅ **ET**: `PH` (country-specific)
3. ✅ **SC**: `BEACH` or `JUNGLE` (Phase 1 approved)
4. ✅ **Content**: Tribal bikini (no polka dots!)
5. ✅ **BASE**: Includes locked foundation
6. ✅ **POSTURE_FRAMING**: Includes locked posture
7. ✅ **NB**: Includes comprehensive negative prompt

---

## 🔧 **Why UI Shows Old Data**

### **Ethnicity Shows "East Asian"**:
- **Reason**: Files contain `ET-EA` in canonical ID
- **Registry correctly maps**: `EA` → "East Asian"
- **UI is doing the right thing**

### **Face Archetype Shows Deprecated Labels**:
- **Reason**: Files contain `FA-SG-PH-A` in canonical ID
- **Registry correctly maps**: `SG-PH-A` → "Soft Goddess — Filipina (A)" (deprecated)
- **UI is doing the right thing**

### **Polka Dots Appear**:
- **Reason**: Old prompts don't have comprehensive negative prompt
- **Content**: `"clothing": "white polka dot sundress"`
- **Phase 1 NB.json would prevent this**

---

## ✅ **Solution: Generate New Prompts**

### **Option 1: Generate Fresh Prompts** (Recommended)

Use the Phase 1 CLI to generate new prompts:

```bash
# Golden reference (Beach)
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

# Jungle variant
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity PH \
  --hair ST \
  --scene JUNGLE \
  --outfit POCA \
  --negative NB \
  --version 01 \
  --revision 01

# With regional modifier
python3 -m src.cli build \
  --face SG-A \
  --body FR \
  --ethnicity PH \
  --ph-region VISAYAS \
  --hair ST \
  --scene BEACH \
  --outfit POCA \
  --negative NB \
  --version 01 \
  --revision 01
```

**Result**:
- ✅ Uses new FA codes (`SG-A`, not `SG-PH-A`)
- ✅ Uses country-specific ET (`PH`, `VN`, not `EA`)
- ✅ Uses Phase 1 scenes (`BEACH`, `JUNGLE`, not `DOOR`)
- ✅ Includes BASE and POSTURE_FRAMING
- ✅ Includes comprehensive NB (no polka dots!)

---

### **Option 2: Migrate Old Prompts** (Complex)

Create a migration script to:
1. Parse old canonical IDs
2. Map deprecated codes to new codes:
   - `SG-PH-A` → `SG-A` + `ET-PH`
   - `MB-PH-A` → `MB-A` + `ET-PH`
   - `EA` → `PH` or `VN` (requires manual decision)
   - `DOOR` → `BEACH` or `JUNGLE`
3. Rebuild prompts with Phase 1 architecture
4. Save with new canonical IDs

**Not recommended**: Complex, error-prone, old prompts don't have Phase 1 benefits

---

### **Option 3: Display Override** (Temporary Band-Aid)

Add UI mapping for old codes:
```typescript
const legacyCodeMap = {
  'SG-PH-A': 'SG-A',
  'MB-PH-A': 'MB-A',
  'EA': 'PH', // Assume East Asian = Filipina for now
  'DOOR': 'Beach'
};
```

**Not recommended**: Doesn't fix underlying data, doesn't add Phase 1 benefits

---

## 📋 **Recommended Action Plan**

### **Immediate** (Today):
1. ✅ Keep existing old prompts as historical reference
2. ✅ Generate 5-10 new prompts with Phase 1 architecture
3. ✅ Verify new prompts show correct labels in UI
4. ✅ Verify new prompts have no polka dots

### **Short-term** (This Week):
1. Generate comprehensive prompt library with Phase 1:
   - All face archetypes (SG-A, SG-B, MB-A, MB-B, etc.)
   - All body types (FR, AL, CF, SM, SC)
   - All ethnicities (PH, VN, KR, JP, LA, etc.)
   - Both scenes (BEACH, JUNGLE)
   - With and without regional modifiers

2. Archive old prompts:
   ```bash
   mkdir builds/prompts_archive_pre_phase1
   mv builds/prompts/FA-*-PH-* builds/prompts_archive_pre_phase1/
   ```

### **Long-term** (Future):
1. Add more Phase 1 approved scenes (Studio, Urban, etc.)
2. Add more outfits (Sport, Street, Resort, Active)
3. Expand regional modifiers to other ethnicities

---

## 🎯 **Expected Results After Generating New Prompts**

### **Prompts Page Will Show**:

**Ethnicity Column**:
- Filipina (not East Asian)
- Vietnamese
- Korean
- Japanese

**Face Archetype Column**:
- Soft Goddess (A)
- Soft Goddess (B)
- Modern Bombshell (A)
- Editorial Model (A)

**Body Type Column**:
- Fitness Ripped
- Athletic Lean
- Curvy Fit

**Background Column**:
- Tropical Beach (Editorial)
- Tropical Jungle (Editorial)

**Outfit Column**:
- Tribal Bikini (Pocahontas-Inspired)

**Version Column**:
- v01

---

## ✅ **Verification Checklist**

After generating new prompts:

- [ ] Filename format: `FA-SG-A__BT-FR__ET-PH__HR-ST__SC-BEACH__ST-POCA__v01__r01.json`
- [ ] Contains BASE module (locked foundation)
- [ ] Contains POSTURE_FRAMING module (locked posture)
- [ ] Contains comprehensive NB module (no polka dots!)
- [ ] Ethnicity shows as "Filipina" (not "East Asian")
- [ ] Face shows as "Soft Goddess (A)" (not "Soft Goddess — Filipina (A)")
- [ ] Background shows as "Tropical Beach" (not "Doorway Editorial")
- [ ] NO polka dots in clothing field
- [ ] Outfit is tribal bikini

---

## 📝 **Bottom Line**

**The UI is working correctly.**

**The data (saved prompts) is old and uses deprecated codes.**

**Solution**: Generate new prompts with Phase 1 architecture.

**Benefit**: New prompts will have:
- ✅ Correct labels
- ✅ No polka dots
- ✅ Locked editorial vibe
- ✅ Controlled posture
- ✅ Safe backgrounds
- ✅ Production-reliable output
