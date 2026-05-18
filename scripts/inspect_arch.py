"""Inspect the model architecture — what variant of YOLO is this?"""

from pathlib import Path
import torch

MODEL_PATH = Path(__file__).parent / "models" / "feces_yolo.pt"

ckpt = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)

print("--- Checkpoint keys ---")
for k in ckpt:
    print(f"  {k}")

if "model" in ckpt:
    m = ckpt["model"]
    n_params = sum(p.numel() for p in m.parameters())
    print(f"\n--- Model stats ---")
    print(f"Total parameters: {n_params:,}")
    print(f"Param-count category: ", end="")
    if n_params < 4_000_000:
        print("YOLOv8n (nano) — smallest, fastest, lowest accuracy")
    elif n_params < 15_000_000:
        print("YOLOv8s (small)")
    elif n_params < 30_000_000:
        print("YOLOv8m (medium)")
    elif n_params < 50_000_000:
        print("YOLOv8l (large)")
    else:
        print("YOLOv8x (extra-large)")

if "train_args" in ckpt:
    print(f"\n--- Training args ---")
    for k, v in ckpt["train_args"].items():
        print(f"  {k}: {v}")

if "epoch" in ckpt:
    print(f"\nFinal epoch: {ckpt.get('epoch')}")

if "best_fitness" in ckpt:
    print(f"Best fitness during training: {ckpt.get('best_fitness')}")
