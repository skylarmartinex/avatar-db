# Hair Color System - Quick Start Guide

## 🎯 What This Is

A **dedicated, modular hair color system** for Avatar-DB that's completely separate from hair structure (preset/texture/length/style). This allows you to swap colors without changing hair identity, with lighting-agnostic, stable color tokens.

---

## 🚀 Quick Start (3 Steps)

### 1. Choose Your Color Configuration
```bash
# Available presets:
ESPRESSO_CARAMEL      # Dark espresso + subtle caramel highlights
ASH_BALAYAGE          # Ash blonde + balayage to platinum
JET_BLACK_GRAY        # Jet black + trace gray
COPPER_MONEY_PIECE    # Copper + bold platinum money piece
```

### 2. Add to Your JSON
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
      }
    }
  }
}
```

### 3. Check the Output
The hair color will render as a separate clause:
```
Hair color: espresso brunette (dark), neutral tone; subtle caramel face-framing highlights; color remains consistent across shots.
```

---

## 📋 Hair Color Schema (Copy & Paste)

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

---

## 🎨 Color Options

### Base Colors (Enum)
- **Blacks:** Jet black, Soft black
- **Brunettes:** Espresso brunette, Dark chocolate brown, Chestnut brown, Warm brown, Honey brown
- **Reds:** Auburn, Copper, Strawberry blonde
- **Blondes:** Golden blonde, Honey blonde, Ash blonde, Platinum blonde
- **Grays:** Silver, White

**Note:** You can also use custom strings like "Rose gold" or "Burgundy"

### Tones
- **Cool** - Ash, platinum, silver tones
- **Neutral** - Balanced, no strong undertone
- **Warm** - Honey, golden, copper tones

### Depth Levels
- **Jet** - Deepest, darkest (level 1-2)
- **Dark** - Dark but not jet black (level 3-4)
- **Medium** - Mid-range (level 5-6)
- **Light** - Light, bright (level 7-8)
- **Platinum** - Lightest, most reflective (level 9-10)

---

## 🌟 Common Configurations

### Simple Solid Color
```json
{
  "appearance": {
    "hair_color": {
      "base_color": "Honey blonde",
      "tone": "Warm",
      "depth_level": "Light"
    }
  }
}
```
**Output:** `Hair color: honey blonde (light), warm tone; color remains consistent across shots.`

### With Face-Framing Highlights
```json
{
  "appearance": {
    "hair_color": {
      "base_color": "Chestnut brown",
      "tone": "Neutral",
      "depth_level": "Medium",
      "highlights": {
        "enabled": true,
        "color": "Honey blonde",
        "placement": "Face-framing",
        "intensity": "Subtle"
      }
    }
  }
}
```
**Output:** `Hair color: chestnut brown (medium), neutral tone; subtle honey blonde face-framing highlights; color remains consistent across shots.`

### With Balayage Gradient
```json
{
  "appearance": {
    "hair_color": {
      "base_color": "Dark chocolate brown",
      "tone": "Cool",
      "depth_level": "Dark",
      "gradient": {
        "enabled": true,
        "style": "Balayage",
        "from_color": "Dark chocolate brown",
        "to_color": "Ash blonde",
        "blend": "Soft blend"
      }
    }
  }
}
```
**Output:** `Hair color: dark chocolate brown (dark), cool tone; balayage gradient from dark chocolate brown to ash blonde with soft blend; color remains consistent across shots.`

### With Visible Roots
```json
{
  "appearance": {
    "hair_color": {
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

### With Gray Hair
```json
{
  "appearance": {
    "hair_color": {
      "base_color": "Jet black",
      "tone": "Neutral",
      "depth_level": "Jet",
      "gray_percentage": "Trace"
    }
  }
}
```
**Output:** `Hair color: jet black (jet), neutral tone; trace gray; color remains consistent across shots.`

---

## 🔧 Highlights Options

### Placement
- **Face-framing** - Around the face for brightness
- **Babylights** - Fine, delicate highlights throughout
- **Full-head** - All over coverage
- **Partial** - Selective placement
- **Money piece** - Bold face-framing chunks (statement-making)
- **Ends only** - Just the tips

### Intensity
- **Subtle** - Barely noticeable, natural sun-kissed
- **Moderate** - Clearly visible but not dramatic
- **Bold** - High-contrast, statement-making

---

## 🌈 Gradient Options

### Styles
- **Balayage** - Hand-painted, natural gradient
- **Ombre** - Gradual fade from dark to light
- **Sombre** - Subtle ombre (soft, natural)

### Blend
- **Soft blend** - Seamless, gradual transition
- **Medium blend** - Noticeable but smooth
- **High-contrast blend** - Dramatic, distinct transition

---

## 👥 Gray Hair Options

- **None** - No gray hair
- **Trace** - Just a few strands (salt and pepper start)
- **Low (5–15%)** - Minimal gray, mostly natural color
- **Medium (20–40%)** - Noticeable gray, mixed
- **High (50%+)** - Predominantly gray/silver

---

## 🔄 Integration with Hair Structure

Hair color is **separate** from hair structure. Use both together:

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

**This produces TWO separate clauses:**

1. **Hair structure:** `Hair: Sleek Power Woman, medium length, pin-straight, glass-smooth, center part, high-shine editorial finish; consistent hair identity across shots.`

2. **Hair color:** `Hair color: espresso brunette (dark), neutral tone; subtle caramel face-framing highlights; color remains consistent across shots.`

---

## ✅ Acceptance Criteria Examples

### Example A: Espresso Brunette + Caramel Highlights
```
Hair color: espresso brunette (dark), neutral tone; subtle caramel face-framing highlights; color remains consistent across shots.
```

### Example B: Ash Blonde Balayage
```
Hair color: ash blonde (light), cool tone; balayage gradient from ash blonde to platinum blonde with soft blend; color remains consistent across shots.
```

### Example C: Jet Black + Trace Gray
```
Hair color: jet black (jet), neutral tone; trace gray; color remains consistent across shots.
```

### Example D: Copper + Money Piece
```
Hair color: copper (medium), warm tone; bold platinum blonde money piece highlights; sharp dark brown root contrast; color remains consistent across shots.
```

---

## 🧪 Testing

```bash
# Run test fixtures
python3 tests/test_hair_color_fixtures.py

# List available appearance codes
python -m src.cli list APPEARANCE
```

---

## 💡 Pro Tips

1. **Always specify depth_level** - Makes the color more precise
   - ✅ `"Espresso brunette (dark)"`
   - ❌ `"Espresso brunette"` (less precise)

2. **Match tone to skin undertone** for harmony
   - Cool skin → Cool tone (ash, platinum)
   - Warm skin → Warm tone (honey, golden, copper)
   - Neutral skin → Neutral tone

3. **Use highlights OR gradient, not both** (unless intentionally layering)
   - Highlights = specific strands/sections
   - Gradient = full-length color transition

4. **Be specific with highlights**
   - Include intensity, color, and placement
   - Example: "Subtle honey blonde face-framing highlights"

5. **Lighting-agnostic = consistent**
   - The color description stays the same
   - Lighting affects visual appearance, not the identity token

---

## 📚 Full Documentation

- **Complete Guide:** [docs/HAIR_COLOR_SYSTEM.md](HAIR_COLOR_SYSTEM.md)
- **Implementation Details:** [docs/HAIR_COLOR_IMPLEMENTATION.md](HAIR_COLOR_IMPLEMENTATION.md)
- **Examples:** [docs/examples/hair_structure_and_color_example.json](examples/hair_structure_and_color_example.json)
- **Tests:** [tests/test_hair_color_fixtures.py](../tests/test_hair_color_fixtures.py)

---

## 🎯 Key Benefits

✅ **Separate from hair structure** - Swap colors without changing identity  
✅ **Lighting-agnostic** - Consistent color tokens across shots  
✅ **Granular control** - Base, tone, highlights, roots, gradients, gray  
✅ **Stable rendering** - No hedging, no improvisation  
✅ **Backward compatible** - Existing JSONs still work  

---

**Ready to add precise hair color control? Choose your configuration and build!** 🎨
