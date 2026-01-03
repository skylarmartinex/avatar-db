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
