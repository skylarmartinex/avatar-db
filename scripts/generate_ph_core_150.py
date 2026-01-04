#!/usr/bin/env python3
"""
Generate the PH Core 150 combinatorial set.
Filipina-only prompts with regional variation.
"""

import os
import sys
import csv
from datetime import datetime
from itertools import product

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.builder import build_prompt

# Combinatorial parameters
REGIONS = ["ILOCOS", "TAGALOG", "BICOL", "VISAYAS", "MINDANAO", "BANGSAMORO"]
FACE_ARCHETYPES = ["SG-A", "MB-A", "EM-A", "RS-A", "FD-A"]
BODY_TYPES = ["FR", "AL", "CF", "SM", "SC"]
HAIR = "ST"
SCENE = "JUNGLE"
OUTFIT = "POCA"
ETHNICITY = "PH"
VERSION = "01"

def main():
    print("=" * 80)
    print("PH CORE 150 - Filipina Regional Combinatorial Set")
    print("=" * 80)
    print()
    
    # Create manifests directory
    manifests_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "builds", "manifests")
    os.makedirs(manifests_dir, exist_ok=True)
    
    # CSV output
    csv_path = os.path.join(manifests_dir, "ph_core_150_v01.csv")
    
    results = []
    skipped = []
    
    # Generate all combinations
    combinations = list(product(REGIONS, FACE_ARCHETYPES, BODY_TYPES))
    total = len(combinations)
    
    print(f"Generating {total} combinations...")
    print(f"  Regions: {len(REGIONS)}")
    print(f"  Face Archetypes: {len(FACE_ARCHETYPES)}")
    print(f"  Body Types: {len(BODY_TYPES)}")
    print(f"  Hair: {HAIR}")
    print(f"  Scene: {SCENE}")
    print(f"  Outfit: {OUTFIT}")
    print()
    
    for idx, (region, fa, bt) in enumerate(combinations, 1):
        try:
            result = build_prompt(
                fa=fa,
                bt=bt,
                et=ETHNICITY,
                hr=HAIR,
                sc=SCENE,
                st=OUTFIT,
                v=VERSION,
                r="01",
                ph_region=region
            )
            
            results.append({
                "canonical_id": result["canonical_id"],
                "ET": ETHNICITY,
                "PH_REGION": region,
                "FA": fa,
                "BT": bt,
                "HR": HAIR,
                "SC": SCENE,
                "ST": OUTFIT,
                "v": VERSION,
                "created_at": datetime.now().isoformat()
            })
            
            if idx % 10 == 0:
                print(f"  Progress: {idx}/{total} ({idx/total*100:.1f}%)")
                
        except Exception as e:
            skipped.append({
                "region": region,
                "fa": fa,
                "bt": bt,
                "error": str(e)
            })
            print(f"  ⚠️  Skipped {region}/{fa}/{bt}: {e}")
    
    # Write CSV manifest
    if results:
        with open(csv_path, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=[
                "canonical_id", "ET", "PH_REGION", "FA", "BT", "HR", "SC", "ST", "v", "created_at"
            ])
            writer.writeheader()
            writer.writerows(results)
    
    # Print summary
    print()
    print("=" * 80)
    print("GENERATION COMPLETE")
    print("=" * 80)
    print(f"✅ Prompts written: {len(results)}")
    print(f"⚠️  Skipped: {len(skipped)}")
    print(f"📄 Manifest: {csv_path}")
    print()
    
    if skipped:
        print("Skipped combinations:")
        for skip in skipped[:10]:  # Show first 10
            print(f"  - {skip['region']}/{skip['fa']}/{skip['bt']}: {skip['error']}")
        if len(skipped) > 10:
            print(f"  ... and {len(skipped) - 10} more")
        print()
    
    if results:
        print("Example canonical IDs (first 5):")
        for r in results[:5]:
            print(f"  {r['canonical_id']}")
        print()
        
        print("Example canonical IDs (last 5):")
        for r in results[-5:]:
            print(f"  {r['canonical_id']}")
        print()
    
    print(f"Total prompts generated: {len(results)}/{total}")
    print()

if __name__ == "__main__":
    main()
