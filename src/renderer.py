from .hair_color_renderer import render_hair_color_from_appearance
from .skin_tone_renderer import render_skin_tone_from_appearance
from .age_renderer import render_age_clause
from .body_renderer import render_body_clause

def render_final_prompt(prompt_json: Dict[str, Any]) -> str:
    """
    Renders the full natural-language prompt from the merged JSON.
    This combines the foundation (from base/scene/face/body) with the 
    modular appearance clauses (skin tone, hair structure, hair color, age).
    """
    clauses = []
    
    # 1. Body Blueprint (Newly Added)
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
        
    # 2. Age Profile
    subject = prompt_json.get("subject", {})
    age_clause = render_age_clause(subject)
    if age_clause:
        clauses.append(age_clause)
        
    # 3. Skin Tone (Modular Appearance)
    appearance = prompt_json.get("appearance", {})
    skin_clause = render_skin_tone_from_appearance(appearance)
    if skin_clause:
        clauses.append(skin_clause)
        
    # 4. Hair Structure (Modular Subject)
    hair_data = subject.get("hair", {})
    hair_clause = render_hair_clause(hair_data)
    if hair_clause:
        clauses.append(hair_clause)
        
    # 5. Hair Color (Modular Appearance)
    hair_color_clause = render_hair_color_from_appearance(appearance)
    if hair_color_clause:
        clauses.append(hair_color_clause)
        
    # 6. Scene/Background
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
    
    enriched["metadata"]["clauses"] = {
        "skin_tone": render_skin_tone_from_appearance(appearance),
        "hair_structure": render_hair_clause(subject.get("hair", {})),
        "hair_color": render_hair_color_from_appearance(appearance),
        "age_profile": render_age_clause(subject),
        "body": render_body_clause(enriched.get("body", {}))
    }
    
    return enriched
