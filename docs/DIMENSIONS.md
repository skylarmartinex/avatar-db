# Dimensions and Boundary Rules

## Naming Conventions
- Component files: `<CODE>.json` in folders like `face/`, `body/`, etc.
- Canonical ID: `FA-<FA>__BT-<BT>__ET-<ET>__HR-<HR>__SC-<SC>__ST-<ST>__v<XX>`
- Run ID: `<CANONICAL_ID>__r<XX>`

## Dimension Codes

### FA (Face Archetypes)
Face modules define facial features, anchors, and do-not-change constraints. All variants are currently Filipina (PH) ethnicity-scoped.

**Archetypes:**
- **SG** (Soft Goddess): Soft, feminine goddess-like beauty with warm expressive features
  - `SG-PH-A` (winner): Gentle harmony, almond eyes, straight nose
  - `SG-PH-B`: Rounder features variant
- **MB** (Modern Bombshell): Sexy, confident modern glam with sultry appeal
  - `MB-PH-A` (winner): Sultry eyes, balanced structure
  - `MB-PH-B`: Broader features variant
- **EM** (Editorial Model): Refined high-fashion editorial beauty
  - `EM-PH-A` (winner): Harmonious proportions, deep-set eyes
  - `EM-PH-B`: Angular runway-focused features
- **RS** (Romantic Sweet): Fresh romantic sweetness with approachable charm
  - `RS-PH-A` (winner): Soft features, button nose, heart-shaped face
  - `RS-PH-B`: Rounder, more youthful features
- **FD** (Fitness Defined): Athletic fitness beauty with strong definition
  - `FD-PH-A` (winner): Athletic intensity, defined structure
  - `FD-PH-B`: Competition-ready, powerful features

### BT (Body Types)
Body modules define build, proportions, and physical characteristics.

- **FR** (Fitness Ripped): Extremely lean, stage-ready physique with sharply defined abs
- **AL** (Athletic Lean): Lean athletic build with visible tone but softer definition
- **CF** (Curvy Fit): Athletic curvy feminine with balanced hourglass proportions
- **SM** (Slender Model): Slender model physique with elongated runway proportions
- **SC** (Soft Curvy): Soft curvy feminine with voluptuous proportions

### ET (Ethnicity)
Ethnicity modules define ethnic features, skin tone, undertone, and texture.

- **PH** (Filipina Heritage): Warm tan skin, Southeast Asian features
- **EA** (East Asian): Fair skin, East Asian features
- **LA** (Latina): Warm olive to tan skin, Latin American features
- **ME** (Middle Eastern): Warm golden skin, Middle Eastern features
- **NE** (Northern European): Fair porcelain skin, Northern European features

### HR (Hair Styles)
Hair modules define hairstyle, texture, and styling details.

- **ST** (Straight): Straight, smooth hair with natural body and gloss
- **WV** (Soft Waves): Loose, natural waves with movement and softness
- **PK** (Ponytail): Playful high ponytail with sleek styling and volume

### SC (Scene/Setting)
Scene modules define the environment, background, lighting, and overall composition.

- **DOOR** (Doorway Editorial): Outdoor residential/urban doorway with textured stone and dark wooden door
- **BEACH** (Tropical Beach): Pristine tropical beach with turquoise water and white sand
- **JUNGLE** (Tropical Jungle): Lush tropical jungle clearing with dense green foliage

### ST (Style/Outfit)
Outfit modules define clothing, pose adjustments, and outfit-specific mood.

- **POCA** (Pocahontas Tribal Bikini): Earth-toned tribal fashion bikini with fringe and beadwork
- **SPORT** (Athletic Sportswear): Sports bra and leggings with confident athletic stance
- **STREET** (Casual Streetwear): Cropped tee and denim shorts with relaxed urban vibe
- **RESORT** (Elegant Resort Wear): Flowing dress or sophisticated cover-up with graceful pose
- **ACTIVE** (Performance Activewear): Fitted tank and athletic shorts with dynamic pose

### NB (Negative Prompt)
Negative prompt modules define quality exclusions.

- **NB** (Negative Baseline): Comprehensive quality-focused negative prompt

## Boundary Rules
- **Identity (FA, BT, HR)**: May only write under `subject.*`
  - **FA** additionally requires: `subject.face_anchor`, `subject.do_not_change`, `subject.facial_features`
- **Ethnicity (ET)**: May write under `subject.*` and `skin.*`
- **Style (SC, ST)**: May write under `setting`, `lighting`, `clothing`, `pose`, `surrounding`, `overall_mood`, `composition`, `aspect_ratio`, `image_quality`, and `subject.*` (but NOT facial identity fields)
  - **PROHIBITED** from writing to `subject.facial_features`, `subject.face_anchor`, `subject.do_not_change`
- **Negative (NB)**: May only write `negative_prompt`

## Required Keys
- **Face (FA)**: `subject.face_anchor`, `subject.do_not_change`, `subject.facial_features`
- **Negative (NB)**: `negative_prompt`

## Merge Order
Components are merged in this order (later overwrites earlier):
```
base → SC → ET → FA → BT → HR → ST → NB
```

This ensures identity components (face, body, hair) take precedence over style components (scene, outfit).

