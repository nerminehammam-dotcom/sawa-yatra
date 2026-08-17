import sys
from pathlib import Path

from PIL import Image, ImageDraw


source_dir = Path(sys.argv[1])
output_path = Path(sys.argv[2])
files = sorted(
    path
    for path in source_dir.iterdir()
    if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
)

thumbs = []
for path in files:
    image = Image.open(path).convert("RGB")
    image.thumbnail((340, 230))
    canvas = Image.new("RGB", (360, 275), "white")
    canvas.paste(image, ((360 - image.width) // 2, 28))
    ImageDraw.Draw(canvas).text((10, 8), path.name[:48], fill="black")
    thumbs.append(canvas)

columns = 3
rows = (len(thumbs) + columns - 1) // columns
sheet = Image.new("RGB", (columns * 360, rows * 275), (220, 216, 205))
for index, thumb in enumerate(thumbs):
    sheet.paste(thumb, ((index % columns) * 360, (index // columns) * 275))

sheet.save(output_path)
