import json
import os
from typing import Any, Dict

def deep_merge(base: Dict[str, Any], update: Dict[str, Any]) -> Dict[str, Any]:
    """
    Recursively merges update into base.
    """
    for key, value in update.items():
        if isinstance(value, dict) and key in base and isinstance(base[key], dict):
            deep_merge(base[key], value)
        elif isinstance(value, list) and key in base and isinstance(base[key], list):
            # For lists, we extend or unique-extend.
            # Requirement says "later modules override earlier keys".
            # For lists, we'll replace or merge. Let's replace lists to follow "override" logic
            # unless it's specifically about adding to do_not_change.
            # Actually, standard deep merge usually replaces unless specified.
            # Let's replace for simplicity unless it's a dict.
            base[key] = value
        else:
            base[key] = value
    return base

def load_json(path: str) -> Dict[str, Any]:
    with open(path, 'r') as f:
        return json.load(f)

def save_json(path: str, data: Dict[str, Any]):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
