# Hair Color System Documentation

## Overview

The Avatar-DB now includes a dedicated **hair color system** that's separate from the hair structure system (preset/texture/length/style). This allows you to swap colors without changing hair identity, providing modular control over appearance.

## Key Features

- ✅ **Separate from Hair Structure** - Color is independent of preset/texture/length
- ✅ **Lighting-Agnostic** - Consistent color identity regardless of lighting conditions
- ✅ **Granular Control** - Base color, tone, depth, highlights, roots, gradients, gray
- ✅ **Stable Rendering** - No hedging, no improvisation, consistent tokens
- ✅ **Backward Compatible** - Existing JSONs without appearance.hair_color continue to work

---

## Hair Color Object Schema

The hair color system adds a new `appearance.hair_color` object with the following structure:

```json
{
  "appearance": {
    "hair_color": {
      "enabled": true,
      "base_color": "Espresso brunette",
      "tone": "Neutral",
      "depth_level": "Dark",
      "highlights": {
        "enabled": true,
        "color": "Caramel",
        "placement": "Face-framing",
        "intensity": "Subtle"
      },
      "roots": {
        "enabled": false,
        "color": null,
        "softness": null
      },
      "gradient": {
        "enabled": false,
        "style": null,
        "from_color": null,
        "to_color": null,
        "blend": null
      },
      "gray_percentage": "None",
      "constraints": []
    }
  }
}
```

### Field Definitions

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Whether to render hair color clause |
| `base_color` | enum/string | `"Espresso brunette"` | Primary hair color (required if enabled) |
| `tone` | enum string | - | Cool/Neutral/Warm undertone |
| `depth_level` | enum string | - | Jet/Dark/Medium/Light/Platinum |
| `highlights.enabled` | boolean | `false` | Whether highlights are present |
| `highlights.color` | enum/string | - | Highlight color |
| `highlights.placement` | enum string | - | Where highlights are placed |
| `highlights.intensity` | enum string | - | Subtle/Moderate/Bold |
| `roots.enabled` | boolean | `false` | Whether roots are visible |
| `roots.color` | enum/string | - | Root color (if different from base) |
| `roots.softness` | enum string | - | Blended/Soft/Sharp |
| `gradient.enabled` | boolean | `false` | Whether gradient is present |
| `gradient.style` | enum string | - | Balayage/Ombre/Sombre |
| `gradient.from_color` | enum/string | - | Starting color |
| `gradient.to_color` | enum/string | - | Ending color |
| `gradient.blend` | enum string | - | Soft/Medium/High-contrast blend |
| `gray_percentage` | enum string | `"None"` | Amount of gray hair |
| `constraints` | array of strings | `[]` | Negative rules |

---

## Enums Reference

### Base Color Options
- `"Jet black"`
- `"Soft black"`
- `"Espresso brunette"`
- `"Dark chocolate brown"`
- `"Chestnut brown"`
- `"Warm brown"`
- `"Honey brown"`
- `"Auburn"`
- `"Copper"`
- `"Strawberry blonde"`
- `"Golden blonde"`
- `"Honey blonde"`
- `"Ash blonde"`
- `"Platinum blonde"`
- `"Silver"`
- `"White"`

**Note:** You can also use custom strings for unique colors.

### Tone Options
- `"Cool"`
- `"Neutral"`
- `"Warm"`

### Depth Level Options
- `"Jet"` - Deepest, darkest level
- `"Dark"` - Dark but not jet black
- `"Medium"` - Mid-range depth
- `"Light"` - Light, bright colors
- `"Platinum"` - Lightest, most reflective

### Highlights Placement Options
- `"Face-framing"` - Around the face
- `"Babylights"` - Fine, delicate highlights throughout
- `"Full-head"` - All over
- `"Partial"` - Selective placement
- `"Money piece"` - Bold face-framing chunks
- `"Ends only"` - Just the tips

### Highlights Intensity Options
- `"Subtle"` - Barely noticeable, natural
- `"Moderate"` - Clearly visible but not dramatic
- `"Bold"` - High-contrast, statement-making

### Roots Softness Options
- `"Blended"` - Seamlessly blended, no visible line
- `"Soft"` - Gentle transition
- `"Sharp"` - Clear demarcation line

### Gradient Style Options
- `"Balayage"` - Hand-painted, natural gradient
- `"Ombre"` - Gradual fade from dark to light
- `"Sombre"` - Subtle ombre

