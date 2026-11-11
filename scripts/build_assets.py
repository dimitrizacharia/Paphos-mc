"""
Builds web-optimised images and the JSON manifests the site reads.

GALLERY – two ways to add photos:
  1. Drop photos straight into gallery/
       -> grouped automatically into monthly albums by the date the photo was taken
          (photos with no date go into "More photos")
  2. Put photos in a sub-folder named "YYYY-MM-DD Album name", e.g.
       gallery/2026-11-16 Hard Enduro Coaching Marathounta/
       -> becomes its own album with that title and date

Output:
  img/gallery/<album>/<name>.webp        (1600px)
  img/gallery/<album>/thumb/<name>.webp  (640px)
  gallery.json   {"albums": [...]}, newest first
  library.json   list of PDFs in library/

Runs automatically via GitHub Actions whenever you add photos or PDFs.
"""
import json
import os
import re
import shutil
from datetime import datetime
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GALLERY_SRC = os.path.join(ROOT, "gallery")
OUT = os.path.join(ROOT, "img", "gallery")
LIBRARY = os.path.join(ROOT, "library")

IMG_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif")
SKIP_PREFIXES = ("hero",)  # files in gallery/ that are NOT gallery photos
MONTHS = ["January", "February", "March", "April", "May", "June", "July",
          "August", "September", "October", "November", "December"]


def slug(name):
    s = re.sub(r"[^A-Za-z0-9_-]+", "-", os.path.splitext(name)[0]).strip("-")
    return s[:60].lower() or "photo"


def taken(path):
    """Capture date from EXIF, or None."""
    try:
        with Image.open(path) as im:
            ex = im.getexif()
            raw = ex.get_ifd(0x8769).get(36867) or ex.get(306)
        return datetime.strptime(str(raw)[:19], "%Y:%m:%d %H:%M:%S") if raw else None
    except Exception:
        return None


def make(src, dst, max_px, quality):
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
        with Image.open(dst) as d:
            return d.size
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((max_px, max_px), Image.LANCZOS)
        im.save(dst, "WEBP", quality=quality, method=6)
        return im.size


def is_photo(path, name):
    return (os.path.isfile(path) and name.lower().endswith(IMG_EXT)
            and not name.lower().startswith(SKIP_PREFIXES))


def collect():
    """Return {album_key: {"title", "date", "files": [(path, taken)]}}."""
    albums = {}
    if not os.path.isdir(GALLERY_SRC):
        return albums
    for entry in sorted(os.listdir(GALLERY_SRC)):
        path = os.path.join(GALLERY_SRC, entry)
        if os.path.isdir(path):
            # Named album folder: "YYYY-MM-DD Title" (date optional)
            m = re.match(r"^(\d{4}-\d{2}(?:-\d{2})?)[\s_-]*(.*)$", entry)
            date = m.group(1) if m else ""
            title = (m.group(2) if m else entry).strip() or entry
            files = [(os.path.join(path, f), taken(os.path.join(path, f)))
                     for f in sorted(os.listdir(path)) if is_photo(os.path.join(path, f), f)]
            if files:
                if not date:
                    dates = [t for _, t in files if t]
                    date = min(dates).strftime("%Y-%m-%d") if dates else ""
                albums["a-" + slug(entry)] = {"title": title, "date": date, "files": files}
        elif is_photo(path, entry):
            t = taken(path)
            if t:
                key = t.strftime("m-%Y-%m")
                albums.setdefault(key, {"title": f"{MONTHS[t.month - 1]} {t.year}",
                                        "date": t.strftime("%Y-%m"), "files": []})
            else:
                key = "more-photos"
                albums.setdefault(key, {"title": "More photos", "date": "", "files": []})
            albums[key]["files"].append((path, t))
    return albums


def build_gallery():
    os.makedirs(OUT, exist_ok=True)
    out_albums, keep_dirs = [], set()
    for key, a in collect().items():
        adir = os.path.join(OUT, key)
        tdir = os.path.join(adir, "thumb")
        os.makedirs(tdir, exist_ok=True)
        keep_dirs.add(key)
        a["files"].sort(key=lambda ft: (ft[1] or datetime.max, ft[0]))
        photos, keep = [], set()
        for path, t in a["files"]:
            s = slug(os.path.basename(path))
            keep.add(s + ".webp")
            w, h = make(path, os.path.join(adir, s + ".webp"), 1600, 80)
            make(path, os.path.join(tdir, s + ".webp"), 640, 72)
            photos.append({
                "src": f"img/gallery/{key}/{s}.webp",
                "thumb": f"img/gallery/{key}/thumb/{s}.webp",
                "w": w, "h": h,
                "alt": f"{a['title']} – Paphos Motorcycle Club",
            })
        for d in (adir, tdir):
            for f in os.listdir(d):
                if f.endswith(".webp") and f not in keep:
                    os.remove(os.path.join(d, f))
        out_albums.append({"id": key, "title": a["title"], "date": a["date"],
                           "cover": photos[0]["thumb"], "photos": photos})

    # remove optimised albums/files whose originals were deleted or moved
    for f in os.listdir(OUT):
        p = os.path.join(OUT, f)
        if f not in keep_dirs:
            shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)

    # newest first; undated albums last
    out_albums.sort(key=lambda a: a["date"] or "0000", reverse=True)
    with open(os.path.join(ROOT, "gallery.json"), "w", encoding="utf-8") as fp:
        json.dump({"albums": out_albums}, fp, ensure_ascii=False, indent=1)
    print(f"gallery: {len(out_albums)} albums, {sum(len(a['photos']) for a in out_albums)} photos")


def build_library():
    docs = []
    for f in sorted(os.listdir(LIBRARY)) if os.path.isdir(LIBRARY) else []:
        if f.lower().endswith(".pdf"):
            title = re.sub(r"[_-]+", " ", os.path.splitext(f)[0]).strip()
            docs.append({"file": f"library/{f}", "title": title,
                         "size": os.path.getsize(os.path.join(LIBRARY, f))})
    with open(os.path.join(ROOT, "library.json"), "w", encoding="utf-8") as fp:
        json.dump(docs, fp, ensure_ascii=False, indent=1)
    print(f"library: {len(docs)} documents")


if __name__ == "__main__":
    build_gallery()
    build_library()
