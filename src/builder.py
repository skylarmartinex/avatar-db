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
        
    segments.extend([
        f"HR-{hr}",
        f"SC-{sc}",
        f"ST-{st}",
        f"v{v}"
    ])
    
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
    # 9. ST (outfit)
    # 10. NB (negative)
    
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
        
    # 6-10. Rest
    dims.extend(["FA", "BT", "HR", "ST", "NB"])
    codes.extend([fa, bt, hr, st, nb])
    
    component_contents = []
    for dim, code in zip(dims, codes):
        path = get_component_path(dim, code)
        component_contents.append(load_json(path))
    
    # Use empty dict for merge start instead of templates/base.json (which is deprecated by BASE.json component)
    final_prompt = merge_prompts({}, component_contents, dims)
    
    if overrides:
        from .utils import deep_merge
        final_prompt = deep_merge(final_prompt, overrides)
    
    # Write builds/prompts/<canonical_id>.json (Always overwrite)
    prompt_path = os.path.join(BASE_DIR, "builds", "prompts", f"{canonical_id}.json")
    save_json(prompt_path, final_prompt)
    
    # Write builds/runs/<run_id>.json (Always)
    run_path = os.path.join(BASE_DIR, "builds", "runs", f"{run_id}.json")
    run_meta = {
        "timestamp": datetime.now().isoformat(),
        "selection_codes": {
            "FA": fa, "BT": bt, "ET": et, "HR": hr, "SC": sc, "ST": st, 
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
