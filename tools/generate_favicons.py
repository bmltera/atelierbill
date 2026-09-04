#!/usr/bin/env python3
"""
tools/generate_favicons.py

CLI tool to extract the Atelier Bill "AB" logo monogram from source artwork,
crop out extraneous text ("ATELIER BILL") and background clutter, extract
a clean anti-aliased alpha mask, and generate a comprehensive suite of
optimized favicons and app icons for web, iOS, Android, and PWA.

Usage:
    python tools/generate_favicons.py
    python tools/generate_favicons.py --input path/to/image.jpg --style black
    python tools/generate_favicons.py --help
"""

import os
import sys
import argparse
import numpy as np
from PIL import Image, ImageFilter

def find_default_input():
    assets_dir = os.path.join(os.path.dirname(__file__), "..", "assets")
    if os.path.exists(assets_dir):
        for f in os.listdir(assets_dir):
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                return os.path.join(assets_dir, f)
    return None

def extract_logo_mark(img_path):
    """
    Locates the 'AB' monogram mark in the artwork, discarding any accompanying
    text below (such as 'ATELIER BILL') and extracting a clean RGBA image.
    """
    img = Image.open(img_path)
    w, h = img.size
    print(f"[*] Loaded source image: {img_path} ({w}x{h})")

    # Convert to grayscale luminance array
    gray = np.array(img.convert("L"), dtype=float)

    # 1. Background luminance estimation (sampled from top corners)
    bg_sample = gray[0:60, 0:60].mean()
    print(f"[*] Estimated background luminance: {bg_sample:.1f}")

    # 2. Analyze vertical distribution to distinguish top logo mark from bottom text
    # Any row with bright pixels > bg_sample + 50 is active
    bright_mask = gray > (bg_sample + 60)
    row_counts = bright_mask.sum(axis=1)

    # Find where the bright rows are
    active_rows = np.where(row_counts > 10)[0]
    if len(active_rows) == 0:
        raise ValueError("Could not find logo mark in source image!")

    # Find the gap between upper logo mark and lower text
    # Search for an empty horizontal gap (at least 20 consecutive rows with very low bright pixels)
    gap_y = None
    min_gap_rows = 25
    empty_run = 0
    start_search = active_rows[0] + 100

    for y in range(start_search, h):
        if row_counts[y] < 5:
            empty_run += 1
            if empty_run >= min_gap_rows:
                gap_y = y - (min_gap_rows // 2)
                break
        else:
            empty_run = 0

    if gap_y is None:
        # Fallback: cutoff at 65% of image height
        gap_y = int(h * 0.65)
        print(f"[!] Warning: Gap not auto-detected; using 65% vertical cutoff (y={gap_y})")
    else:
        print(f"[*] Detected boundary gap between monogram and text at y={gap_y}")

    # 3. Precise bounding box of the upper monogram mark only
    upper_mask = bright_mask[:gap_y, :]
    u_rows = np.where(upper_mask.any(axis=1))[0]
    u_cols = np.where(upper_mask.any(axis=0))[0]

    min_y, max_y = u_rows.min(), u_rows.max()
    min_x, max_x = u_cols.min(), u_cols.max()

    # Add small margin (5px) for anti-aliasing
    margin = 6
    min_y = max(0, min_y - margin)
    max_y = min(gap_y, max_y + margin)
    min_x = max(0, min_x - margin)
    max_x = min(w, max_x + margin)

    crop_w = max_x - min_x
    crop_h = max_y - min_y
    print(f"[*] Cropped monogram bounds: [{min_x}:{max_x}, {min_y}:{max_y}] ({crop_w}x{crop_h})")

    # Crop the logo region
    logo_crop = img.crop((min_x, min_y, max_x, max_y))
    crop_lum = np.array(logo_crop.convert("L"), dtype=float)

    # 4. Extract anti-aliased alpha mask
    # Background is ~bg_sample, foreground letters are ~235+
    bg_thresh = bg_sample + 8.0
    fg_thresh = 195.0

    alpha = np.clip((crop_lum - bg_thresh) / (fg_thresh - bg_thresh), 0.0, 1.0)
    # Smoothstep interpolation for crisp, anti-aliased edges
    alpha = alpha * alpha * (3.0 - 2.0 * alpha)

    # Clean off-white tone matching the authentic mark [248, 246, 242]
    rgba = np.zeros((crop_h, crop_w, 4), dtype=np.uint8)
    rgba[..., 0] = 248
    rgba[..., 1] = 246
    rgba[..., 2] = 242
    rgba[..., 3] = (alpha * 255).astype(np.uint8)

    clean_logo = Image.fromarray(rgba, mode="RGBA")
    return clean_logo

def create_master_icon(clean_logo, size=1024, bg_style="black", padding_ratio=0.18):
    """
    Composes the clean monogram mark onto a square canvas with optical padding.
    """
    lw, lh = clean_logo.size

    # Fit mark into square respecting padding
    max_dim = int(size * (1.0 - padding_ratio * 2))
    scale = min(max_dim / lw, max_dim / lh)
    tw = int(lw * scale)
    th = int(lh * scale)

    resized_logo = clean_logo.resize((tw, th), Image.Resampling.LANCZOS)

    # Create canvas
    if bg_style == "black":
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 255))
    elif bg_style == "charcoal":
        canvas = Image.new("RGBA", (size, size), (18, 20, 23, 255))
    elif bg_style == "transparent":
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    else:
        raise ValueError(f"Unknown bg_style: {bg_style}")

    # Center mark on canvas
    ox = (size - tw) // 2
    oy = (size - th) // 2
    canvas.paste(resized_logo, (ox, oy), resized_logo)
    return canvas

