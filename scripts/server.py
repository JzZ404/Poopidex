"""Poopidex inference server.

A tiny FastAPI app that loads the AnimalClue feces YOLO model and
exposes POST /predict — accepts an image upload, returns predictions.

The Next.js frontend calls this on every identify request.

Run:
    cd scripts
    .venv/bin/python server.py
    # or:  .venv/bin/uvicorn server:app --reload --port 8001
"""

from __future__ import annotations

import io
import logging
from pathlib import Path
from typing import Any

import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from ultralytics import YOLO

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("poopidex")

MODEL_PATH = Path(__file__).parent / "models" / "feces_yolo.pt"

# Species name remapping: YOLO model name → canonical Poopidex name.
# Only used to rename a few species so they match our illustration filenames.
# Any other species the model returns is passed through verbatim.
SPECIES_RENAME: dict[str, str] = {
    "Common Raccoon": "Raccoon",
}

CONF_THRESHOLD = 0.03  # show even low-confidence picks; UI decides how to render

app = FastAPI(title="Poopidex Inference")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

log.info(f"Loading YOLO model from {MODEL_PATH}")
model = YOLO(str(MODEL_PATH))
log.info(f"Model loaded · {len(model.names)} classes")


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "ok": True,
        "model": MODEL_PATH.name,
        "classes": len(model.names),
        "all_species": list(model.names.values()),
    }


def canonicalize(raw_name: str) -> str:
    return SPECIES_RENAME.get(raw_name, raw_name)


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> dict[str, Any]:
    """Run inference on an uploaded image.

    Returns the top supported-species match and a runner-up (if any).
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    raw = await file.read()
    try:
        img = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not decode image: {e}")

    log.info(f"Predicting on {file.filename or '<unnamed>'} ({img.size[0]}x{img.size[1]})")

    results = model.predict(img, imgsz=512, conf=CONF_THRESHOLD, verbose=False)
    r = results[0]

    # Aggregate per-class confidence across all boxes (take max).
    by_class: dict[str, float] = {}
    for box in r.boxes:
        cls_idx = int(box.cls)
        cls_name = model.names[cls_idx]
        conf = float(box.conf)
        by_class[cls_name] = max(by_class.get(cls_name, 0.0), conf)

    ranked = sorted(by_class.items(), key=lambda kv: kv[1], reverse=True)

    if not ranked:
        log.info("No detections at all — likely not a scat photo.")
        return {"ok": False, "reason": "no_detections"}

    top_raw, top_conf = ranked[0]
    runner_raw, runner_conf = ranked[1] if len(ranked) > 1 else (None, None)

    response = {
        "ok": True,
        "top": {
            "species": canonicalize(top_raw),
            "speciesRaw": top_raw,
            "confidence": round(top_conf, 4),
        },
        "runnerUp": (
            {
                "species": canonicalize(runner_raw),
                "speciesRaw": runner_raw,
                "confidence": round(runner_conf, 4),
            }
            if runner_raw
            else None
        ),
        "all": [
            {"species": canonicalize(name), "confidence": round(conf, 4)}
            for name, conf in ranked
        ],
    }
    log.info(f"Top: {response['top']}")
    return response


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8001, reload=False)