### Gradient Blend Options
- `"Soft blend"` - Seamless, gradual transition
- `"Medium blend"` - Noticeable but smooth
- `"High-contrast blend"` - Dramatic, distinct transition

### Gray Percentage Options
- `"None"` - No gray hair
- `"Trace"` - Just a few strands
- `"Low (5–15%)"` - Minimal gray
- `"Medium (20–40%)"` - Noticeable gray
- `"High (50%+)"` - Predominantly gray

---

## Prompt Rendering

The hair color system includes a dedicated renderer (`src/hair_color_renderer.py`) that converts structured hair color data into stable, natural-language prompts.

### Rendering Rules

1. **Lighting-Agnostic:** Color description remains the same regardless of lighting conditions
2. **Stable Tokens:** Uses consistent identity tokens, not poetic or vague language
3. **No Hedging:** Avoids words like "maybe", "slightly", "somewhat"
4. **Consistency Guard:** Automatically includes "color remains consistent across shots"
5. **Compact Output:** High-signal, minimal fluff

### Rendering Order

1. Base color + depth level
2. Tone
3. Highlights (if enabled)
4. Roots (if enabled)
5. Gradient (if enabled)
6. Gray percentage (if present)
7. Constraints (as brief negatives)

### Example Outputs

**Example A: Espresso Brunette + Caramel Highlights**
```
Hair color: espresso brunette (dark), neutral tone; subtle caramel face-framing highlights; color remains consistent across shots.
```

**Example B: Ash Blonde Balayage**
```
Hair color: ash blonde (light), cool tone; balayage gradient from ash blonde to platinum blonde with soft blend; color remains consistent across shots.
```

**Example C: Jet Black + Trace Gray**
```
Hair color: jet black (jet), neutral tone; trace gray; color remains consistent across shots.
```

**Example D: Copper + Money Piece**
```
Hair color: copper (medium), warm tone; bold platinum blonde money piece highlights; sharp dark brown root contrast; color remains consistent across shots.
```

---

## Integration with Hair Structure

The hair color system is **separate** from the hair structure system. They work together but control different aspects:

### Hair Structure (`subject.hair`)
Controls:
- Preset (Classic Bombshell, Sleek Power Woman, etc.)
- Texture (pin-straight, waves, curls, coils)
- Length (short, medium, long)
- Style mode (down, ponytail, bun, braids)
- Part, bangs, finish

### Hair Color (`appearance.hair_color`)
Controls:
- Base color
- Tone (cool/neutral/warm)
- Depth level
- Highlights
- Roots
- Gradients
- Gray percentage

### Example: Both Together

```json
{
  "subject": {
    "hair": {
      "preset": "Sleek Power Woman",
      "texture": "Pin-straight, glass-smooth",
      "length": "Medium",
      "style_mode": "Down",
      "part": "Center part",
      "finish": "High-shine editorial"
    }
  },
  "appearance": {
    "hair_color": {
      "base_color": "Espresso brunette",
      "tone": "Neutral",
      "depth_level": "Dark",
      "highlights": {
        "enabled": true,
        "color": "Caramel",
        "placement": "Face-framing",
        "intensity": "Subtle"
      }
    }
  }
}
```

**Rendered Output:**
```
Hair: Sleek Power Woman, medium length, pin-straight, glass-smooth, center part, high-shine editorial finish; consistent hair identity across shots; no flyaways; razor-sharp edges.

Hair color: espresso brunette (dark), neutral tone; subtle caramel face-framing highlights; color remains consistent across shots.
```

---

## Usage Examples

### Simple Base Color

```json
{
  "appearance": {
    "hair_color": {
      "enabled": true,
      "base_color": "Honey blonde",
      "tone": "Warm",
      "depth_level": "Light"
    }
  }
}
```

**Output:** `Hair color: honey blonde (light), warm tone; color remains consistent across shots.`

### With Highlights

```json
{
  "appearance": {
    "hair_color": {
      "enabled": true,
      "base_color": "Chestnut brown",
      "tone": "Neutral",
      "depth_level": "Medium",
      "highlights": {
        "enabled": true,
        "color": "Honey blonde",
        "placement": "Babylights",
        "intensity": "Subtle"
      }
    }
  }
}
```

