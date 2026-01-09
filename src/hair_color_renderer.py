"""
Hair color rendering module for Avatar JSON prompts.
Converts structured hair color data into natural-language prompt clauses.
Separate from hair structure (preset/texture/length/style).
"""

from typing import Dict, Any, Optional


def render_hair_color_clause(hair_color_data: Dict[str, Any]) -> Optional[str]:
    """
    Renders a hair_color object into a compact, stable natural-language clause.
    
    This is separate from hair structure and focuses only on color/appearance.
    The output is lighting-agnostic and uses consistent identity tokens.
    
    Args:
        hair_color_data: Dictionary containing hair color configuration
        
    Returns:
        Natural-language hair color description string, or None if disabled
        
    Example:
        >>> hair_color = {
        ...     "base_color": "Espresso brunette",
        ...     "depth_level": "Dark",
        ...     "tone": "Neutral",
        ...     "highlights": {
        ...         "enabled": True,
        ...         "color": "Caramel",
        ...         "placement": "Face-framing",
        ...         "intensity": "Subtle"
        ...     }
        ... }
        >>> render_hair_color_clause(hair_color)
        'Hair color: espresso brunette (dark), neutral tone; subtle caramel face-framing highlights; color remains consistent across shots.'
    """
    
    # Check if hair color is enabled (default True for backward compatibility)
    if not hair_color_data.get("enabled", True):
        return None
    
    # Extract base color (required if enabled)
    base_color = hair_color_data.get("base_color", "Espresso brunette")
    depth_level = hair_color_data.get("depth_level")
    tone = hair_color_data.get("tone")
    gray_percentage = hair_color_data.get("gray_percentage")
    constraints = hair_color_data.get("constraints", [])
    
    # Extract optional sub-objects
    highlights = hair_color_data.get("highlights", {})
    roots = hair_color_data.get("roots", {})
    gradient = hair_color_data.get("gradient", {})
    
    # Build clause components
    parts = []
    
    # 1. Base color + depth level
    base_part = base_color.lower()
    if depth_level:
        base_part += f" ({depth_level.lower()})"
    parts.append(f"Hair color: {base_part}")
    
    # 2. Tone
    if tone:
        parts.append(f"{tone.lower()} tone")
    
    # Join base parts with comma
    clause = ", ".join(parts)
    
    # Now add semicolon-separated sections
    sections = []
    
    # 3. Highlights (if enabled)
    if highlights.get("enabled", False):
        highlight_parts = []
        
        intensity = highlights.get("intensity", "").lower()
        color = highlights.get("color", "").lower()
        placement = highlights.get("placement", "").lower()
        
        if intensity:
            highlight_parts.append(intensity)
        if color:
            highlight_parts.append(color)
        if placement:
            highlight_parts.append(placement)
        
        highlight_parts.append("highlights")
        sections.append(" ".join(highlight_parts))
    
    # 4. Roots (if enabled)
    if roots.get("enabled", False):
        root_parts = []
        
        softness = roots.get("softness", "").lower()
        root_color = roots.get("color", "").lower()
        
        if softness:
            root_parts.append(softness)
        if root_color:
            root_parts.append(root_color)
        
        root_parts.append("root contrast" if root_color or softness else "roots")
        sections.append(" ".join(root_parts))
    
    # 5. Gradient (if enabled)
    if gradient.get("enabled", False):
        gradient_parts = []
        
        style = gradient.get("style", "").lower()
        from_color = gradient.get("from_color", "").lower()
        to_color = gradient.get("to_color", "").lower()
        blend = gradient.get("blend", "").lower()
        
        if style:
            gradient_parts.append(style)
        
        if from_color and to_color:
            gradient_parts.append(f"gradient from {from_color} to {to_color}")
        elif style:
            gradient_parts.append("gradient")
        
        if blend:
            gradient_parts.append(f"with {blend}")
        
        sections.append(" ".join(gradient_parts))
    
    # 6. Gray percentage
    if gray_percentage and gray_percentage.lower() != "none":
        gray_text = gray_percentage.lower()
        # Add "gray" suffix if not already present
        if "gray" not in gray_text and "grey" not in gray_text:
            gray_text += " gray"
        sections.append(gray_text)
    
    # Add sections to clause
    if sections:
        clause += "; " + "; ".join(sections)
    
    # 7. Consistency guard (always included)
    clause += "; color remains consistent across shots"
    
    # 8. Constraints (as brief negatives)
    if constraints:
        constraint_text = "; ".join(c.lower() for c in constraints)
        clause += f"; {constraint_text}"
    
    # Final period
    clause += "."
    
    return clause


def render_hair_color_from_appearance(appearance_data: Dict[str, Any]) -> Optional[str]:
    """
    Renders hair color clause from an appearance object (backward compatible).
    
    Args:
        appearance_data: Dictionary containing appearance information
        
    Returns:
        Natural-language hair color description or None
    """
    if "hair_color" not in appearance_data:
        return None
    
    hair_color_data = appearance_data["hair_color"]
    
    # Check if this is the structured format
    if isinstance(hair_color_data, dict):
        return render_hair_color_clause(hair_color_data)
    
    return None
