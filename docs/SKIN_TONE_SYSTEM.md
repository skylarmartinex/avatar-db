# Skin Tone System Documentation

## Overview

The Avatar-DB now includes a dedicated **skin tone system** that's separate from body/physique, hair structure, and hair color. This provides stable, consistent skin tone rendering that remains unchanged across different lighting conditions and camera angles.

## Key Features

- ✅ **Separate from Body/Physique** - Skin tone is independent of build/proportions
- ✅ **Lighting-Agnostic** - Consistent skin tone regardless of lighting conditions
- ✅ **Granular Control** - Base, undertone, depth, tanning, freckles, finish, blemish policy
- ✅ **Stable Rendering** - No hedging, no improvisation, consistent tokens
- ✅ **Ethnicity-Neutral** - Uses photographic descriptors, avoids demographic labels
- ✅ **Backward Compatible** - Existing JSONs without appearance.skin_tone continue to work

---

## Skin Tone Object Schema

The skin tone system adds a new `appearance.skin_tone` object with the following structure:

```json
{
  "appearance": {
    "skin_tone": {
      "enabled": true,
      "base": "Medium-tan",
      "undertone": "Olive",
      "depth_level": "Tan",
      "tanning": "None",
      "freckles": {
        "enabled": false,
        "density": null,
        "visibility": null
      },
      "complexion_finish": "Dewy",
      "blemish_policy": "Minimal",
      "consistency_guards": {
        "lock_skin_tone": true,
        "avoid_color_shift_from_lighting": true
      },
      "constraints": []
    }
  }
}
```

### Field Definitions

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Whether to render skin tone clause |
| `base` | enum/string | `"Medium"` | Primary skin tone (required if enabled) |
| `undertone` | enum string | `"Neutral"` | Warm/Cool/Neutral/Olive/Golden |
| `depth_level` | enum string | - | Very fair/Fair/Light/Medium/Tan/Deep/Very deep |
| `tanning` | enum string | - | None/Light tan/Medium tan/Deep tan |
| `freckles.enabled` | boolean | `false` | Whether freckles are present |
| `freckles.density` | enum string | - | Sparse/Moderate/Dense |
| `freckles.visibility` | enum string | - | Subtle/Visible |
| `complexion_finish` | enum string | `"Natural"` | Matte/Natural/Dewy |
| `blemish_policy` | enum string | `"Minimal"` | None/Realistic/Minimal/Airbrushed |
| `consistency_guards.lock_skin_tone` | boolean | `true` | Forces stable tone across images |
| `consistency_guards.avoid_color_shift_from_lighting` | boolean | `true` | Prevents lighting from changing perceived tone |
| `constraints` | array of strings | `[]` | Negative rules |

---

## Enums Reference

### Base Options
- `"Porcelain"` - Very fair, delicate
- `"Ivory"` - Fair with slight warmth
- `"Fair"` - Light complexion
- `"Light"` - Light but not pale
- `"Light-medium"` - Between light and medium
- `"Medium"` - Mid-range tone
- `"Medium-tan"` - Medium with warmth
- `"Tan"` - Sun-kissed, warm
- `"Deep"` - Rich, dark tone
- `"Very deep"` - Deepest tone

**Note:** You can also use custom strings for unique descriptions.

### Undertone Options
- `"Warm"` - Yellow, golden, peachy undertones
- `"Cool"` - Pink, red, blue undertones
- `"Neutral"` - Balanced, no strong undertone
- `"Olive"` - Green-yellow undertones
- `"Golden"` - Rich golden undertones

### Depth Level Options
- `"Very fair"` - Lightest level (1-2)
- `"Fair"` - Fair level (3-4)
- `"Light"` - Light level (5-6)
- `"Medium"` - Medium level (7-8)
- `"Tan"` - Tan level (9-10)
- `"Deep"` - Deep level (11-12)
- `"Very deep"` - Deepest level (13-14)

### Tanning Options
- `"None"` - No tan
- `"Light tan"` - Subtle sun exposure
- `"Medium tan"` - Noticeable tan
- `"Deep tan"` - Significant sun exposure

### Freckles Density Options
- `"Sparse"` - Few freckles
- `"Moderate"` - Noticeable freckles
- `"Dense"` - Many freckles

### Freckles Visibility Options
- `"Subtle"` - Barely noticeable
- `"Visible"` - Clearly visible

### Complexion Finish Options
- `"Matte"` - No shine, flat finish
- `"Natural"` - Balanced, realistic
- `"Dewy"` - Luminous, glowing

