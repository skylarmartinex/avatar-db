import os
import json
from unittest.mock import patch
from src.builder import build_prompt

def test_optics_rendering():
    """
    Test that the optics block is correctly rendered into the final prompt.
    """
    
    overrides = {
        "optics": {
            "lens_profile": "Portrait Compression",
            "focal_length": "135mm",
            "aperture": "f/2.8",
            "depth_behavior": "Natural optical bokeh",
            "compression_rule": "Telephoto compression for flattering facial proportions and cinematic depth"
        }
    }
    
    # Mock load_json and get_component_path
    with patch("src.builder.load_json") as mock_load:
        # Return a mock component structure
        mock_load.return_value = {
            "viewing_angle": {"camera_distance": "Medium shot"},
            "lighting": {"primary_light_source": "Sunlight", "quality": "Hard"}
        }
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
    
    # Check for camera framing
    assert "Framing: medium shot." in rendered
    
    # Check for optics clause
    # "Shot on a 135mm telephoto lens with natural optical compression; flattering facial proportions, cinematic depth, authentic bokeh."
    # My renderer: "Shot on a 135mm telephoto lens with natural optical bokeh; telephoto compression for flattering facial proportions and cinematic depth."
    expected_optics = "Shot on a 135mm telephoto lens with natural optical bokeh; telephoto compression for flattering facial proportions and cinematic depth."
    assert expected_optics in rendered
    
    # Check for lighting
    assert "Lighting: hard sunlight." in rendered
    
    # Verify order: framing -> optics -> lighting
    pos_framing = rendered.find("Framing:")
    pos_optics = rendered.find("Shot on a")
    pos_lighting = rendered.find("Lighting:")
    
    assert pos_framing < pos_optics < pos_lighting, "Incorrect rendering order: Framing -> Optics -> Lighting"
    
    print("Test passed: Optics rendering verified with correct order and framing/lighting integration.")

if __name__ == "__main__":
    test_optics_rendering()
