# Prompt Schema

## Allowed Top-Level Keys
Any merged prompt JSON must only contain these keys:
- setting
- viewing_angle
- subject
- lighting
- skin
- clothing
- pose
- surrounding
- aspect_ratio
- composition
- image_quality
- overall_mood
- negative_prompt

## Merge Order
Deterministic deep merge order:
1. base template
2. scene (SC)
3. ethnicity (ET)
4. face (FA)
5. body (BT)
6. hair (HR)
7. outfit (ST)
8. negative (NB)
9. overrides (if any)

Later modules override earlier keys at the same level.
