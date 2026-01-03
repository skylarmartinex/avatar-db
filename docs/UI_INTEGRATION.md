# Avatar-DB UI Integration Guide

## Quick Reference for Dropdown Population

### Face Archetypes (FA)
```javascript
// All face modules follow pattern: {ARCHETYPE}-PH-{VARIANT}
// Use registry.FA for full metadata including labels, descriptions, status

const faceArchetypes = [
  { code: 'SG-PH-A', label: 'Soft Goddess — Filipina (A)', status: 'winner' },
  { code: 'SG-PH-B', label: 'Soft Goddess — Filipina (B)', status: 'active' },
  { code: 'MB-PH-A', label: 'Modern Bombshell — Filipina (A)', status: 'winner' },
  { code: 'MB-PH-B', label: 'Modern Bombshell — Filipina (B)', status: 'active' },
  { code: 'EM-PH-A', label: 'Editorial Model — Filipina (A)', status: 'winner' },
  { code: 'EM-PH-B', label: 'Editorial Model — Filipina (B)', status: 'active' },
  { code: 'RS-PH-A', label: 'Romantic Sweet — Filipina (A)', status: 'winner' },
  { code: 'RS-PH-B', label: 'Romantic Sweet — Filipina (B)', status: 'active' },
  { code: 'FD-PH-A', label: 'Fitness Defined — Filipina (A)', status: 'winner' },
  { code: 'FD-PH-B', label: 'Fitness Defined — Filipina (B)', status: 'active' },
];

// Suggested UI: Group by archetype, mark winners with ⭐
```

### Body Types (BT)
```javascript
const bodyTypes = [
  { code: 'FR', label: 'Fitness Ripped', short: 'Ripped' },
  { code: 'AL', label: 'Athletic Lean', short: 'Athletic' },
  { code: 'CF', label: 'Curvy Fit', short: 'Curvy Fit' },
  { code: 'SM', label: 'Slender Model', short: 'Slender' },
  { code: 'SC', label: 'Soft Curvy', short: 'Soft Curvy' },
];

// Suggested UI: Show short_label in dropdown, full label on hover
```

### Ethnicities (ET)
```javascript
const ethnicities = [
  { code: 'PH', label: 'Filipina Heritage', short: 'Filipina' },
  { code: 'EA', label: 'East Asian', short: 'East Asian' },
  { code: 'LA', label: 'Latina', short: 'Latina' },
  { code: 'ME', label: 'Middle Eastern', short: 'Middle Eastern' },
  { code: 'NE', label: 'Northern European', short: 'Northern European' },
];
```

### Hair Styles (HR)
```javascript
const hairStyles = [
  { code: 'ST', label: 'Straight Hair', short: 'Straight' },
  { code: 'WV', label: 'Soft Waves', short: 'Waves' },
  { code: 'PK', label: 'Ponytail', short: 'Ponytail' },
];
```

### Scenes (SC)
```javascript
const scenes = [
  { code: 'DOOR', label: 'Doorway Editorial', short: 'Doorway', tags: ['editorial', 'urban'] },
  { code: 'BEACH', label: 'Tropical Beach', short: 'Beach', tags: ['tropical', 'outdoor'] },
  { code: 'JUNGLE', label: 'Tropical Jungle', short: 'Jungle', tags: ['nature', 'tropical'] },
];

// Suggested UI: Show tags as badges/chips
```

### Outfits (ST)
```javascript
const outfits = [
  { code: 'POCA', label: 'Pocahontas-Inspired Tribal Bikini', short: 'Tribal Bikini' },
  { code: 'SPORT', label: 'Athletic Sportswear', short: 'Sportswear' },
  { code: 'STREET', label: 'Casual Streetwear', short: 'Streetwear' },
  { code: 'RESORT', label: 'Elegant Resort Wear', short: 'Resort' },
  { code: 'ACTIVE', label: 'Performance Activewear', short: 'Activewear' },
];
```

---

## Pack Integration

### Subject Packs (SUB)
```javascript
// Pattern: SUB-{FA_ARCHETYPE}{VARIANT}_{BT}_{HR}
const subjectPacks = [
  'SUB-SGPH_A_FR_ST',   // Soft Goddess A + Ripped + Straight
  'SUB-SGPH_B_AL_WV',   // Soft Goddess B + Athletic + Waves
  'SUB-SGPH_A_CF_WV',   // Soft Goddess A + Curvy Fit + Waves
  'SUB-MBPH_A_FR_ST',   // Modern Bombshell A + Ripped + Straight
  'SUB-MBPH_B_CF_WV',   // Modern Bombshell B + Curvy Fit + Waves
  'SUB-EMPH_A_SM_ST',   // Editorial Model A + Slender + Straight
  'SUB-EMPH_B_AL_PK',   // Editorial Model B + Athletic + Ponytail
  'SUB-RSPH_A_SC_WV',   // Romantic Sweet A + Soft Curvy + Waves
  'SUB-RSPH_B_CF_ST',   // Romantic Sweet B + Curvy Fit + Straight
  'SUB-FDPH_A_FR_PK',   // Fitness Defined A + Ripped + Ponytail
  'SUB-FDPH_B_AL_ST',   // Fitness Defined B + Athletic + Straight
];

// Load pack JSON to get: { FA, BT, ET, HR }
```

