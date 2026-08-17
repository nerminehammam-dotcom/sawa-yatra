import sys
from pathlib import Path

from PIL import Image, ImageDraw


source_dir = Path(sys.argv[1])
page_count = int(sys.argv[2])
output_path = Path(sys.argv[3])

thumbs = []
for page_number in range(1, page_count + 1):
    unpadded = source_dir / f"page-{page_number}.png"
    padded = source_dir / f"page-{page_number:02d}.png"
    image = Image.open(unpadded if unpadded.exists() else padded).convert("RGB")
    image.thumbnail((240, 340))
    canvas = Image.new("RGB", (260, 380), "white")
    canvas.paste(image, ((260 - image.width) // 2, 22))
    ImageDraw.Draw(canvas).text((10, 4), f"Page {page_number}", fill="black")
    thumbs.append(canvas)

columns = 5
rows = (len(thumbs) + columns - 1) // columns
sheet = Image.new("RGB", (columns * 260, rows * 380), (220, 216, 205))
for index, thumb in enumerate(thumbs):
    sheet.paste(thumb, ((index % columns) * 260, (index // columns) * 380))

sheet.save(output_path)