### Blemish Policy Options
- `"None"` - Flawless, perfect skin
- `"Realistic"` - Natural skin texture and detail
- `"Minimal"` - Clean but not perfect
- `"Airbrushed"` - Heavily retouched look

---

## Prompt Rendering

The skin tone system includes a dedicated renderer (`src/skin_tone_renderer.py`) that converts structured skin tone data into stable, natural-language prompts.

### Rendering Rules

1. **Lighting-Agnostic:** Skin tone description remains the same regardless of lighting
2. **Stable Tokens:** Uses consistent identity tokens, not poetic or vague language
3. **No Hedging:** Avoids words like "maybe", "slightly", "somewhat"
4. **Consistency Guards:** Automatically includes "skin tone remains consistent across shots"
5. **Ethnicity-Neutral:** Uses photographic descriptors, avoids demographic labels
6. **Compact Output:** High-signal, minimal fluff

### Rendering Order

1. Base + depth level
2. Undertone
3. Tanning (if present)
4. Complexion finish
5. Freckles (if enabled)
6. Blemish policy
7. Consistency guard
8. Avoid color shift guard
9. Constraints

### Example Outputs

**Example A: Light-Medium Warm**
```
Skin tone: light-medium (light), warm undertone; natural finish; minimal blemishes; skin tone remains consistent across shots; avoid lighting-induced color shift; avoid unnatural orange tint.
```

**Example B: Medium-Tan Olive**
```
Skin tone: medium-tan (tan), olive undertone; dewy finish; minimal blemishes; skin tone remains consistent across shots; avoid lighting-induced color shift.
```

**Example C: Porcelain Cool**
```
Skin tone: porcelain (very fair), cool undertone; matte finish; sparse subtle freckles; minimal blemishes; skin tone remains consistent across shots; avoid lighting-induced color shift.
```

**Example D: Deep Neutral**
```
Skin tone: deep (deep), neutral undertone; natural finish; realistic complexion detail; skin tone remains consistent across shots; avoid lighting-induced color shift.
```

---

## Integration with Other Systems

The skin tone system is **separate** from body/physique, hair structure, and hair color. They work together but control different aspects:

### Body/Physique (`subject`)
Controls:
- Build (lean, athletic, etc.)
- Body proportions
- Muscle definition

### Hair Structure (`subject.hair`)
Controls:
- Preset (Classic Bombshell, Sleek Power Woman, etc.)
- Texture, length, style mode
- Part, bangs, finish

### Hair Color (`appearance.hair_color`)
Controls:
- Base color, tone, depth
- Highlights, roots, gradients
- Gray percentage

### Skin Tone (`appearance.skin_tone`)
Controls:
- Base tone, undertone, depth
- Tanning, freckles
- Complexion finish, blemish policy

### Recommended Rendering Order

1. **Skin tone clause** (from `appearance.skin_tone`)
2. **Hair structure clause** (from `subject.hair`)
3. **Hair color clause** (from `appearance.hair_color`)

---

## Usage Examples

### Simple Base Tone

```json
{
  "appearance": {
    "skin_tone": {
      "base": "Light",
      "undertone": "Cool",
      "depth_level": "Light"
    }
  }
}
```

**Output:** `Skin tone: light (light), cool undertone; natural finish; minimal blemishes; skin tone remains consistent across shots; avoid lighting-induced color shift.`

### With Freckles

```json
{
  "appearance": {
    "skin_tone": {
      "base": "Fair",
      "undertone": "Cool",
      "depth_level": "Fair",
      "freckles": {
        "enabled": true,
        "density": "Moderate",
        "visibility": "Visible"
      },
      "complexion_finish": "Natural"
    }
  }
}
```

**Output:** `Skin tone: fair (fair), cool undertone; natural finish; moderate visible freckles; minimal blemishes; skin tone remains consistent across shots; avoid lighting-induced color shift.`

### With Tanning

```json
{
  "appearance": {
    "skin_tone": {
      "base": "Medium",
      "undertone": "Warm",
      "depth_level": "Medium",
      "tanning": "Light tan",
      "complexion_finish": "Dewy"
    }
  }
}
```

**Output:** `Skin tone: medium (medium), warm undertone; light tan; dewy finish; minimal blemishes; skin tone remains consistent across shots; avoid lighting-induced color shift.`

### Airbrushed Finish

```json
{
  "appearance": {
    "skin_tone": {
      "base": "Porcelain",
      "undertone": "Cool",
      "depth_level": "Very fair",
      "complexion_finish": "Matte",
      "blemish_policy": "Airbrushed"
    }
  }
}
```

