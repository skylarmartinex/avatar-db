"""
Skin tone rendering module for Avatar JSON prompts.
Converts structured skin tone data into natural-language prompt clauses.
Separate from body/physique, hair structure, and hair color.
"""

from typing import Dict, Any, Optional


def render_skin_tone_clause(skin_tone_data: Dict[str, Any]) -> Optional[str]:
    """
    Renders a skin_tone object into a compact, stable natural-language clause.
    
    This is separate from body/physique and focuses only on skin appearance.
    The output is lighting-agnostic and uses consistent identity tokens.
    Skin tone remains stable regardless of lighting conditions.
    
    Args:
        skin_tone_data: Dictionary containing skin tone configuration
        
    Returns:
        Natural-language skin tone description string, or None if disabled
        
    Example:
        >>> skin_tone = {
        ...     "base": "Light-medium",
        ...     "depth_level": "Light",
        ...     "undertone": "Warm",
        ...     "complexion_finish": "Natural",
        ...     "blemish_policy": "Minimal"
        ... }
        >>> render_skin_tone_clause(skin_tone)
        'Skin tone: light-medium (light), warm undertone; natural finish; minimal blemishes; skin tone remains consistent across shots; avoid unnatural orange tint.'
    """
    
    # Check if skin tone is enabled (default True for backward compatibility)
    if not skin_tone_data.get("enabled", True):
        return None
    
    # Extract base fields (with defaults)
    base = skin_tone_data.get("base", "Medium")
    depth_level = skin_tone_data.get("depth_level")
    undertone = skin_tone_data.get("undertone", "Neutral")
    tanning = skin_tone_data.get("tanning")
    complexion_finish = skin_tone_data.get("complexion_finish", "Natural")
    blemish_policy = skin_tone_data.get("blemish_policy", "Minimal")
    constraints = skin_tone_data.get("constraints", [])
    
    # Extract optional sub-objects
    freckles = skin_tone_data.get("freckles", {})
    consistency_guards = skin_tone_data.get("consistency_guards", {})
    
    # Build clause components
    parts = []
    
    # 1. Base + depth level
    base_part = base.lower()
    if depth_level:
        base_part += f" ({depth_level.lower()})"
    parts.append(f"Skin tone: {base_part}")
    
    # 2. Undertone
    if undertone:
        parts.append(f"{undertone.lower()} undertone")
    
    # Join base parts with comma
    clause = ", ".join(parts)
    
    # Now add semicolon-separated sections
    sections = []
    
    # 3. Tanning (if present)
    if tanning and tanning.lower() != "none":
        sections.append(tanning.lower())
    
    # 4. Complexion finish
    if complexion_finish:
        sections.append(f"{complexion_finish.lower()} finish")
    
    # 5. Freckles (if enabled)
    if freckles.get("enabled", False):
        freckle_parts = []
        
        density = freckles.get("density", "").lower()
        visibility = freckles.get("visibility", "").lower()
        
        if density:
            freckle_parts.append(density)
        if visibility:
            freckle_parts.append(visibility)
        
        freckle_parts.append("freckles")
        sections.append(" ".join(freckle_parts))
    
    # 6. Blemish policy
    if blemish_policy:
        if blemish_policy.lower() == "none":
            sections.append("flawless complexion")
        elif blemish_policy.lower() == "realistic":
            sections.append("realistic complexion detail")
        elif blemish_policy.lower() == "minimal":
            sections.append("minimal blemishes")
        elif blemish_policy.lower() == "airbrushed":
            sections.append("airbrushed finish")
    
    # Add sections to clause
    if sections:
        clause += "; " + "; ".join(sections)
    
    # 7. Consistency guard (always included)
    clause += "; skin tone remains consistent across shots"
    
    # Check consistency guards for additional instructions
    lock_skin_tone = consistency_guards.get("lock_skin_tone", True)
    avoid_color_shift = consistency_guards.get("avoid_color_shift_from_lighting", True)
    
    if avoid_color_shift:
        clause += "; avoid lighting-induced color shift"
    
    # 8. Constraints (as brief negatives)
    if constraints:
        constraint_text = "; ".join(c.lower() for c in constraints)
        clause += f"; {constraint_text}"
    
    # Final period
    clause += "."
    
    return clause


def render_skin_tone_from_appearance(appearance_data: Dict[str, Any]) -> Optional[str]:
    """
    Renders skin tone clause from an appearance object (backward compatible).
    
    Args:
        appearance_data: Dictionary containing appearance information
        
    Returns:
        Natural-language skin tone description or None
    """
    if "skin_tone" not in appearance_data:
        return None
    
    skin_tone_data = appearance_data["skin_tone"]
    
    # Check if this is the structured format
    if isinstance(skin_tone_data, dict):
        return render_skin_tone_clause(skin_tone_data)
    
    return None
