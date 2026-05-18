"""Inspect the pre-trained feces_yolo model.
Prints class names, input size, model metadata.
"""

from ultralytics import YOLO
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "models" / "feces_yolo.pt"

def main():
    print(f"Loading {MODEL_PATH}...")
    model = YOLO(str(MODEL_PATH))

    print("\n--- Model info ---")
    print(f"Task: {model.task}")
    print(f"Number of classes: {len(model.names)}")
    print(f"Input size (default): {model.args if hasattr(model, 'args') else 'unknown'}")

    print("\n--- Class names (first 30) ---")
    for idx, name in list(model.names.items())[:30]:
        print(f"  {idx:3d}: {name}")
    if len(model.names) > 30:
        print(f"  ... and {len(model.names) - 30} more")

    print("\n--- All class names (full list) ---")
    for idx, name in model.names.items():
        print(f"  {idx:3d}: {name}")


if __name__ == "__main__":
    main()
