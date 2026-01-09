import os
import json
from datetime import datetime
from typing import Dict, Any, Optional
from .registry import get_component_path, BASE_DIR
from .utils import load_json, save_json
from .merge import merge_prompts

def build_prompt(
    fa: str, bt: str, et: str, hr: str, sc: str, st: str, v: str, r: str,
    ph_region: Optional[str] = None,
    vn_region: Optional[str] = None,
    appearance_code: str = "PORCELAIN_COOL", # Default from original logic
    age_code: Optional[str] = None,
    base_code: str = "BASE",
    pf_code: str = "POSTURE_FRAMING",
    nb: str = "NB",
    overrides: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    # Canonical ID segments
    segments = [
        f"FA-{fa}",
        f"BT-{bt}",
        f"ET-{et}"
    ]
    
    # Optional regions in canonical ID
    if ph_region:
        segments.append(f"PH_REGION-{ph_region}")
    if vn_region:
        segments.append(f"VN_REGION-{vn_region}")
        
    # appearance_code is now a direct parameter, no need to pop from overrides
    # appearance_code = overrides.pop("APPEARANCE", "PORCELAIN_COOL") if overrides and "APPEARANCE" in overrides else "PORCELAIN_COOL"

    segments.extend([
        f"HR-{hr}",
        f"SC-{sc}",
        f"ST-{st}",
        f"APPEARANCE-{appearance_code}"
    ])
    
    if age_code:
        segments.append(f"AGE-{age_code}")

    segments.append(f"v{v}")
    
    canonical_id = "__".join(segments)
    run_id = f"{canonical_id}__r{r}"
    
    # Merge Order (Surgical):
    # 1. BASE (locked foundation)
    # 2. PF (locked posture/framing)
    # 3. SC (scene)
    # 4. ET (ethnicity)
    # 5. [REGION] (optional)
    # 6. FA (face)
    # 7. BT (body)
    # 8. HR (hair)
    # 9. APPEARANCE (color/skin)
    # 10. AGE (optional)
    # 11. ST (outfit)
    # 12. NB (negative)
    
    dims = []
    codes = []
    
    # 1. Base
    dims.append("BASE")
    codes.append(base_code)
    
    # 2. Posture/Framing
    dims.append("PF")
    codes.append(pf_code)
    
    # 3. Scene
    dims.append("SC")
    codes.append(sc)
    
    # 4. Ethnicity
    dims.append("ET")
    codes.append(et)
    
    # 5. Region (Optional)
    if ph_region and et == "PH":
        dims.append("PH_REGION")
        codes.append(ph_region)
    elif vn_region and et == "VN":
        dims.append("VN_REGION")
        codes.append(vn_region)
        
    # 6. Rest of dimensions
    rest_dims = ["FA", "BT", "HR"]
    rest_codes = [fa, bt, hr]
    
    # 9. Appearance
    rest_dims.append("APPEARANCE")
    rest_codes.append(appearance_code)
    
    # 10. Age (Optional)
    if age_code:
        rest_dims.append("AGE")
        rest_codes.append(age_code)
        
    # 11-12. Outfit and Negative
    rest_dims.extend(["ST", "NB"])
    rest_codes.extend([st, nb])
    
    dims.extend(rest_dims)
    codes.extend(rest_codes)
    
    component_contents = []
    is_body_comp_enabled = overrides and overrides.get("body_components", {}).get("enabled") is True
    
    for dim, code in zip(dims, codes):
        if dim == "BT" and is_body_comp_enabled:
            # Skip loading body archetype if pure components system is active
            component_contents.append({})
            continue
        path = get_component_path(dim, code)
        component_contents.append(load_json(path))
    
    final_prompt = merge_prompts({}, component_contents, dims)
    
    if overrides:
        from .utils import deep_merge
        final_prompt = deep_merge(final_prompt, overrides)
    
    # NEW: Render natural language clauses
    from .renderer import enrich_prompt_with_renderings
    final_prompt = enrich_prompt_with_renderings(final_prompt)
    
    # Write builds/prompts/<canonical_id>.json (Always overwrite)
    prompt_path = os.path.join(BASE_DIR, "builds", "prompts", f"{canonical_id}.json")
    save_json(prompt_path, final_prompt)
    
    # Write builds/runs/<run_id>.json (Always)
    run_path = os.path.join(BASE_DIR, "builds", "runs", f"{run_id}.json")
    run_meta = {
        "timestamp": datetime.now().isoformat(),
        "selection_codes": {
            "FA": fa, "BT": bt, "ET": et, "HR": hr, "SC": sc, "ST": st, "APPEARANCE": appearance_code,
            "PH_REGION": ph_region, "VN_REGION": vn_region,
            "BASE": base_code, "PF": pf_code, "NB": nb
        },
        "prompt_version": v,
        "run_id": r,
        "prompt_json_path": prompt_path,
        "image_path": "",
        "rating": "",
        "notes": ""
    }
    save_json(run_path, run_meta)
    
    return {
        "canonical_id": canonical_id,
        "run_id": run_id,
        "prompt_path": prompt_path,
        "run_path": run_path,
        "meta": run_meta
    }
