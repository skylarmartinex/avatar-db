from typing import List, Dict, Any
from .registry import get_all_codes
from .builder import build_prompt

def face_pass(v: str, runs: int, batch_name: str):
    codes = get_all_codes()
    # Fixed: SC=DOOR, ST=POCA, BT=AL, HR=ST
    # Variable: FA across all face codes matching SG- and MB-
    # ET across PH, EA
    
    fa_codes = [c for c in codes.get("FA", {}) if c.startswith("SG-") or c.startswith("MB-")]
    et_codes = [c for c in codes.get("ET", {}) if c in ["PH", "EA"]]
    
    results = []
    for fa in fa_codes:
        for et in et_codes:
            for r_idx in range(1, runs + 1):
                r_str = f"{r_idx:02d}"
                res = build_prompt(
                    fa=fa, bt="AL", et=et, hr="ST", sc="DOOR", st="POCA", v=v, r=r_str
                )
                results.append(res)
    return results
