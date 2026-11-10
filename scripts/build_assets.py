"""
Builds web-optimised images and the JSON manifests the site reads.

- gallery/*          (your original photos, any size)  ->  img/gallery/<name>.webp (1600px) + img/gallery/thumb/<name>.webp (640px)
- writes gallery.json  (list of {src, thumb, w, h, alt})
- writes library.json  (list of PDFs in library/ with title + size)

Runs automatically via GitHub Actions whenever you add photos or PDFs.
Just drop files into gallery/ or library/ and commit.
"""
import json
import os
import re
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GALLERY_SRC = os.path.join(ROOT, "gallery")
OUT_FULL = os.path.join(ROOT, "img", "gallery")
OUT_THUMB = os.path.join(OUT_FULL, "thumb")
LIBRARY = os.path.join(ROOT, "library")

IMG_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif")
# Files in gallery/ that should NOT appear in the gallery (logos, hero art, etc.)
SKIP_PREFIXES = ("hero",)


def slug(name):
    base = os.path.splitext(name)[0]
    return re.sub(r"[^A-Za-z0-9_-]+", "-", base).strip("-")[:60] or "photo"


def make(src, dst, max_px, quality):
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
        with Image.open(dst) as d:
            return d.size
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((max_px, max_px), Image.LANCZOS)
        im.save(dst, "WEBP", quality=quality, method=6)
        return im.size


def build_gallery():
    os.makedirs(OUT_THUMB, exist_ok=True)
    items, keep = [], set()
    for f in sorted(os.listdir(GALLERY_SRC)) if os.path.isdir(GALLERY_SRC) else []:
        path = os.path.join(GALLERY_SRC, f)
        if not (os.path.isfile(path) and f.lower().endswith(IMG_EXT)):
            continue
        if f.lower().startswith(SKIP_PREFIXES):
            continue
        s = slug(f)
        keep.add(s + ".webp")
        w, h = make(path, os.path.join(OUT_FULL, s + ".webp"), 1600, 80)
        make(path, os.path.join(OUT_THUMB, s + ".webp"), 640, 72)
        items.append({
            "src": f"img/gallery/{s}.webp",
            "thumb": f"img/gallery/thumb/{s}.webp",
            "w": w, "h": h,
            "alt": "Paphos Motorcycle Club ride photo",
        })
    # remove optimised files whose original was deleted
    for d in (OUT_FULL, OUT_THUMB):
        for f in os.listdir(d):
            if f.endswith(".webp") and f not in keep:
                os.remove(os.path.join(d, f))
    with open(os.path.join(ROOT, "gallery.json"), "w", encoding="utf-8") as fp:
        json.dump(items, fp, indent=1)
    print(f"gallery: {len(items)} photos")


def build_library():
    docs = []
    for f in sorted(os.listdir(LIBRARY)) if os.path.isdir(LIBRARY) else []:
        if f.lower().endswith(".pdf"):
            title = re.sub(r"[_-]+", " ", os.path.splitext(f)[0]).strip()
            docs.append({
                "file": f"library/{f}",
                "title": title,
                "size": os.path.getsize(os.path.join(LIBRARY, f)),
            })
    with open(os.path.join(ROOT, "library.json"), "w", encoding="utf-8") as fp:
        json.dump(docs, fp, ensure_ascii=False, indent=1)
    print(f"library: {len(docs)} documents")


if __name__ == "__main__":
    build_gallery()
    build_library()