### Style Packs (STY)
```javascript
// Pattern: STY-{SC}_{ST}
const stylePacks = [
  'STY-DOOR_POCA_GOLD', // Doorway + Tribal Bikini (legacy)
  'STY-DOOR_SPORT',     // Doorway + Sportswear
  'STY-DOOR_STREET',    // Doorway + Streetwear
  'STY-DOOR_RESORT',    // Doorway + Resort
  'STY-DOOR_ACTIVE',    // Doorway + Activewear
  'STY-BEACH_POCA',     // Beach + Tribal Bikini
  'STY-BEACH_RESORT',   // Beach + Resort
  'STY-BEACH_ACTIVE',   // Beach + Activewear
  'STY-JUNGLE_POCA',    // Jungle + Tribal Bikini
  'STY-JUNGLE_ACTIVE',  // Jungle + Activewear
  'STY-JUNGLE_STREET',  // Jungle + Streetwear
];

// Load pack JSON to get: { SC, ST }
```

---

## UI Recommendations

### 1. Module Selection Mode
```
┌─────────────────────────────────────┐
│ Face Archetype                    ▼ │
│ ⭐ Soft Goddess A (winner)          │
│    Soft Goddess B                   │
│ ⭐ Modern Bombshell A (winner)      │
│    Modern Bombshell B               │
│ ⭐ Editorial Model A (winner)       │
│    Editorial Model B                │
│ ⭐ Romantic Sweet A (winner)        │
│    Romantic Sweet B                 │
│ ⭐ Fitness Defined A (winner)       │
│    Fitness Defined B                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Body Type                         ▼ │
│ Fitness Ripped                      │
│ Athletic Lean                       │
│ Curvy Fit                           │
│ Slender Model                       │
│ Soft Curvy                          │
└─────────────────────────────────────┘

[Continue for ET, HR, SC, ST...]
```

### 2. Pack Selection Mode
```
┌─────────────────────────────────────┐
│ Subject Pack                      ▼ │
│ Soft Goddess A + Ripped + Straight  │
│ Soft Goddess B + Athletic + Waves   │
│ Modern Bombshell A + Ripped + St... │
│ Editorial Model A + Slender + St... │
│ [...]                               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Style Pack                        ▼ │
│ Doorway + Sportswear                │
│ Beach + Resort                      │
│ Jungle + Activewear                 │
│ [...]                               │
└─────────────────────────────────────┘
```

### 3. Visual Indicators
- **Winners**: ⭐ or badge
- **Tags**: Small chips/badges (e.g., `athletic` `curvy`)
- **Descriptions**: Tooltip on hover
- **Preview**: Optional thumbnail if available

---

## Data Loading Example

```typescript
// Load registry
import registry from '../registry/codes.json';

// Get all face codes with metadata
const faceOptions = Object.entries(registry.FA).map(([code, meta]) => ({
  value: code,
  label: meta.label,
  shortLabel: meta.short_label,
  description: meta.description,
  status: meta.status,
  archetype: meta.archetype,
  ethnicity: meta.ethnicity,
}));

// Filter winners only
const winnerFaces = faceOptions.filter(f => f.status === 'winner');

// Group by archetype
const facesByArchetype = faceOptions.reduce((acc, face) => {
  const arch = face.archetype;
  if (!acc[arch]) acc[arch] = [];
  acc[arch].push(face);
  return acc;
}, {});
```

---

## Validation

All modules are lint-validated and follow strict schema:
- ✅ Boundary enforcement (FA/BT/HR → subject.*, ET → subject.* + skin.*, etc.)
- ✅ Required keys (face_anchor, do_not_change for FA)
- ✅ No prohibited cross-dimension writes
- ✅ Valid JSON structure

Use `python3 -m src.cli lint` to validate after any changes.

---

## CLI Commands for Testing

```bash
# List all codes for a dimension
python3 -m src.cli list FA
python3 -m src.cli list BT
python3 -m src.cli list ST

# Build with modules
python3 -m src.cli build \
  --FA EM-PH-A \
  --BT SM \
  --ET PH \
  --HR ST \
  --SC BEACH \
  --ST RESORT \
  --v 01 \
  --r 01

# Build with packs
python3 -m src.cli build-pack \
  --SUB SUB-EMPH_A_SM_ST \
  --STY STY-BEACH_RESORT \
  --v 01 \
  --r 01
```

---

**Last Updated**: 2026-01-03
**Total Modules**: 32 components + 22 packs
**Lint Status**: ✅ PASSING
