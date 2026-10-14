"""Draws the PrismGo app icon in the brand palette.

Outputs (1024 px):
  assets/icon/icon.png             full icon (iOS, legacy Android): coral square, ink "P", mint dot
  assets/icon/icon_foreground.png  Android adaptive foreground: same mark on transparent, inside the safe zone
Run: python3 tool/make_icon.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

CORAL = (252, 107, 63, 255)
INK = (38, 37, 37, 255)
MINT = (132, 242, 214, 255)
FONT = "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf"
OUT = Path(__file__).resolve().parent.parent / "assets" / "icon"
SIZE = 1024


def draw_mark(img: Image.Image, scale: float) -> None:
    """A rounded "P" with a mint location dot, centred, scaled to `scale` of the canvas."""
    d = ImageDraw.Draw(img)
    font = ImageFont.truetype(FONT, int(SIZE * 0.62 * scale))
    box = d.textbbox((0, 0), "P", font=font)
    w, h = box[2] - box[0], box[3] - box[1]
    x = (SIZE - w) / 2 - box[0] - SIZE * 0.03 * scale
    y = (SIZE - h) / 2 - box[1]
    d.text((x, y), "P", font=font, fill=INK)
    r = SIZE * 0.085 * scale
    cx = x + box[2] + r * 0.9
    cy = y + box[3] - r
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=MINT, outline=INK, width=int(SIZE * 0.018 * scale))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    full = Image.new("RGBA", (SIZE, SIZE), CORAL)
    draw_mark(full, 1.0)
    full.convert("RGB").save(OUT / "icon.png")  # iOS rejects alpha in app icons

    fg = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw_mark(fg, 0.66)  # adaptive icons crop to the inner ~66%
    fg.save(OUT / "icon_foreground.png")
    print(f"Wrote {OUT}/icon.png and icon_foreground.png")


if __name__ == "__main__":
    main()
