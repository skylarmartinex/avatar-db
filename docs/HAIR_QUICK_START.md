# Women's Hair System - Quick Start Guide

## 🎯 What This Is

A **first-class, modular hair system** for Avatar-DB that locks hair consistency just like we locked physique. No more model improvisation—hair is now controlled through **8 curated presets** with granular overrides.

---

## 🚀 Quick Start (3 Steps)

### 1. Choose a Preset
```bash
# Available presets:
CLASSIC_BOMBSHELL      # Voluminous beach waves, honey blonde
SLEEK_POWER_WOMAN      # Pin-straight bob/lob, high-shine
NATURAL_CURL_QUEEN     # Long spiral curls (3B-3C)
PROTECTIVE_ROYALTY     # Knotless box braids
SOFT_GIRL_AESTHETIC    # Curtain bangs, half-up, day-two texture
EDITORIAL_WET_LOOK     # Slick-back ponytail, wet-look
PLAYFUL_YOUTH          # High ponytail, bouncy waves
MINIMAL_CHIC           # Short, clean lines, matte
```

### 2. Build Your Prompt
```bash
python -m src.cli build \
  --FA SG-PH-A \
  --BT FR \
  --ET PH \
  --HR SLEEK_POWER_WOMAN \
  --SC DOOR \
  --ST POCA \
  --v 01 \
  --r 01
```

### 3. Check the Output
The hair will render as a natural-language clause:
```
Hair: Sleek Power Woman, medium length, pin-straight, glass-smooth, 
center part, high-shine editorial finish, deep brunette; consistent 
hair identity across shots; no flyaways; razor-sharp edges.
```

---

## 📋 Hair Schema (Copy & Paste)

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

---

## 🎨 Preset Gallery

### Classic Bombshell
**Vibe:** Hollywood glamour, voluminous, timeless  
**Use Case:** High-end editorial, luxury lifestyle  
**Example:** Long honey blonde waves, fresh salon blowout

### Sleek Power Woman
**Vibe:** Executive confidence, sharp, polished  
**Use Case:** Corporate editorial, modern professional  
**Example:** Medium brunette bob, high-shine, razor-sharp edges

### Natural Curl Queen
**Vibe:** Authentic texture, voluminous, celebration of curls  
**Use Case:** Natural beauty editorial, lifestyle  
**Example:** Long spiral curls (3B-3C), defined ringlets, matte finish

### Protective Royalty
**Vibe:** Cultural pride, regal, protective styling  
**Use Case:** Editorial celebrating Black hair, lifestyle  
**Example:** Long knotless box braids, neat scalp sections

### Soft Girl Aesthetic
**Vibe:** Effortless, romantic, approachable  
**Use Case:** Lifestyle, casual editorial, influencer  
**Example:** Medium waves, curtain bangs, half-up, day-two texture

### Editorial Wet Look
**Vibe:** High-fashion, dramatic, runway-ready  
**Use Case:** Fashion editorial, avant-garde  
**Example:** Long slick-back ponytail, wet-look strands, high-shine

### Playful Youth
**Vibe:** Energetic, bouncy, youthful  
**Use Case:** Athletic editorial, lifestyle, casual  
**Example:** High ponytail, wind-swept waves, sun-kissed highlights

### Minimal Chic
**Vibe:** Clean, precise, understated elegance  
**Use Case:** Minimalist editorial, modern sophistication  
**Example:** Short pin-straight, side part, matte natural

---

## 🔧 Customization Options

### Texture
- Pin-straight, glass-smooth
- Loose beach waves
- Defined curls (2C–3A)
- Spiral curls (3B–3C)
- Coily curls (4A–4B)
- Tight coils (4C)
- Natural frizz volume
- Wet-look strands

### Length
- Ultra-short / Short / Medium / Long / Extra-long

### Style Mode
- Down / Half-up / High ponytail / Low ponytail
- Slick-back ponytail / Low bun / High bun
- Braids / Twists / Locs / Updo

### Finish
- Fresh salon blowout / Day-two texture / Post-workout
- Night-out glam / Wind-swept natural / Rain-damp realism
- Matte natural / Soft sheen / High-shine editorial

---

## ✅ Acceptance Criteria (Met)

### Example A: Sleek Power Woman ✅
```
Hair: Sleek Power Woman, medium length, pin-straight, glass-smooth, 
center part, high-shine editorial finish, deep brunette; consistent 
hair identity across shots; no flyaways; razor-sharp edges.
```

### Example B: Natural Curl Queen ✅
```
Hair: Natural Curl Queen, long length, spiral curls (3b–3c), matte 
natural finish, deep brunette; consistent hair identity across shots; 
curls remain defined; soft volume.
```

### Example C: Protective Royalty ✅
```
Hair: Protective Royalty, long length, braids, soft sheen finish, 
jet black; consistent hair identity across shots; braids remain 
uniform; neat scalp sections; knotless box braids.
```

---

## 📚 Full Documentation

- **Complete Guide:** [docs/HAIR_SYSTEM.md](HAIR_SYSTEM.md)
- **Implementation Details:** [docs/HAIR_SYSTEM_IMPLEMENTATION.md](HAIR_SYSTEM_IMPLEMENTATION.md)
- **Examples:** [docs/examples/](examples/)
- **Tests:** [tests/test_hair_fixtures.py](../tests/test_hair_fixtures.py)

---

## 🧪 Testing

```bash
# Run test fixtures
python3 tests/test_hair_fixtures.py

# List available hair codes
python -m src.cli list HAIR

# Build with a preset
python -m src.cli build --HR NATURAL_CURL_QUEEN [other args]
```

---

## 🔄 Backward Compatibility

**Old format still works:**
```json
{
  "subject": {
    "hair": {
      "color": "Deep black",
      "length": "Long",
      "style": "Thick, glossy hair worn loose"
    }
  }
}
```

**No breaking changes.** Existing JSONs continue to work.

---

## 💡 Pro Tips

1. **Start with a preset** - It provides sensible defaults
2. **Use constraints** - Prevent unwanted variations
3. **Be specific with color** - "Deep brunette" > "Brown"
4. **Match finish to context** - Editorial vs. lifestyle vs. athletic
5. **Texture matters for curls** - Be specific about curl pattern (2C, 3B, 4C, etc.)

---

## 🎯 Key Benefits

✅ **No model improvisation** - All options are predefined tokens  
✅ **Consistent identity** - Built-in consistency guards  
✅ **Granular control** - Override any aspect of the preset  
✅ **Backward compatible** - Existing JSONs still work  
✅ **Easy to use** - Choose a preset, build, done  

---

## 📞 Need Help?

- Check the [full documentation](HAIR_SYSTEM.md)
- Review [example JSONs](examples/)
- Run the [test fixtures](../tests/test_hair_fixtures.py)
- Examine existing [component files](../components/hair/)

---

**Ready to lock hair consistency? Choose a preset and build!** 🚀
