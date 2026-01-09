import os
import json
from unittest.mock import patch
from src.builder import build_prompt

def test_full_breasts_assertive_clause():
    """
    Test that when breasts are set to 'Full' with 'High' emphasis, 
    the assertive prominent bust clause is rendered instead of standard text.
    """
    
    overrides = {
        "body_components": {
            "enabled": True,
            "test_mode": {
                "single_component_only": True,
                "active_component": "breasts"
            },
            "components": {
                "breasts": {
                    "enabled": True,
                    "emphasis": "High",
                    "definition": "Toned",
                    "size": "Full",
                    "shape": "Natural athletic",
                    "notes": "test notes"
                }
            }
        }
    }
    
    # Mock load_json and get_component_path to avoid disk access
    with patch("src.builder.load_json") as mock_load:
        mock_load.return_value = {"mock": "data"}
        with patch("src.builder.get_component_path") as mock_get_path:
            mock_get_path.side_effect = lambda dim, code: f"fake/{dim}/{code}.json"
            
            result = build_prompt(
                fa="GOLD", bt="GOLD", et="GOLD", hr="GOLD", sc="GOLD", st="GOLD", v="01", r="01",
                overrides=overrides
            )
    
    # Read the generated prompt JSON
    with open(result["prompt_path"], "r") as f:
        prompt_json = json.load(f)
        
    rendered = prompt_json.get("metadata", {}).get("rendered_prompt", "")
    
    # Assert the assertive clause is present
    expected_clause = "breasts: prominent, full bust with natural weight and projection; clear cleavage; not subtle"
    assert expected_clause in rendered
    
    # Assert legacy definition language is NOT present for this specific configuration
    assert "high emphasis" not in rendered
    assert "full size" not in rendered
    
    # Assert safety constraint is still present
    assert "natural proportions, no exaggerated cleavage" in rendered
    
    print("Test passed: Full high-emphasis breasts render assertive clause.")

if __name__ == "__main__":
    test_full_breasts_assertive_clause()
