"""
Test fixtures for the hair color system.
Demonstrates usage of hair color configurations with 4 acceptance criteria examples.
"""

import json
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.hair_color_renderer import render_hair_color_clause


# Example A: Espresso brunette + subtle caramel face-framing highlights
EXAMPLE_A_ESPRESSO_CARAMEL = {
    "enabled": True,
    "base_color": "Espresso brunette",
    "tone": "Neutral",
    "depth_level": "Dark",
    "highlights": {
        "enabled": True,
        "color": "Caramel",
        "placement": "Face-framing",
        "intensity": "Subtle"
    },
    "roots": {
        "enabled": False
    },
    "gradient": {
        "enabled": False
    },
    "gray_percentage": "None",
    "constraints": []
}

# Example B: Ash blonde + balayage to platinum with soft blend
EXAMPLE_B_ASH_BALAYAGE = {
    "enabled": True,
    "base_color": "Ash blonde",
    "tone": "Cool",
    "depth_level": "Light",
    "highlights": {
        "enabled": False
    },
    "roots": {
        "enabled": False
    },
    "gradient": {
        "enabled": True,
        "style": "Balayage",
        "from_color": "Ash blonde",
        "to_color": "Platinum blonde",
        "blend": "Soft blend"
    },
    "gray_percentage": "None",
    "constraints": []
}

# Example C: Jet black + no highlights + trace gray
EXAMPLE_C_JET_BLACK_GRAY = {
    "enabled": True,
    "base_color": "Jet black",
    "tone": "Neutral",
    "depth_level": "Jet",
    "highlights": {
        "enabled": False
    },
    "roots": {
        "enabled": False
    },
    "gradient": {
        "enabled": False
    },
    "gray_percentage": "Trace",
    "constraints": []
}

# Example D: Copper + bold money piece + sharp roots
EXAMPLE_D_COPPER_MONEY_PIECE = {
    "enabled": True,
    "base_color": "Copper",
    "tone": "Warm",
    "depth_level": "Medium",
    "highlights": {
        "enabled": True,
        "color": "Platinum blonde",
        "placement": "Money piece",
        "intensity": "Bold"
    },
    "roots": {
        "enabled": True,
        "color": "Dark brown",
        "softness": "Sharp"
    },
    "gradient": {
        "enabled": False
    },
    "gray_percentage": "None",
    "constraints": []
}


def test_hair_color_rendering():
    """Test hair color rendering with all four acceptance criteria examples."""
    
    print("=" * 80)
    print("HAIR COLOR SYSTEM TEST FIXTURES")
    print("=" * 80)
    print()
    
    # Test Example A
    print("Example A: Espresso Brunette + Caramel Highlights")
    print("-" * 80)
    print("Input JSON:")
    print(json.dumps(EXAMPLE_A_ESPRESSO_CARAMEL, indent=2))
    print()
    print("Rendered Output:")
    result_a = render_hair_color_clause(EXAMPLE_A_ESPRESSO_CARAMEL)
    print(result_a)
    print()
    print("Expected:")
    print("Hair color: espresso brunette (dark), neutral tone; subtle caramel face-framing highlights; color remains consistent across shots.")
    print()
    print()
    
    # Test Example B
    print("Example B: Ash Blonde Balayage")
    print("-" * 80)
    print("Input JSON:")
    print(json.dumps(EXAMPLE_B_ASH_BALAYAGE, indent=2))
    print()
    print("Rendered Output:")
    result_b = render_hair_color_clause(EXAMPLE_B_ASH_BALAYAGE)
    print(result_b)
    print()
    print("Expected:")
    print("Hair color: ash blonde (light), cool tone; balayage gradient from ash blonde to platinum blonde with soft blend; color remains consistent across shots.")
    print()
    print()
    
    # Test Example C
    print("Example C: Jet Black + Trace Gray")
    print("-" * 80)
    print("Input JSON:")
    print(json.dumps(EXAMPLE_C_JET_BLACK_GRAY, indent=2))
    print()
    print("Rendered Output:")
    result_c = render_hair_color_clause(EXAMPLE_C_JET_BLACK_GRAY)
    print(result_c)
    print()
    print("Expected:")
    print("Hair color: jet black (jet), neutral tone; trace gray; color remains consistent across shots.")
    print()
    print()
    
    # Test Example D
    print("Example D: Copper + Money Piece")
    print("-" * 80)
    print("Input JSON:")
    print(json.dumps(EXAMPLE_D_COPPER_MONEY_PIECE, indent=2))
    print()
    print("Rendered Output:")
    result_d = render_hair_color_clause(EXAMPLE_D_COPPER_MONEY_PIECE)
    print(result_d)
    print()
    print("Expected:")
    print("Hair color: copper (medium), warm tone; bold platinum blonde money piece highlights; sharp dark brown root contrast; color remains consistent across shots.")
    print()
    print()
    
    print("=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    test_hair_color_rendering()
