import csv
import os
from datetime import datetime
from typing import List, Dict, Any

def write_manifest(batch_name: str, build_results: List[Dict[str, Any]]):
    from .registry import BASE_DIR
    date_str = datetime.now().strftime("%Y-%m-%d")
    manifest_filename = f"{batch_name}__{date_str}.csv"
    manifest_path = os.path.join(BASE_DIR, "builds", "manifests", manifest_filename)
    
    # Columns: batch_id, output_id, run_id, prompt_version, FA, BT, ET, HR, SC, ST, prompt_json_path, run_json_path, image_path, rating, notes
    headers = [
        "batch_id", "output_id", "run_id", "prompt_version", 
        "FA", "BT", "ET", "HR", "SC", "ST", 
        "prompt_json_path", "run_json_path", "image_path", "rating", "notes"
    ]
    
    os.makedirs(os.path.dirname(manifest_path), exist_ok=True)
    
    with open(manifest_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        for res in build_results:
            meta = res["meta"]
            codes = meta["selection_codes"]
            writer.writerow({
                "batch_id": batch_name,
                "output_id": res["run_id"],
                "run_id": meta["run_id"],
                "prompt_version": meta["prompt_version"],
                "FA": codes["FA"],
                "BT": codes["BT"],
                "ET": codes["ET"],
                "HR": codes["HR"],
                "SC": codes["SC"],
                "ST": codes["ST"],
                "prompt_json_path": res["prompt_path"],
                "run_json_path": res["run_path"],
                "image_path": meta["image_path"],
                "rating": meta["rating"],
                "notes": meta["notes"]
            })
    return manifest_path
