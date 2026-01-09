from typing import Dict, Any, Optional, List

def render_body_clause(body_data: Dict[str, Any]) -> Optional[str]:
    """
    Renders the body clause based on body.profile, body.global and body.regions.
    """
    if not body_data:
        return None
        
    profile = body_data.get("profile", "Ripped Athletic")
    g = body_data.get("global", {})
    regions = body_data.get("regions", {})
    
    clauses = []
    
    # 1. Global clause
    global_parts = [f"Body profile: {profile}"]
    if g:
        if "leanness" in g: global_parts.append(f"{g['leanness']} leanness")
        if "muscle_definition" in g: global_parts.append(f"{g['muscle_definition']} muscle definition")
        if "vascularity" in g: global_parts.append(f"{g['vascularity']} vascularity")
        if "softness_policy" in g: global_parts.append(f"{g['softness_policy']}")
        
    clauses.append("; ".join(global_parts))
    
    # 2. Regional clauses
    for region_name, r in regions.items():
        if r.get("enabled"):
            size = r.get("size", "Medium")
            definition = r.get("definition", "Toned")
            shape = r.get("shape_cue", "")
            constraints = r.get("constraints", [])
            
            reg_str = f"{region_name.capitalize()}: {size}, {definition}"
            if shape:
                reg_str += f", {shape}"
            
            if constraints:
                if isinstance(constraints, list):
                    reg_str += f"; {', '.join(constraints)}"
                else:
                    reg_str += f"; {constraints}"
                    
            clauses.append(reg_str)
            
    if not clauses:
        return None
        
    return ". ".join(clauses) + "."
