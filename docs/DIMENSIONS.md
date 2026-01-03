# Dimensions and Boundary Rules

## Naming Conventions
- Component files: `<CODE>.json` in folders like `face/`, `body/`, etc.
- Canonical ID: `FA-<FA>__BT-<BT>__ET-<ET>__HR-<HR>__SC-<SC>__ST-<ST>__v<XX>`
- Run ID: `<CANONICAL_ID>__r<XX>`

## Boundary Rules
- **Identity (FA, BT, HR)**: May only write under `subject.*`
- **Ethnicity (ET)**: May write under `subject.*` and `skin.*`
- **Style (SC, ST)**: May write under `setting`, `lighting`, `clothing`, `pose`, `surrounding`, `overall_mood`, `composition`, `aspect_ratio`, `image_quality`.
  - **PROHIBITED** from writing to `subject.facial_features`, `subject.face_anchor`, `subject.do_not_change`.
- **Negative (NB)**: May only write `negative_prompt`.

## Required Keys
- **Face (FA)**: `subject.face_anchor`, `subject.do_not_change`
- **Negative (NB)**: `negative_prompt`
