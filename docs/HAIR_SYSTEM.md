# Women's Hair System Documentation

## Overview

The Avatar-DB now includes a comprehensive **women's hair system** that provides first-class, modular control over hair styling—similar in rigor to how we locked physique consistency. This system prevents model improvisation and ensures consistent hair identity across generations.

## Key Features

- ✅ **8 Curated Presets** - Professional hair styles from Classic Bombshell to Protective Royalty
- ✅ **Granular Control** - Texture, length, style mode, part, bangs, finish, color, and highlights
- ✅ **Consistency Guards** - Built-in constraints to prevent identity drift
- ✅ **Backward Compatible** - Existing JSONs without hair fields continue to work
- ✅ **Enum-Based** - No model improvisation; all options are predefined tokens

---

## Hair Object Schema

The hair system adds a new `hair` object under `subject` with the following fields:

```json
{
  "subject": {
    "hair": {
      "enabled": true,
      "gender_presentation": "female",
      "preset": "Sleek Power Woman",
      "texture": "Pin-straight, glass-smooth",
      "length": "Medium",
      "style_mode": "Down",
      "part": "Center part",
      "bangs": "None",
      "finish": "High-shine editorial",
      "color": "Deep brunette",
      "highlights": null,
      "constraints": [
        "No flyaways",
        "Razor-sharp edges",
        "Consistent hair identity across shots"
      ]
    }
  }
}
```

