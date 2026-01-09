import os
import json
from unittest.mock import patch, MagicMock
from src.builder import build_prompt

def test_body_components_skips_archetype_load():
    """
    Test that when body_components is enabled, the assembler does not 
    crash even if the body archetype file (Ripped Athletic) is missing.
    """
    
    overrides = {
        "body_components": {
            "enabled": True,
            "test_mode": {
                "single_component_only": True,
                "active_component": "glutes"
            },
            "components": {
                "glutes": {
                    "enabled": True,
                    "emphasis": "High",
                    "definition": "Defined",
                    "size": "Athletic",
                    "shape": "Round lifted (athletic)",
                    "notes": "test notes"
                }
            }
        }
    }
    
    # Mock load_json and get_component_path to avoid disk access
    with patch("src.builder.load_json") as mock_load:
        mock_load.return_value = {"mock": "data"}
        
        # We use 'Ripped Athletic' as the BT code
        # The core check is that BT should NOT be passed to load_json if body_components is enabled
        
        with patch("src.builder.get_component_path") as mock_get_path:
            mock_get_path.side_effect = lambda dim, code: f"fake/{dim}/{code}.json"
            
            result = build_prompt(
                fa="GOLD", bt="Ripped Athletic", et="GOLD", hr="GOLD", sc="GOLD", st="GOLD", v="01", r="01",
                overrides=overrides
            )
            
            # Verify load_json was NOT called for "BT"
            # It should have been called for BASE, PF, SC, ET, FA, HR, APPEARANCE, ST, NB
            # But NOT for BT
            
            # dims list in build_prompt includes "BT"
            # It iterates over zip(dims, codes)
            # if dim == "BT" and is_body_comp_enabled: continue (or append {})
            
            # Check all call arguments to load_json
            called_paths = [call.args[0] for call in mock_load.call_args_list]
            assert not any("fake/BT/" in p for p in called_paths), "BT should not be loaded when body_components enabled"
            print("Verified: BT load skipped via mock.")

    assert "canonical_id" in result
    
    # Read the generated prompt JSON
    with open(result["prompt_path"], "r") as f:
        prompt_json = json.load(f)
        
    rendered = prompt_json.get("metadata", {}).get("rendered_prompt", "")
    
    # It should have body components
    assert "Body components: glutes: high emphasis" in rendered
    
    # It should NOT have "Body profile: Ripped Athletic" 
    assert "Body profile: Ripped Athletic" not in rendered
    
    print("Test passed: Body components enabled, archetype load skipped (Mocked).")

if __name__ == "__main__":
    test_body_components_skips_archetype_load()