def generate_suite(master_black, master_trans, output_dirs):
    """
    Generates all standardized favicon and app icon formats and installs
    them to the target output directories.
    """
    for out_dir in output_dirs:
        os.makedirs(out_dir, exist_ok=True)

    # Specific icon sizes needed:
    sizes_to_generate = [
        ("favicon-16x16.png", 16, True),
        ("favicon-32x32.png", 32, True),
        ("apple-touch-icon.png", 180, False),
        ("android-chrome-192x192.png", 192, False),
        ("android-chrome-512x512.png", 512, False),
        ("icon.png", 512, False),
        ("apple-icon.png", 180, False),
    ]

    for filename, sz, apply_sharpen in sizes_to_generate:
        resized = master_black.resize((sz, sz), Image.Resampling.LANCZOS)
        if apply_sharpen:
            # Subtle unsharp mask to ensure tiny 16px/32px browser tab icons stay razor-sharp
            resized = resized.filter(ImageFilter.UnsharpMask(radius=0.8, percent=140, threshold=2))

        for out_dir in output_dirs:
            target_path = os.path.join(out_dir, filename)
            # Only save apple-icon.png / icon.png to app/ or if requested
            resized.save(target_path, "PNG")
            print(f"  [+] Wrote {target_path} ({sz}x{sz})")

    # Generate transparent versions as well
    trans_512 = master_trans.resize((512, 512), Image.Resampling.LANCZOS)
    for out_dir in output_dirs:
        trans_path = os.path.join(out_dir, "favicon-transparent.png")
        trans_512.save(trans_path, "PNG")
        print(f"  [+] Wrote {trans_path} (512x512 transparent)")

    # Generate multi-resolution ICO file
    for out_dir in output_dirs:
        ico_path = os.path.join(out_dir, "favicon.ico")
        master_black.save(
            ico_path,
            format="ICO",
            sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64)],
        )
        print(f"  [+] Wrote multi-resolution {ico_path} (16, 24, 32, 48, 64)")

    # Generate Web Manifest
    manifest_content = """{
  "name": "Atelier Bill",
  "short_name": "Atelier Bill",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#000000",
  "background_color": "#000000",
  "display": "standalone"
}
"""
    for out_dir in output_dirs:
        manifest_path = os.path.join(out_dir, "site.webmanifest")
        with open(manifest_path, "w", encoding="utf-8") as mf:
            mf.write(manifest_content)
        print(f"  [+] Wrote {manifest_path}")

def main():
    parser = argparse.ArgumentParser(description="Generate Atelier Bill favicons from logo artwork.")
    parser.add_argument("--input", "-i", help="Path to input artwork image")
    parser.add_argument("--style", "-s", choices=["black", "charcoal", "transparent"], default="black", help="Background style for master icon")
    args = parser.parse_args()

    input_path = args.input or find_default_input()
    if not input_path or not os.path.exists(input_path):
        print(f"[!] Error: Could not locate input image: {input_path}")
        sys.exit(1)

    print("==================================================")
    print("   ATELIER BILL — FAVICON GENERATION TOOL        ")
    print("==================================================")

    # 1. Extract clean logo mark (monogram only, no text)
    clean_logo = extract_logo_mark(input_path)

    # 2. Create master 1024x1024 square icons
    master_black = create_master_icon(clean_logo, size=1024, bg_style="black", padding_ratio=0.18)
    master_trans = create_master_icon(clean_logo, size=1024, bg_style="transparent", padding_ratio=0.18)

    # 3. Determine target output directories
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    public_dir = os.path.join(base_dir, "frontend", "public")
    app_dir = os.path.join(base_dir, "frontend", "src", "app")
    archive_dir = os.path.join(base_dir, "assets", "favicons")

    print("\n[*] Generating complete favicon suite...")
    # Generate to frontend/public
    generate_suite(master_black, master_trans, [public_dir, archive_dir])

    # Also install Next.js App Router specific root icon files
    master_black.save(os.path.join(app_dir, "favicon.ico"), format="ICO", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64)])
    master_black.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(app_dir, "icon.png"), "PNG")
    master_black.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(app_dir, "apple-icon.png"), "PNG")
    print(f"  [+] Installed app/favicon.ico, app/icon.png, app/apple-icon.png to {app_dir}")

    print("\n[OK] Favicons successfully generated and installed to site!")

if __name__ == "__main__":
    main()