**Output:** `Hair color: chestnut brown (medium), neutral tone; subtle honey blonde babylights highlights; color remains consistent across shots.`

### With Gradient

```json
{
  "appearance": {
    "hair_color": {
      "enabled": true,
      "base_color": "Dark chocolate brown",
      "tone": "Cool",
      "depth_level": "Dark",
      "gradient": {
        "enabled": true,
        "style": "Ombre",
        "from_color": "Dark chocolate brown",
        "to_color": "Ash blonde",
        "blend": "Medium blend"
      }
    }
  }
}
```

**Output:** `Hair color: dark chocolate brown (dark), cool tone; ombre gradient from dark chocolate brown to ash blonde with medium blend; color remains consistent across shots.`

### With Roots

```json
{
  "appearance": {
    "hair_color": {
      "enabled": true,
      "base_color": "Platinum blonde",
      "tone": "Cool",
      "depth_level": "Platinum",
      "roots": {
        "enabled": true,
        "color": "Soft black",
        "softness": "Soft"
      }
    }
  }
}
```

**Output:** `Hair color: platinum blonde (platinum), cool tone; soft soft black root contrast; color remains consistent across shots.`

---

## Backward Compatibility

### Missing `appearance` Object
If the `appearance` object is missing from the JSON, the system does nothing. Existing JSONs continue to work.

### Missing `hair_color` Object
If `appearance.hair_color` is missing, no hair color clause is rendered.

### Disabled Hair Color
If `appearance.hair_color.enabled` is `false`, no hair color clause is rendered.

### Default Base Color
If `appearance.hair_color.enabled` is `true` but `base_color` is missing, defaults to `"Espresso brunette"`.

---

## Component Files

Hair color presets are stored in `/components/appearance/`:
- `ESPRESSO_CARAMEL.json` - Espresso brunette + caramel highlights
- `ASH_BALAYAGE.json` - Ash blonde balayage to platinum
- `JET_BLACK_GRAY.json` - Jet black with trace gray
- `COPPER_MONEY_PIECE.json` - Copper with platinum money piece

---

## Registry Codes

All hair color codes are registered in `/registry/codes.json` under the `APPEARANCE` dimension.

---

## Testing

Run the test fixtures to see example outputs:

```bash
python3 tests/test_hair_color_fixtures.py
```

This will display:
- Input JSON for each example
- Rendered natural-language output
- Expected output for comparison

---

## Best Practices

### 1. Use Depth Level for Precision
Always specify `depth_level` to clarify the exact shade:
- ✅ `"Espresso brunette (dark)"`
- ❌ `"Espresso brunette"` (less precise)

### 2. Match Tone to Skin Undertone
- **Cool tone:** Ash, platinum, silver colors
- **Warm tone:** Honey, golden, copper colors
- **Neutral tone:** Espresso, chestnut, soft black

### 3. Be Specific with Highlights
Use all three fields for clarity:
- `intensity`: Subtle/Moderate/Bold
- `color`: Specific highlight color
- `placement`: Where they're placed

### 4. Use Constraints for Negatives
Add constraints to prevent unwanted variations:
- `"Avoid unnatural neon tones"`
- `"No brassy warmth"`
- `"Maintain cool undertone"`

### 5. Gradients vs. Highlights
- **Gradients:** Full-length color transition (balayage, ombre)
- **Highlights:** Specific strands or sections

Don't enable both unless intentionally layering effects.

---

## Troubleshooting

### Hair color not rendering?
- Check that `enabled` is `true` (or omitted, defaults to `true`)
- Verify the appearance component file exists in `/components/appearance/`
- Ensure the code is registered in `/registry/codes.json`

### Color looks different in different lighting?
- This is expected! The hair color clause is **lighting-agnostic**
- The description stays the same; lighting affects how it appears visually
- This ensures consistent identity tokens across generations

### Want a custom color?
- You can use custom strings for `base_color`, `highlights.color`, `roots.color`, etc.
- Example: `"base_color": "Rose gold"` (not in enum list but will work)

---

## Future Enhancements

Potential additions (not yet implemented):
- Hair color history/timeline
- Seasonal color variations
- Color correction/toning specifications
- Multi-tonal color (more than 2 colors)
- Metallic/iridescent effects

---

## Questions?

Refer to the example fixtures in `/tests/test_hair_color_fixtures.py` or examine the existing component files in `/components/appearance/` for reference implementations.
