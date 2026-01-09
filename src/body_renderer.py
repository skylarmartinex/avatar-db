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
    Format: "<part>: <emphasis> emphasis, <definition>, <size> size, <shape> (notes if present)."
    """
    if not bc or not bc.get("enabled", False):
        return None
        
    test_mode = bc.get("test_mode", {})
    single_only = test_mode.get("single_component_only", True)
    active_comp = test_mode.get("active_component", "glutes")
    components = bc.get("components", {})
    global_constraints = bc.get("constraints", [])
    
    comp_clauses = []
    
    # Decide which components to render
    target_keys = [active_comp] if (single_only and active_comp) else components.keys()
    
    # Safety constraints map
    safety_map = {
        "glutes": "natural proportions, no exaggerated BBL",
        "breasts": "natural proportions, no exaggerated cleavage"
    }
    
    for k in target_keys:
        comp = components.get(k)
        if not comp or not comp.get("enabled", False):
            # In single mode, the user might want to see the active one even if it's not "enabled" 
            # but usually 'enabled' reflects the UI switch.
            continue
            
        emphasis = comp.get("emphasis", "Off")
        if emphasis == "Off" and not single_only:
            continue
            
        definition = comp.get("definition", "Defined")
        size = comp.get("size", "Athletic")
        shape = comp.get("shape", "")
        notes = comp.get("notes", "")
        
        # Build component string
        if k == "abs" and definition == "Shredded" and emphasis == "High":
            comp_str = f"{k}: competition-lean abs with deep etched separations, sharply visible obliques and serratus lines; no smoothness, no softness"
        elif k == "breasts" and size == "Full" and emphasis == "High":
             comp_str = f"{k}: noticeably fuller bust with clear volume and projection, intentionally contrasted against the lean athletic frame; natural proportions"
        else:
            c_parts = []
            c_parts.append(f"{emphasis.lower()} emphasis")
            c_parts.append(definition.lower())
            c_parts.append(f"{size.lower()} size")
            if shape:
                c_parts.append(shape.lower())
            if notes:
                c_parts.append(f"({notes.lower()})")
                
            comp_str = f"{k}: {', '.join(c_parts)}"
        
        # Add safety constraints for specific parts
        if k in safety_map:
            comp_str += f"; {safety_map[k]}"
            
        comp_clauses.append(comp_str)
                
    if not comp_clauses:
        return None
        
    res = f"Body components: {'; '.join(comp_clauses)}"
    
    # CONTRAST RULE: If breasts are enabled, add a Top-Level Proportions clause 
    # to prevent shredded cues from averaging volume downward.
    if components.get("breasts", {}).get("enabled"):
        res += ". Body proportions: athletic lean frame with a noticeably fuller bust for strong contrast."
    
    if global_constraints:
        res += f". {'; '.join(global_constraints)}."
            
    return res
