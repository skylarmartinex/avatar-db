from typing import Dict, Any, Optional, List

def render_body_clause(body_data: Dict[str, Any]) -> Optional[str]:
    """
    Renders the body clause based on body.profile, body.global and body.regions.
    (Body Blueprint system - Legacy/Internal)
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
    Renders the Body Components clause (Pure Components architecture).
    Composes body part attributes without archetypes or presets.
    """
    if not bc or not bc.get("enabled", False):
        return None
        
    test_mode = bc.get("test_mode", {})
    single_only = test_mode.get("single_component_only", True)
    active_comp = test_mode.get("active_component", "glutes")
    components = bc.get("components", {})
    constraints = bc.get("constraints", [])
    
    comp_clauses = []
    
    # Render ONLY enabled components (or only active in single_only mode)
    target_keys = [active_comp] if (single_only and active_comp) else components.keys()
    
    for k in target_keys:
        comp = components.get(k)
        if not comp:
            continue
            
        emphasis = comp.get("emphasis", "Off")
        if emphasis == "Off" and not (single_only and k == active_comp): 
            # In non-single mode, "Off" means don't render. 
            # In single mode, we render the active one even if "Off" to show it's selected, 
            # but usually it'll be enabled.
            continue
            
        definition = comp.get("definition", "Defined")
        size = comp.get("size", "Athletic")
        notes = comp.get("notes", "")
        
        # Build component string: glutes—high emphasis, defined, athletic size (round/lifted; natural proportions)
        c_parts = []
        c_parts.append(f"{emphasis.lower()} emphasis")
        c_parts.append(definition.lower())
        c_parts.append(f"{size.lower()} size")
        if notes:
            c_parts.append(f"({notes.lower()})")
            
        comp_clauses.append(f"{k}—{', '.join(c_parts)}")
                
    if not comp_clauses:
        return None
        
    res = f"Body components: {', '.join(comp_clauses)}"
    
    if constraints:
        if isinstance(constraints, list):
            res += f". {'; '.join(constraints)}."
        else:
            res += f". {constraints}."
            
    return res
