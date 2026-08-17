# Field book tooling

The scripts that build the field books in `public/assets/guides`.

Rescued into the repository on 17 August 2026. Until then the only copy lived
in `tmp/pdfs/`, which is gitignored — a workspace cleanup would have deleted
the ability to rebuild the guides while leaving the guides themselves in place.
That is the worst kind of loss: nothing looks broken until the next time you
need to change a page.

## The pipeline

```
The_Andean_Caravan_..._Master.docx        the founder's source document
        │                                  (gitignored, local only)
        │  inspect_docx.py
        ▼
source-guide-structure.json               the parsed structure, tracked here
        │                                  so the build runs without the DOCX
        │  build_andean_guide.py
        ▼
public/assets/guides/andean-caravan-*.pdf  five volumes, 117 pages
```

`make_contact_sheet.py` and `make_image_contact_sheet.py` render a PDF or a
folder of images to a single sheet, for eyeballing a whole guide at once.

## Requirements

`reportlab` and `Pillow`. Neither is a site dependency — these are authoring
tools, not part of the build, and nothing in `app/` imports them.

## Note on the published PDFs

The web set is derived from the full-quality masters in `output/pdf` (gitignored,
~114 MB). They were resampled with **pikepdf**, image-only. Do not use
ghostscript: it rewrites the whole file and drops the `ToUnicode` maps, so the
text extracts as `/g2/g1/g9` and copy-paste, search and screen readers all
break. That was tried on 15 August 2026 and reverted.
