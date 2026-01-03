import argparse
import sys
import json
from .lint import run_lint
from .registry import get_all_codes, get_pack_path
from .utils import load_json
from .builder import build_prompt
from .manifest import write_manifest
from .presets import face_pass

def main():
    parser = argparse.ArgumentParser(prog="avatar-db")
    subparsers = parser.add_subparsers(dest="command")

    # Lint
    subparsers.add_parser("lint")

    # List
    list_parser = subparsers.add_parser("list")
    list_parser.add_argument("dim", help="Dimension to list (FA, BT, etc.)")

    # Build
    build_parser = subparsers.add_parser("build")
    build_parser.add_argument("--FA", required=True)
    build_parser.add_argument("--BT", required=True)
    build_parser.add_argument("--ET", required=True)
    build_parser.add_argument("--HR", required=True)
    build_parser.add_argument("--SC", required=True)
    build_parser.add_argument("--ST", required=True)
    build_parser.add_argument("--v", required=True)
    build_parser.add_argument("--r", required=True)

    # Build Pack
    pack_parser = subparsers.add_parser("build-pack")
    pack_parser.add_argument("--SUB", required=True)
    pack_parser.add_argument("--STY", required=True)
    pack_parser.add_argument("--v", required=True)
    pack_parser.add_argument("--r", required=True)

    # Batch
    batch_parser = subparsers.add_parser("batch")
    batch_parser.add_argument("--grid")
    batch_parser.add_argument("--preset")
    batch_parser.add_argument("--v", required=True)
    batch_parser.add_argument("--runs", type=int, default=1)
    batch_parser.add_argument("--batch_name", required=True)

    args = parser.parse_args()

    if args.command == "lint":
        sys.exit(run_lint())

    elif args.command == "list":
        codes = get_all_codes()
        if args.dim in codes:
            for code in codes[args.dim]:
                print(code)
        else:
            print(f"Unknown dimension: {args.dim}")

    elif args.command == "build":
        res = build_prompt(
            fa=args.FA, bt=args.BT, et=args.ET, hr=args.HR, 
            sc=args.SC, st=args.ST, v=args.v, r=args.r
        )
        print(f"Built: {res['run_id']}")

    elif args.command == "build-pack":
        sub_pack = load_json(get_pack_path("SUB", args.SUB))
        sty_pack = load_json(get_pack_path("STY", args.STY))
        res = build_prompt(
            fa=sub_pack["FA"], bt=sub_pack["BT"], et=sub_pack["ET"], hr=sub_pack["HR"],
            sc=sty_pack["SC"], st=sty_pack["ST"], v=args.v, r=args.r
        )
        print(f"Built from pack: {res['run_id']}")

    elif args.command == "batch":
        results = []
        if args.preset == "face_pass":
            results = face_pass(v=args.v, runs=args.runs, batch_name=args.batch_name)
        elif args.grid:
            # Simple grid parser: FA=A,B BT=C,D ...
            parts = args.grid.split()
            grid_params = {}
            for p in parts:
                k, v_list = p.split("=")
                grid_params[k] = v_list.split(",")
            
            # Cartesian product
            import itertools
            keys = ["FA", "BT", "ET", "HR", "SC", "ST"]
            # Ensure all keys exist in grid_params or use default? 
            # Requirements example shows all keys provided in grid.
            values = [grid_params[k] for k in keys]
            for combo in itertools.product(*values):
                fa, bt, et, hr, sc, st = combo
                for r_idx in range(1, args.runs + 1):
                    r_str = f"{r_idx:02d}"
                    res = build_prompt(fa, bt, et, hr, sc, st, args.v, r_str)
                    results.append(res)
        
        if results:
            m_path = write_manifest(args.batch_name, results)
            print(f"Batch completed. Manifest: {m_path}")
        else:
            print("No runs generated.")

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