**Output:** `Skin tone: porcelain (very fair), cool undertone; matte finish; airbrushed finish; skin tone remains consistent across shots; avoid lighting-induced color shift.`

---

## Backward Compatibility

### Missing `appearance` Object
If the `appearance` object is missing, the system does nothing. Existing JSONs continue to work.

### Missing `skin_tone` Object
If `appearance.skin_tone` is missing, no skin tone clause is rendered.

### Disabled Skin Tone
If `appearance.skin_tone.enabled` is `false`, no skin tone clause is rendered.

### Default Values
- If `base` is missing: defaults to `"Medium"`
- If `undertone` is missing: defaults to `"Neutral"`
- If `complexion_finish` is missing: defaults to `"Natural"`
- If `blemish_policy` is missing: defaults to `"Minimal"`

---

## Ethnicity-Neutral Approach

**IMPORTANT:** The skin tone system uses **photographic descriptors** and avoids ethnicity labels.

### ✅ DO Use:
- Porcelain, ivory, fair, light, medium, tan, deep
- Warm, cool, neutral, olive, golden undertones
- Photographic terms (matte, dewy, natural)

### ❌ DON'T Use:
- Asian, Latina, African, European, etc.
- Ethnic or demographic labels
- Cultural associations

This ensures the system is:
- **Universal** - Works for any person
- **Objective** - Based on observable characteristics
- **Respectful** - Avoids assumptions or stereotypes

---

## Component Files

Skin tone presets are stored in `/components/appearance/`:
- `LIGHT_MEDIUM_WARM.json` - Light-medium with warm undertone
- `MEDIUM_TAN_OLIVE.json` - Medium-tan with olive undertone
- `PORCELAIN_COOL.json` - Very fair porcelain with cool undertone
- `DEEP_NEUTRAL.json` - Deep with neutral undertone

---

## Registry Codes

All skin tone codes are registered in `/registry/codes.json` under the `APPEARANCE` dimension.

---

## Testing

Run the test fixtures to see example outputs:

```bash
python3 tests/test_skin_tone_fixtures.py
```

This will display:
- Input JSON for each example
- Rendered natural-language output
- Expected output for comparison

---

## Best Practices

### 1. Use Depth Level for Precision
Always specify `depth_level` to clarify the exact shade:
- ✅ `"Medium-tan (tan)"`
- ❌ `"Medium-tan"` (less precise)

### 2. Match Undertone to Natural Characteristics
- **Warm:** Yellow, golden, peachy tones
- **Cool:** Pink, red, blue tones
- **Neutral:** Balanced, no strong undertone
- **Olive:** Green-yellow tones
- **Golden:** Rich golden tones

### 3. Choose Appropriate Finish
- **Matte:** No shine, flat (good for oily skin representation)
- **Natural:** Balanced, realistic (most versatile)
- **Dewy:** Luminous, glowing (good for healthy glow)

### 4. Use Blemish Policy Thoughtfully
- **None:** Perfect, flawless (unrealistic but clean)
- **Minimal:** Clean but not perfect (good default)
- **Realistic:** Natural texture and detail (most authentic)
- **Airbrushed:** Heavily retouched (editorial/fashion)

### 5. Add Constraints for Negatives
Use constraints to prevent unwanted variations:
- `"Avoid unnatural orange tint"`
- `"Avoid over-smoothing"`
- `"No ashy appearance"`
- `"Maintain warm glow"`

---

## Troubleshooting

### Skin tone not rendering?
- Check that `enabled` is `true` (or omitted, defaults to `true`)
- Verify the appearance component file exists in `/components/appearance/`
- Ensure the code is registered in `/registry/codes.json`

### Skin tone looks different in different lighting?
- This is expected visually! The skin tone **description** stays the same
- The consistency guards ensure the model uses the same tone identity
- Lighting affects how it appears visually, not the underlying tone

### Want a custom tone?
- You can use custom strings for `base`
- Example: `"base": "Honey-toned"` (not in enum list but will work)

---

## Future Enhancements

Potential additions (not yet implemented):
- Vitiligo representation
- Birthmarks and beauty marks
- Skin texture variations (smooth, textured, etc.)
- Seasonal tone variations
- Age-related skin characteristics

---

## Questions?

Refer to the example fixtures in `/tests/test_skin_tone_fixtures.py` or examine the existing component files in `/components/appearance/` for reference implementations.
