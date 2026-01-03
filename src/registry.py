import os
import json
from typing import Dict, List, Any

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REGISTRY_PATH = os.path.join(BASE_DIR, "registry", "codes.json")
COMPONENTS_DIR = os.path.join(BASE_DIR, "components")

def get_all_codes() -> Dict[str, List[str]]:
    if not os.path.exists(REGISTRY_PATH):
        return {}
    with open(REGISTRY_PATH, 'r') as f:
        return json.load(f)

def get_component_path(dim: str, code: str) -> str:
    folder_map = {
        "FA": "face",
        "BT": "body",
        "ET": "ethnicity",
        "HR": "hair",
        "SC": "scene",
        "ST": "outfit",
        "NB": "negative"
    }
    folder = folder_map.get(dim)
    if not folder:
        raise ValueError(f"Invalid dimension: {dim}")
    return os.path.join(COMPONENTS_DIR, folder, f"{code}.json")

def get_pack_path(type: str, code: str) -> str:
    if type == "SUB":
        return os.path.join(COMPONENTS_DIR, "packs", "subject", f"{code}.json")
    if type == "STY":
        return os.path.join(COMPONENTS_DIR, "packs", "style", f"{code}.json")
    raise ValueError(f"Invalid pack type: {type}")
