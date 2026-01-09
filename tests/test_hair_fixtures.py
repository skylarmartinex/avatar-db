"""
Test fixtures for the hair system.
Demonstrates usage of hair presets with example JSONs.
"""

import json
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.hair_renderer import render_hair_clause


# Example A: Sleek Power Woman (bob/lob)
EXAMPLE_A_SLEEK_POWER_WOMAN = {
    "enabled": True,
    "gender_presentation": "female",
    "preset": "Sleek Power Woman",
    "texture": "Pin-straight, glass-smooth",
    "length": "Medium",
    "style_mode": "Down",
    "part": "Center part",
    "bangs": "None",
    "finish": "High-shine editorial",
    "color": "Deep brunette",
    "highlights": None,
    "constraints": [
        "No flyaways",
        "Razor-sharp edges",
        "Consistent hair identity across shots"
    ]
}

# Example B: Natural Curl Queen (long curls)
EXAMPLE_B_NATURAL_CURL_QUEEN = {
    "enabled": True,
    "gender_presentation": "female",
    "preset": "Natural Curl Queen",
    "texture": "Spiral curls (3B–3C)",
    "length": "Long",
    "style_mode": "Down",
    "part": "No visible part",
    "bangs": "None",
    "finish": "Matte natural",
    "color": "Deep brunette",
    "highlights": None,
    "constraints": [
        "Curls remain defined",
        "Soft volume",
        "Consistent hair identity across shots"
    ]
}

# Example C: Protective Royalty (knotless braids)
EXAMPLE_C_PROTECTIVE_ROYALTY = {
    "enabled": True,
    "gender_presentation": "female",
    "preset": "Protective Royalty",
    "texture": None,
    "length": "Long",
    "style_mode": "Braids",
    "part": "No visible part",
    "bangs": "None",
    "finish": "Soft sheen",
    "color": "Jet black",
    "highlights": None,
    "constraints": [
        "Braids remain uniform",
        "Neat scalp sections",
        "Knotless box braids",
        "Consistent hair identity across shots"
    ]
}


def test_hair_rendering():
    """Test hair rendering with all three examples."""
    
    print("=" * 80)
    print("HAIR SYSTEM TEST FIXTURES")
    print("=" * 80)
    print()
    
    # Test Example A
    print("Example A: Sleek Power Woman")
    print("-" * 80)
    print("Input JSON:")
    print(json.dumps(EXAMPLE_A_SLEEK_POWER_WOMAN, indent=2))
    print()
    print("Rendered Output:")
    result_a = render_hair_clause(EXAMPLE_A_SLEEK_POWER_WOMAN)
    print(result_a)
    print()
    print("Expected:")
    print("Hair: Sleek Power Woman, medium length, pin-straight, glass-smooth, sharp center part, high-shine editorial finish, deep brunette; consistent hair identity across shots; no flyaways; razor-sharp edges.")
    print()
    print()
    
    # Test Example B
    print("Example B: Natural Curl Queen")
    print("-" * 80)
    print("Input JSON:")
    print(json.dumps(EXAMPLE_B_NATURAL_CURL_QUEEN, indent=2))
    print()
    print("Rendered Output:")
    result_b = render_hair_clause(EXAMPLE_B_NATURAL_CURL_QUEEN)
    print(result_b)
    print()
    print("Expected:")
    print("Hair: Natural Curl Queen, long, spiral curls (3b–3c) with defined ringlets, down, soft volume, matte-to-soft sheen; consistent hair identity across shots; curls remain defined.")
    print()
    print()
    
    # Test Example C
    print("Example C: Protective Royalty")
    print("-" * 80)
    print("Input JSON:")
    print(json.dumps(EXAMPLE_C_PROTECTIVE_ROYALTY, indent=2))
    print()
    print("Rendered Output:")
    result_c = render_hair_clause(EXAMPLE_C_PROTECTIVE_ROYALTY)
    print(result_c)
    print()
    print("Expected:")
    print("Hair: Protective Royalty, long knotless box braids, neat scalp sections, down, soft sheen; consistent hair identity across shots; braids remain uniform.")
    print()
    print()
    
    print("=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    test_hair_rendering()
