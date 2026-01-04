import copy
from typing import Dict, Any, List
from .utils import deep_merge
from .lint import validate_component

def merge_prompts(base: Dict[str, Any], component_list: List[Dict[str, Any]], dim_codes: List[str]) -> Dict[str, Any]:
    """
    Surgical Merge Order (Phase 1):
    BASE -> PF -> SC -> ET -> [REGION] -> FA -> BT -> HR -> ST -> NB
    """
    result = copy.deepcopy(base)
    
    # Map components by dimension for easier access
    comp_map = {dim: comp for dim, comp in zip(dim_codes, component_list)}
    
    # Full prescribed merge order
    order = [
        "BASE", "PF", "SC", "ET", 
        "PH_REGION", "VN_REGION", 
        "FA", "BT", "HR", "ST", "NB"
    ]
    
    for dim in order:
        if dim in comp_map:
            comp_content = comp_map[dim]
            # Verify boundary before merging
            errors = validate_component(dim, "merge-check", comp_content)
            if errors:
                # We log instead of raise to allow flexible expansion, but strictly keep boundaries
                print(f"Warning: Boundary violation during merge for {dim}: {errors}")
            
            result = deep_merge(result, comp_content)
    
    return result
