from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PIL import Image
from rembg import remove


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "images" / "types"
OUTPUT_DIR = ROOT / "public" / "images" / "types-transparent"
SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg"}
PADDING_RATIO = 0.08


def crop_to_alpha_bounds(image: Image.Image) -> Image.Image:
  alpha = image.getchannel("A")
  bbox = alpha.getbbox()

  if bbox is None:
    return image

  left, top, right, bottom = bbox
  pad_x = int((right - left) * PADDING_RATIO)
  pad_y = int((bottom - top) * PADDING_RATIO)

  cropped_box = (
    max(0, left - pad_x),
    max(0, top - pad_y),
    min(image.width, right + pad_x),
    min(image.height, bottom + pad_y),
  )

  return image.crop(cropped_box)


def process_image(source_path: Path) -> Path:
  output_path = OUTPUT_DIR / f"{source_path.stem}.png"
  removed = remove(source_path.read_bytes())

  with Image.open(BytesIO(removed)).convert("RGBA") as image:
    cropped = crop_to_alpha_bounds(image)
    cropped.save(output_path, "PNG")

  return output_path


def main() -> None:
  OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

  processed_paths: list[Path] = []

  for source_path in sorted(SOURCE_DIR.iterdir()):
    if source_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
      continue
    processed_paths.append(process_image(source_path))

  print(f"Generated {len(processed_paths)} transparent assets in {OUTPUT_DIR}")
  for path in processed_paths:
    print(path.relative_to(ROOT))


if __name__ == "__main__":
  main()
