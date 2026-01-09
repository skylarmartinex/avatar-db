"""
Hair rendering module for Avatar JSON prompts.
Converts structured hair data into natural-language prompt clauses.
"""

from typing import Dict, Any, Optional


# Default texture mappings for presets
PRESET_TEXTURE_DEFAULTS = {
    "Classic Bombshell": "Loose beach waves",
    "Sleek Power Woman": "Pin-straight, glass-smooth",
    "Natural Curl Queen": "Spiral curls (3B–3C)",
    "Soft Girl Aesthetic": "Loose beach waves",
    "Editorial Wet Look": "Wet-look strands",
    "Protective Royalty": None,  # Texture optional for braids/locs
    "Playful Youth": "Loose beach waves",
    "Minimal Chic": "Pin-straight, glass-smooth"
}


def render_hair_clause(hair_data: Dict[str, Any]) -> Optional[str]:
    """
    Renders a hair object into a compact, high-signal natural-language clause.
    
    Args:
        hair_data: Dictionary containing hair configuration
        
    Returns:
        Natural-language hair description string, or None if hair is disabled
        
    Example:
        >>> hair = {
        ...     "preset": "Sleek Power Woman",
        ...     "length": "Medium",
        ...     "texture": "Pin-straight, glass-smooth",
        ...     "finish": "High-shine editorial",
        ...     "color": "Deep brunette"
        ... }
        >>> render_hair_clause(hair)
        'Hair: Sleek Power Woman, medium length blunt lob, pin-straight glass-smooth, down, sharp center part, high-shine editorial finish, deep brunette; consistent hair identity across shots; no flyaways.'
    """
    
    # Check if hair is enabled (default True for backward compatibility)
    if not hair_data.get("enabled", True):
        return None
    
    # Extract fields with defaults
    preset = hair_data.get("preset", "Minimal Chic")
    texture = hair_data.get("texture") or PRESET_TEXTURE_DEFAULTS.get(preset)
    length = hair_data.get("length", "").lower()
    style_mode = hair_data.get("style_mode", "Down").lower()
    part = hair_data.get("part", "").lower()
    bangs = hair_data.get("bangs", "None")
    finish = hair_data.get("finish", "").lower()
    color = hair_data.get("color")
    highlights = hair_data.get("highlights")
    constraints = hair_data.get("constraints", [])
    
    # Build clause components
    parts = []
    
    # 1. Preset (primary identity control)
    parts.append(f"Hair: {preset}")
    
    # 2. Length
    if length:
        parts.append(f"{length} length")
    
    # 3. Texture (if applicable)
    if texture:
        parts.append(texture.lower())
    
    # 4. Style mode
    if style_mode and style_mode != "down":
        parts.append(style_mode)
    
    # 5. Part/Bangs
    if part and part != "no visible part":
        parts.append(part)
    if bangs and bangs.lower() != "none":
        parts.append(bangs.lower())
    
    # 6. Finish
    if finish:
        parts.append(f"{finish} finish")
    
    # 7. Color/Highlights
    if color:
        parts.append(color.lower())
    if highlights:
        parts.append(highlights.lower())
    
    # Join main clause
    clause = ", ".join(parts)
    
    # 8. Add consistency guard
    clause += "; consistent hair identity across shots"
    
    # 9. Add constraints
    if constraints:
        constraint_text = "; ".join(c.lower() for c in constraints if c.lower() != "consistent hair identity across shots")
        if constraint_text:
            clause += f"; {constraint_text}"
    
    # Final period
    clause += "."
    
    return clause


def render_hair_from_subject(subject_data: Dict[str, Any]) -> Optional[str]:
    """
    Renders hair clause from a subject object (backward compatible).
    
    Supports both new structured format and legacy simple format.
    
    Args:
        subject_data: Dictionary containing subject information
        
    Returns:
        Natural-language hair description or None
    """
    if "hair" not in subject_data:
        return None
    
    hair_data = subject_data["hair"]
    
    # Check if this is the new structured format
    if isinstance(hair_data, dict) and "preset" in hair_data:
        return render_hair_clause(hair_data)
    
    # Legacy format: simple color/length/style
    if isinstance(hair_data, dict):
        # Build simple legacy clause
        color = hair_data.get("color", "")
        length = hair_data.get("length", "").lower()
        style = hair_data.get("style", "")
        
        if color or length or style:
            parts = []
            if color:
                parts.append(color.lower())
            if length:
                parts.append(f"{length} hair")
            if style:
                parts.append(style.lower())
            return f"Hair: {', '.join(parts)}."
    
    return None
