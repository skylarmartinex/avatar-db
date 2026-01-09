from typing import Dict, Any, Optional, List

def render_body_clause(body_data: Dict[str, Any]) -> Optional[str]:
    """
    Renders the body clause based on body.profile, body.global and body.regions.
    (Body Blueprint system)
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

def render_body_components_clause(bc: Dict[str, Any]) -> Optional[str]:
    """
    Renders the body composition clause based on body_components.
    (Body Components system)
    """
    if not bc or bc.get("mode") != "components":
        return None
        
    baseline = bc.get("baseline_profile", "Ripped Athletic")
    test_mode = bc.get("test_mode", {})
    single_only = test_mode.get("single_component_only", True)
    active_comp = test_mode.get("active_component")
    components = bc.get("components", {})
    
    parts = [f"Body: {baseline.lower()}"]
    
    comp_clauses = []
    
    # Decide which components to render
    target_keys = [active_comp] if (single_only and active_comp) else components.keys()
    
    for k in target_keys:
        comp = components.get(k)
        if comp and comp.get("enabled"):
            preset = comp.get("preset")
            intensity = comp.get("intensity", "Standard")
            constraints = comp.get("constraints", [])
            
            if preset:
                c_str = f"{k}—{preset.lower()}, {intensity.lower()} intensity"
                if constraints:
                    if isinstance(constraints, list):
                        c_str += f"; {', '.join(constraints).lower()}"
                    else:
                        c_str += f"; {constraints.lower()}"
                comp_clauses.append(c_str)
                
    if comp_clauses:
        parts.append(f"components: {', '.join(comp_clauses)}")
        
    return "; ".join(parts)
