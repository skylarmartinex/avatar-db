import os
import json
import sys
from typing import Dict, Any, List
from .utils import load_json
from .registry import get_all_codes, get_component_path

ALLOWED_TOP_LEVEL_KEYS = {
    "setting", "viewing_angle", "subject", "lighting", "skin", "clothing", 
    "pose", "surrounding", "aspect_ratio", "composition", "image_quality", 
    "overall_mood", "negative_prompt", "camera", "global_mood", 
    "posture_anchor", "framing_anchor"
}

BOUNDARY_RULES = {
    "BASE": ["camera", "lighting", "composition", "image_quality", "global_mood"],
    "PF": ["posture_anchor", "framing_anchor", "subject", "pose", "composition", "viewing_angle", "setting"],
    "PH_REGION": ["subject", "skin"],
    "VN_REGION": ["subject", "skin"],
    "FA": ["subject"],
    "BT": ["subject"],
    "HR": ["subject"],
    "ET": ["subject", "skin"],
    "SC": ["setting", "lighting", "clothing", "pose", "surrounding", "overall_mood", "composition", "aspect_ratio", "image_quality", "subject"],
    "ST": ["setting", "lighting", "clothing", "pose", "surrounding", "overall_mood", "composition", "aspect_ratio", "image_quality", "subject"],
    "NB": ["negative_prompt"]
}

PROHIBITED_STYLE_SUBKEYS = ["facial_features", "face_anchor", "do_not_change"]

def validate_component(dim: str, code: str, content: Dict[str, Any]) -> List[str]:
    errors = []
    # Top level keys
    for key in content.keys():
        if key not in ALLOWED_TOP_LEVEL_KEYS:
            errors.append(f"[{dim}-{code}] Invalid top-level key: {key}")

    # Boundary rules
    allowed_keys = BOUNDARY_RULES.get(dim, [])
    for key in content.keys():
        if key not in allowed_keys:
            errors.append(f"[{dim}-{code}] Dimension {dim} not allowed to write to top-level key: {key}")

    # Style boundary check
    if dim in ["SC", "ST"]:
        if "subject" in content:
            for subkey in content["subject"].keys():
                if subkey in PROHIBITED_STYLE_SUBKEYS:
                    errors.append(f"[{dim}-{code}] Style dimension {dim} prohibited from writing to subject.{subkey}")

    # Required keys
    if dim == "FA":
        subject = content.get("subject", {})
        if "face_anchor" not in subject:
            errors.append(f"[{dim}-{code}] Missing required key: subject.face_anchor")
        if "do_not_change" not in subject:
            errors.append(f"[{dim}-{code}] Missing required key: subject.do_not_change")
    
    if dim == "NB":
        if "negative_prompt" not in content:
            errors.append(f"[{dim}-{code}] Missing required key: negative_prompt")

    # Ethnicity neutral check for FA
    if dim == "FA":
        ethnicity_keywords = ["Filipina", "Filipino", "Vietnamese", "Korean", "Japanese", "Chinese", "Thai", "Asian", "Caucasian", "Black", "Hispanic", "Latina", "Latino"]
        content_str = json.dumps(content).lower()
        for kw in ethnicity_keywords:
            if kw.lower() in content_str:
                errors.append(f"[{dim}-{code}] FA module must be ethnicity-neutral. Found term: {kw}")

    return errors

def run_lint():
    codes = get_all_codes()
    all_errors = []
    
    # Lint registry and components
    for dim, code_map in codes.items():
        for code, meta in code_map.items():
            # Check registry metadata for FA
            if dim == "FA":
                ethnicity_keywords = ["Filipina", "Filipino", "Vietnamese", "Korean", "Japanese", "Chinese", "Thai", "Asian", "Caucasian", "Black", "Hispanic", "Latina", "Latino"]
                meta_str = json.dumps(meta).lower()
                for kw in ethnicity_keywords:
                    if kw.lower() in meta_str:
                        all_errors.append(f"Registry ERROR [{dim}-{code}]: Metadata must be ethnicity-neutral. Found term: {kw}")

            path = get_component_path(dim, code)
            try:
                content = load_json(path)
                errors = validate_component(dim, code, content)
                all_errors.extend(errors)
            except Exception as e:
                all_errors.append(f"Failed to load {path}: {e}")

    # Lint bundles/packs? (Optional based on requirements, but let's stick to core)
    
    if all_errors:
        for err in all_errors:
            print(f"ERROR: {err}")
        return 1
    else:
        print("Lint passed!")
        return 0
