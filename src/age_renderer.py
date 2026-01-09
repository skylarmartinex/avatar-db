from typing import Dict, Any, Optional

def render_age_clause(subject_data: Dict[str, Any]) -> Optional[str]:
    """
    Renders the youth profile clause based on subject.age_profile and subject.age_cues.
    """
    if "age_profile" not in subject_data:
        return None
        
    age_profile = subject_data.get("age_profile")
    cues = subject_data.get("age_cues", {})
    
    if not cues or not cues.get("enabled", True):
        return None
        
    parts = []
    parts.append(f"Youth profile: {age_profile.lower()}")
    
    # Add face youthfulness
    if "face_youthfulness" in cues:
        parts.append(cues["face_youthfulness"].lower())
        
    # Add eye area
    if "eye_area" in cues:
        parts.append(cues["eye_area"].lower())
        
    # Add age markers
    if "age_markers" in cues:
        parts.append(cues["age_markers"].lower())
        
    # Add skin texture policy
    if "skin_texture_policy" in cues:
        parts.append(f"{cues['skin_texture_policy'].lower()}")
        
    # Add anti-gaunt guard
    if "anti_gaunt_guard" in cues:
        parts.append(cues["anti_gaunt_guard"].lower())
        
    if not parts:
        return None
        
    # Clean up and join
    # "Youth profile: early 20s; youthful facial fullness (no hollow cheeks), smooth under-eye area, minimal age markers; natural skin texture (not airbrushed)."
    
    # The requirement asks for a specific format. 
    # Let's refine the assembly to use semicolons and commas as requested.
    
    res = f"Youth profile: {age_profile.lower()}; "
    sub_parts = []
    
    if "face_youthfulness" in cues: sub_parts.append(cues["face_youthfulness"].lower())
    if "eye_area" in cues: sub_parts.append(cues["eye_area"].lower())
    if "age_markers" in cues: sub_parts.append(cues["age_markers"].lower())
    
    res += ", ".join(sub_parts)
    
    if "skin_texture_policy" in cues:
        res += f"; {cues['skin_texture_policy'].lower()}"
        
    if "anti_gaunt_guard" in cues:
        res += f"; {cues['anti_gaunt_guard'].lower()}"
        
    if "constraints" in cues:
        res += f"; constraints: {cues['constraints'].lower()}"
        
    return res.strip()
