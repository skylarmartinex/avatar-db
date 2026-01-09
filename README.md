# Avatar-DB Prototype

Deterministic parametric avatar prompt database.

## Quickstart
1. Install dependencies: `pip install -r requirements.txt`
2. Run lint: `python -m src.cli lint`
3. Build a prompt: `python -m src.cli build --FA SG-PH-A --BT FR --ET PH --HR ST --SC DOOR --ST POCA --v 01 --r 01`

## Example Commands
- List codes: `python -m src.cli list FA`
- Build pack: `python -m src.cli build-pack --SUB SUB-SGPH_A_FR_ST --STY STY-DOOR_POCA_GOLD --v 01 --r 01`
- Batch (Grid): `python -m src.cli batch --grid "FA=SG-PH-A,SG-PH-B BT=FR,AL ET=PH,EA HR=ST,WV SC=DOOR ST=POCA" --v 01 --runs 3 --batch_name base_mvp`
- Batch (Preset): `python -m src.cli batch --preset face_pass --v 01 --runs 3 --batch_name face_pass_mvp`

## Adding Modules
1. Add the code to `registry/codes.json`.
2. Add the corresponding JSON file to the correct dimension folder in `components/`.
3. Run `python -m src.cli lint` to verify.

## Women's Hair System
The Avatar-DB now includes a comprehensive women's hair system with 8 curated presets (Classic Bombshell, Sleek Power Woman, Natural Curl Queen, etc.) and granular control over texture, length, style, and finish.

📖 **[Read the full Hair System documentation](docs/HAIR_SYSTEM.md)**

Example usage:
```bash
python -m src.cli build --FA SG-PH-A --BT FR --ET PH --HR SLEEK_POWER_WOMAN --SC DOOR --ST POCA --v 01 --r 01
```

## Hair Color System
The Avatar-DB now includes a dedicated **hair color system** that's separate from hair structure. This allows you to swap colors (base, highlights, gradients, roots, gray) without changing hair identity. The color system is lighting-agnostic and provides stable, consistent color tokens.

📖 **[Read the full Hair Color System documentation](docs/HAIR_COLOR_SYSTEM.md)**

Example usage:
```bash
# Hair color components can be used with the APPEARANCE dimension
python -m src.cli build --FA SG-PH-A --BT FR --ET PH --HR SLEEK_POWER_WOMAN --AP ESPRESSO_CARAMEL --SC DOOR --ST POCA --v 01 --r 01
```

## Skin Tone System
The Avatar-DB now includes a dedicated **skin tone system** that's separate from body/physique, hair structure, and hair color. This provides stable, consistent skin tone rendering that remains unchanged across different lighting conditions. The system uses ethnicity-neutral photographic descriptors.

📖 **[Read the full Skin Tone System documentation](docs/SKIN_TONE_SYSTEM.md)**

Example usage:
```bash
# Skin tone components can be used with the APPEARANCE dimension
python -m src.cli build --FA SG-PH-A --BT FR --ET PH --HR SLEEK_POWER_WOMAN --AP MEDIUM_TAN_OLIVE --SC DOOR --ST POCA --v 01 --r 01
```

