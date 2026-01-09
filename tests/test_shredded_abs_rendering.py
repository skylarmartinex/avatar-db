import os
import json
from unittest.mock import patch
from src.builder import build_prompt

def test_shredded_abs_assertive_clause():
    """
    Test that when abs are set to 'Shredded' with 'High' emphasis, 
    the assertive competition-lean clause is rendered instead of standard text.
    """
    
    overrides = {
        "body_components": {
            "enabled": True,
            "test_mode": {
                "single_component_only": True,
                "active_component": "abs"
            },
            "components": {
                "abs": {
                    "enabled": True,
                    "emphasis": "High",
                    "definition": "Shredded",
                    "size": "Athletic",
                    "shape": "Deep 6-pack",
                    "notes": "highly symmetric"
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
    expected_clause = "competition-lean abs with deep etched separations, sharply visible obliques and serratus lines; no smoothness, no softness"
    assert expected_clause in rendered
    
    # Assert legacy definition language is NOT present for this specific configuration
    assert "high emphasis" not in rendered
    assert "shredded" not in rendered  # (except as part of the clause if it were there, but we checked the clause)
    
    print("Test passed: Shredded high-emphasis abs render assertive clause.")

if __name__ == "__main__":
    test_shredded_abs_assertive_clause()
