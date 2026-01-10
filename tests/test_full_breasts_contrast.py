import os
import json
from unittest.mock import patch
from src.builder import build_prompt

def test_full_breasts_contrast_rule():
    """
    Test the CONTRAST RULE: 
    1) Assertive clause includes 'intentionally contrasted against the lean athletic frame'
    2) A top-level 'Body proportions' clause is added when breasts are enabled.
    """
    
    overrides = {
        "body_components": {
            "enabled": True,
            "test_mode": {
                "single_component_only": False 
            },
            "components": {
                "abs": {
                    "enabled": True,
                    "emphasis": "High",
                    "definition": "Shredded",
                    "size": "Athletic"
                },
                "breasts": {
                    "enabled": True,
                    "emphasis": "High",
                    "definition": "Toned",
                    "size": "Full",
                    "shape": "Natural athletic"
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
    
    # 1. Check the local assertive clause for breasts
    expected_breasts = "breasts: very large, visually dominant bust with clear volume and projection, intentionally contrasted against the lean athletic frame; natural proportions"
    assert expected_breasts in rendered
    
    # 2. Check the global contrast rule
    expected_proportions = "Body proportions: lean athletic frame with a deliberately oversized bust for strong contrast."
    assert expected_proportions in rendered
    
    # 3. Ensure shredded abs still render their clause (independence check)
    assert "competition-lean abs" in rendered
    
    print("Test passed: Contrast rule implemented and breasts scale independently of shredded abs.")

if __name__ == "__main__":
    test_full_breasts_contrast_rule()