### Field Definitions

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Whether to render hair clause |
| `gender_presentation` | string | `"female"` | Used for phrasing (doesn't override subject) |
| `preset` | enum string | `"Minimal Chic"` | Primary identity control (see presets below) |
| `texture` | enum string | Auto from preset | Strand behavior tokens |
| `length` | enum string | - | Geometry tier |
| `style_mode` | enum string | `"Down"` | How it's worn |
| `part` | enum string | - | Center/side/no part |
| `bangs` | enum string | `"None"` | Bang style |
| `finish` | enum string | - | Polish/realism state |
| `color` | string | - | Human-readable color |
| `highlights` | string | `null` | Optional highlights |
| `constraints` | array of strings | `[]` | Negative rules |

---

## Hair Presets

### 1. Classic Bombshell
**Vibe:** Voluminous, glamorous, timeless Hollywood
- **Default Texture:** Loose beach waves
- **Typical Length:** Long
- **Example:** Honey blonde with sun-kissed highlights, fresh salon blowout

### 2. Sleek Power Woman
**Vibe:** Sharp, polished, executive confidence
- **Default Texture:** Pin-straight, glass-smooth
- **Typical Length:** Medium (bob/lob)
- **Example:** Deep brunette, high-shine editorial, razor-sharp edges

### 3. Natural Curl Queen
**Vibe:** Authentic, voluminous, celebration of natural texture
- **Default Texture:** Spiral curls (3B–3C)
- **Typical Length:** Long
- **Example:** Defined ringlets, matte natural finish, soft volume

### 4. Protective Royalty
**Vibe:** Regal, protective styling, cultural pride
- **Default Texture:** None (texture optional for braids/locs)
- **Typical Length:** Long
- **Example:** Knotless box braids, neat scalp sections, soft sheen

### 5. Soft Girl Aesthetic
**Vibe:** Effortless, romantic, approachable
- **Default Texture:** Loose beach waves
- **Typical Length:** Medium
- **Example:** Curtain bangs, half-up style, day-two texture

### 6. Editorial Wet Look
**Vibe:** High-fashion, dramatic, runway-ready
- **Default Texture:** Wet-look strands
- **Typical Length:** Long
- **Example:** Slick-back ponytail, high-shine editorial, sleek to scalp

### 7. Playful Youth
**Vibe:** Energetic, bouncy, youthful movement
- **Default Texture:** Loose beach waves
- **Typical Length:** Medium
- **Example:** High ponytail, wind-swept natural, sun-kissed highlights

### 8. Minimal Chic
**Vibe:** Clean, precise, understated elegance
- **Default Texture:** Pin-straight, glass-smooth
- **Typical Length:** Short
- **Example:** Side part, matte natural, no volume

---

## Enums Reference

### Texture Options
- `"Pin-straight, glass-smooth"`
- `"Loose beach waves"`
- `"Defined curls (2C–3A)"`
- `"Spiral curls (3B–3C)"`
- `"Coily curls (4A–4B)"`
- `"Tight coils (4C)"`
- `"Natural frizz volume"`
- `"Wet-look strands"`

### Length Options
- `"Ultra-short"`
- `"Short"`
- `"Medium"`
- `"Long"`
- `"Extra-long"`

### Style Mode Options
- `"Down"`
- `"Half-up"`
- `"High ponytail"`
- `"Low ponytail"`
- `"Slick-back ponytail"`
- `"Low bun"`
- `"High bun"`
- `"Braids"`
- `"Twists"`
- `"Locs"`
- `"Updo"`

### Part Options
- `"Center part"`
- `"Side part"`
- `"No visible part"`

### Bangs Options
- `"None"`
- `"Curtain bangs"`
- `"Blunt bangs"`
- `"Side-swept bangs"`
- `"Baby bangs"`

### Finish Options
- `"Fresh salon blowout"`
- `"Day-two texture"`
- `"Post-workout"`
- `"Night-out glam"`
- `"Wind-swept natural"`
- `"Rain-damp realism"`
- `"Matte natural"`
- `"Soft sheen"`
- `"High-shine editorial"`

---

## Usage Examples

### Building with CLI

```bash
# Use the Sleek Power Woman preset
python -m src.cli build \
  --FA SG-PH-A \
  --BT FR \
  --ET PH \
  --HR SLEEK_POWER_WOMAN \
  --SC DOOR \
  --ST POCA \
  --v 01 \
  --r 01

# Use the Natural Curl Queen preset
python -m src.cli build \
  --FA SG-PH-A \
  --BT FR \
  --ET PH \
  --HR NATURAL_CURL_QUEEN \
  --SC DOOR \
  --ST POCA \
  --v 01 \
  --r 01
```

### Component Files

Hair presets are stored in `/components/hair/`:
- `GOLD.json` - Original gold standard (backward compatible)
- `CLASSIC_BOMBSHELL.json`
- `SLEEK_POWER_WOMAN.json`
- `NATURAL_CURL_QUEEN.json`
- `PROTECTIVE_ROYALTY.json`
- `SOFT_GIRL_AESTHETIC.json`
- `EDITORIAL_WET_LOOK.json`
- `PLAYFUL_YOUTH.json`
- `MINIMAL_CHIC.json`

### Registry Codes

All hair codes are registered in `/registry/codes.json` under the `HAIR` dimension.

---

## Prompt Rendering

The hair system includes a dedicated renderer (`src/hair_renderer.py`) that converts structured hair data into natural-language prompts.

### Rendering Rules

1. **Order:** preset → length → texture → style_mode → part/bangs → finish → color/highlights → constraints
2. **Assertive phrasing:** Uses direct language, avoids hedging
3. **Consistency guard:** Automatically includes "consistent hair identity across shots"
4. **Compact output:** High-signal, minimal fluff

### Example Outputs

**Sleek Power Woman:**
```
Hair: Sleek Power Woman, medium length, pin-straight, glass-smooth, sharp center part, high-shine editorial finish, deep brunette; consistent hair identity across shots; no flyaways; razor-sharp edges.
```

**Natural Curl Queen:**
```
Hair: Natural Curl Queen, long, spiral curls (3b–3c), soft volume, matte natural finish; consistent hair identity across shots; curls remain defined.
```

**Protective Royalty:**
```
Hair: Protective Royalty, long, braids, neat scalp sections, soft sheen finish, jet black; consistent hair identity across shots; braids remain uniform; knotless box braids.
```

---

## Backward Compatibility

### Legacy Format Support

The system maintains full backward compatibility with the original simple hair format:

```json
{
  "subject": {
    "hair": {
      "color": "Deep black",
      "length": "Long",
      "style": "Thick, glossy hair worn loose with subtle natural texture"
    }
  }
}
```

This will continue to work and render as:
```
Hair: deep black, long hair, thick, glossy hair worn loose with subtle natural texture.
```

### Migration Path

To migrate from legacy to new format:
1. Choose a preset that matches the desired aesthetic
2. Set specific fields (texture, length, style_mode, etc.)
3. Add constraints for consistency

---

## Testing

Run the test fixtures to see example outputs:

```bash
python3 -m tests.test_hair_fixtures
```

This will display:
- Input JSON for each example
- Rendered natural-language output
- Expected output for comparison

---

## Best Practices

### 1. Start with a Preset
Always choose a preset first—it sets the foundation and provides sensible defaults.

### 2. Use Constraints
Add constraints to prevent unwanted variations:
- `"No flyaways"`
- `"No hair covering eyes"`
- `"Curls remain defined"`
- `"Braids remain uniform"`

### 3. Be Specific with Color
Use descriptive, human-readable colors:
- ✅ `"Deep brunette"`, `"Honey blonde"`, `"Jet black"`
- ❌ `"Brown"`, `"Blonde"`, `"Black"`

### 4. Match Finish to Context
- **Editorial shoots:** `"High-shine editorial"`, `"Fresh salon blowout"`
- **Natural/lifestyle:** `"Matte natural"`, `"Day-two texture"`, `"Wind-swept natural"`
- **Athletic:** `"Post-workout"`, `"Slick-back ponytail"`

### 5. Texture Matters for Curls
For curly/coily hair, be specific about curl pattern:
- `"Defined curls (2C–3A)"` - Loose waves to loose curls
- `"Spiral curls (3B–3C)"` - Defined ringlets
- `"Coily curls (4A–4B)"` - Tight coils with definition
- `"Tight coils (4C)"` - Dense, zig-zag pattern

---

## Troubleshooting

### Hair not rendering?
- Check that `enabled` is `true` (or omitted, defaults to `true`)
- Verify the hair component file exists in `/components/hair/`
- Ensure the code is registered in `/registry/codes.json`

### Inconsistent results?
- Add more specific constraints
- Use enum values exactly as documented (case-sensitive)
- Ensure texture matches the preset aesthetic

### Want to create a custom preset?
1. Create a new JSON file in `/components/hair/`
2. Add the code to `/registry/codes.json` under `HAIR`
3. Follow the schema structure from existing presets

---

## Future Enhancements

Potential additions (not yet implemented):
- Men's hair presets
- Advanced styling (updos, intricate braids)
- Hair accessories as a separate dimension
- Dynamic hair (movement, wind effects)
- Seasonal/weather-based variations

---

## Questions?

Refer to the example fixtures in `/tests/test_hair_fixtures.py` or examine the existing component files in `/components/hair/` for reference implementations.
