"""
Test fixtures for the skin tone system.
Demonstrates usage of skin tone configurations with 4 acceptance criteria examples.
"""

import json
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.skin_tone_renderer import render_skin_tone_clause


# Example A: Light-medium + Warm + Natural finish, minimal blemishes
EXAMPLE_A_LIGHT_MEDIUM_WARM = {
    "enabled": True,
    "base": "Light-medium",
    "undertone": "Warm",
    "depth_level": "Light",
    "tanning": "None",
    "freckles": {
        "enabled": False
    },
    "complexion_finish": "Natural",
    "blemish_policy": "Minimal",
    "consistency_guards": {
        "lock_skin_tone": True,
        "avoid_color_shift_from_lighting": True
    },
    "constraints": [
        "Avoid unnatural orange tint"
    ]
}

# Example B: Medium-tan + Olive + Dewy finish, no freckles
EXAMPLE_B_MEDIUM_TAN_OLIVE = {
    "enabled": True,
    "base": "Medium-tan",
    "undertone": "Olive",
    "depth_level": "Tan",
    "tanning": "None",
    "freckles": {
        "enabled": False
    },
    "complexion_finish": "Dewy",
    "blemish_policy": "Minimal",
    "consistency_guards": {
        "lock_skin_tone": True,
        "avoid_color_shift_from_lighting": True
    },
    "constraints": []
}

# Example C: Porcelain + Cool + Matte finish, sparse subtle freckles
EXAMPLE_C_PORCELAIN_COOL = {
    "enabled": True,
    "base": "Porcelain",
    "undertone": "Cool",
    "depth_level": "Very fair",
    "tanning": "None",
    "freckles": {
        "enabled": True,
        "density": "Sparse",
        "visibility": "Subtle"
    },
    "complexion_finish": "Matte",
    "blemish_policy": "Minimal",
    "consistency_guards": {
        "lock_skin_tone": True,
        "avoid_color_shift_from_lighting": True
    },
    "constraints": []
}

# Example D: Deep + Neutral + Natural finish, realistic blemish policy
EXAMPLE_D_DEEP_NEUTRAL = {
    "enabled": True,
    "base": "Deep",
    "undertone": "Neutral",
    "depth_level": "Deep",
    "tanning": "None",
    "freckles": {
        "enabled": False
    },
    "complexion_finish": "Natural",
    "blemish_policy": "Realistic",
    "consistency_guards": {
        "lock_skin_tone": True,
        "avoid_color_shift_from_lighting": True
    },
    "constraints": []
}


def test_skin_tone_rendering():
    """Test skin tone rendering with all four acceptance criteria examples."""
    
    print("=" * 80)
    print("SKIN TONE SYSTEM TEST FIXTURES")
    print("=" * 80)
    print()
    
    # Test Example A
    print("Example A: Light-Medium Warm")
    print("-" * 80)
    print("Input JSON:")
    print(json.dumps(EXAMPLE_A_LIGHT_MEDIUM_WARM, indent=2))
    print()
    print("Rendered Output:")
    result_a = render_skin_tone_clause(EXAMPLE_A_LIGHT_MEDIUM_WARM)
    print(result_a)
    print()
    print("Expected:")
    print("Skin tone: light-medium (light), warm undertone; natural finish; minimal blemishes; skin tone remains consistent across shots; avoid lighting-induced color shift; avoid unnatural orange tint.")
    print()
    print()
    
    # Test Example B
    print("Example B: Medium-Tan Olive")
    print("-" * 80)
    print("Input JSON:")
    print(json.dumps(EXAMPLE_B_MEDIUM_TAN_OLIVE, indent=2))
    print()
    print("Rendered Output:")
    result_b = render_skin_tone_clause(EXAMPLE_B_MEDIUM_TAN_OLIVE)
    print(result_b)
    print()
    print("Expected:")
    print("Skin tone: medium-tan (tan), olive undertone; dewy finish; minimal blemishes; skin tone remains consistent across shots; avoid lighting-induced color shift.")
    print()
    print()
    
    # Test Example C
    print("Example C: Porcelain Cool")
    print("-" * 80)
    print("Input JSON:")
    print(json.dumps(EXAMPLE_C_PORCELAIN_COOL, indent=2))
    print()
    print("Rendered Output:")
    result_c = render_skin_tone_clause(EXAMPLE_C_PORCELAIN_COOL)
    print(result_c)
    print()
    print("Expected:")
    print("Skin tone: porcelain (very fair), cool undertone; matte finish; sparse subtle freckles; minimal blemishes; skin tone remains consistent across shots; avoid lighting-induced color shift.")
    print()
    print()
    
    # Test Example D
    print("Example D: Deep Neutral")
    print("-" * 80)
    print("Input JSON:")
    print(json.dumps(EXAMPLE_D_DEEP_NEUTRAL, indent=2))
    print()
    print("Rendered Output:")
    result_d = render_skin_tone_clause(EXAMPLE_D_DEEP_NEUTRAL)
    print(result_d)
    print()
    print("Expected:")
    print("Skin tone: deep (deep), neutral undertone; natural finish; realistic complexion detail; skin tone remains consistent across shots; avoid lighting-induced color shift.")
    print()
    print()
    
    print("=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    test_skin_tone_rendering()
