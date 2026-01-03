import copy
from typing import Dict, Any, List
from .utils import deep_merge
from .lint import validate_component

def merge_prompts(base: Dict[str, Any], component_list: List[Dict[str, Any]], dim_codes: List[str]) -> Dict[str, Any]:
    """
    Merge order: base -> scene(SC) -> ethnicity(ET) -> face(FA) -> body(BT) -> hair(HR) -> outfit(ST) -> negative(NB)
    Wait, the requirement says: 
    base -> scene(SC) -> ethnicity(ET) -> face(FA) -> body(BT) -> hair(HR) -> outfit(ST) -> negative(NB) -> overrides
    """
    result = copy.deepcopy(base)
    
    # We expect component_list and dim_codes to be aligned
    # But usually we find them by dimension.
    # Let's map them for easier access.
    comp_map = {dim: comp for dim, comp in zip(dim_codes, component_list)}
    
    order = ["SC", "ET", "FA", "BT", "HR", "ST", "NB"]
    
    for dim in order:
        if dim in comp_map:
            comp_content = comp_map[dim]
            # Verify boundary before merging (even if lint was skipped)
            errors = validate_component(dim, "merge-check", comp_content)
            if errors:
                raise ValueError(f"Boundary violation during merge for {dim}: {errors}")
            
            result = deep_merge(result, comp_content)
    
    return result
