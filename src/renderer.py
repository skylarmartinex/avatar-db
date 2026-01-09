from typing import Dict, Any, Optional, List
from .hair_color_renderer import render_hair_color_from_appearance
from .skin_tone_renderer import render_skin_tone_from_appearance
from .age_renderer import render_age_clause
from .body_renderer import render_body_clause, render_body_components_clause
from .hair_renderer import render_hair_clause

def render_viewing_angle_clause(va: Dict[str, Any]) -> Optional[str]:
    if not va: return None
    dist = va.get("camera_distance", "")
    if not dist: return None
    return f"Framing: {dist.lower()}."

def render_optics_clause(o: Dict[str, Any]) -> Optional[str]:
    if not o: return None
    fl = o.get("focal_length", "135mm")
    db = o.get("depth_behavior", "natural optical bokeh")
    cr = o.get("compression_rule", "telephoto compression")
    return f"Shot on a {fl} telephoto lens with {db.lower()}; {cr.lower()}."

def render_lighting_clause(l: Dict[str, Any]) -> Optional[str]:
    if not l: return None
    source = l.get("primary_light_source", "")
    quality = l.get("quality", "")
    if not source: return None
    return f"Lighting: {quality.lower()} {source.lower()}."

def render_final_prompt(prompt_json: Dict[str, Any]) -> str:
    """
    Renders the full natural-language prompt from the merged JSON.
    This combines the foundation (from base/scene/face/body) with the 
    modular appearance clauses (skin tone, hair structure, hair color, age).
    """
    clauses = []
    
    # 1. Body (Archetype/Base)
    body_data = prompt_json.get("body", {})
    body_clause = render_body_clause(body_data)
    if body_clause:
        clauses.append(body_clause)
    else:
        # Fallback to old build field if new body system not used
        subject = prompt_json.get("subject", {})
        build = subject.get("build", "")
        if build:
            clauses.append(build)
            
    # 2. Body Components (Additive Composition)
    body_components = prompt_json.get("body_components")
    body_components_clause = render_body_components_clause(body_components)
    if body_components_clause:
        clauses.append(body_components_clause)
        
    # 3. Age Profile
    subject = prompt_json.get("subject", {})
    age_clause = render_age_clause(subject)
    if age_clause:
        clauses.append(age_clause)
         
    # 4. Skin Tone (Modular Appearance)
    appearance = prompt_json.get("appearance", {})
    skin_clause = render_skin_tone_from_appearance(appearance)
    if skin_clause:
        clauses.append(skin_clause)
        
    # 5. Hair Structure (Modular Subject)
    hair_data = subject.get("hair", {})
    hair_clause = render_hair_clause(hair_data)
    if hair_clause:
        clauses.append(hair_clause)
        
    # 6. Hair Color (Modular Appearance)
    hair_color_clause = render_hair_color_from_appearance(appearance)
    if hair_color_clause:
        clauses.append(hair_color_clause)
        
    # 7. Camera & Optics (New Technical Layer)
    va = prompt_json.get("viewing_angle", {})
    va_clause = render_viewing_angle_clause(va)
    if va_clause:
        clauses.append(va_clause)
        
    optics = prompt_json.get("optics")
    optics_clause = render_optics_clause(optics)
    if optics_clause:
        clauses.append(optics_clause)
        
    # 8. Lighting
    lighting = prompt_json.get("lighting", {})
    lighting_clause = render_lighting_clause(lighting)
    if lighting_clause:
        clauses.append(lighting_clause)

    # 9. Scene/Background
    setting = prompt_json.get("setting", {})
    env = setting.get("environment", "")
    if env:
        clauses.append(f"Scene: {env}")
        
    return " ".join(clauses)

def enrich_prompt_with_renderings(prompt_json: Dict[str, Any]) -> Dict[str, Any]:
    """
    Adds rendered string fields to the prompt JSON for UI display.
    """
    # Create a copy to avoid mutating the original merged JSON
    enriched = prompt_json.copy()
    
    # Generate the final string
    final_prompt_string = render_final_prompt(enriched)
    
    # Add to a new 'metadata' or 'rendered' field
    if "metadata" not in enriched:
        enriched["metadata"] = {}
    
    enriched["metadata"]["rendered_prompt"] = final_prompt_string
    
    # Also add individual clauses for granular UI access
    appearance = enriched.get("appearance", {})
    subject = enriched.get("subject", {})
    
    bc_clause = render_body_components_clause(enriched.get("body_components"))
    base_body = render_body_clause(enriched.get("body", {}))
    
    enriched["metadata"]["clauses"] = {
        "skin_tone": render_skin_tone_from_appearance(appearance),
        "hair_structure": render_hair_clause(subject.get("hair", {})),
        "hair_color": render_hair_color_from_appearance(appearance),
        "age_profile": render_age_clause(subject),
        "body": f"{base_body or ''} {bc_clause or ''}".strip()
    }
    
    return enriched
