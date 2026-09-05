#!/usr/bin/env python3
import argparse
import subprocess
import os
import sys

def run_command(cmd, desc):
    print(f"\n==========================================")
    print(f"Executing: {desc}")
    print(f"Command: {' '.join(cmd)}")
    print(f"==========================================\n")
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error during {desc}.")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Encode a master showreel for web delivery.")
    parser.add_argument("input", help="Path to the master showreel video file")
    parser.add_argument("--version", "-v", default="v1", help="Version string for the output files (e.g. v1, v2)")
    parser.add_argument("--output-dir", "-o", default="../frontend/public", help="Directory to save the encoded files")

    args = parser.parse_args()

    input_file = args.input
    if not os.path.isfile(input_file):
        print(f"Error: Input file '{input_file}' not found.")
        sys.exit(1)

    os.makedirs(args.output_dir, exist_ok=True)

    # 1. Desktop Encode
    # 1080p max width, H.264, ~3.5M bitrate, faststart, no audio
    desktop_out = os.path.join(args.output_dir, f"showreel-desktop-{args.version}.mp4")
    cmd_desktop = [
        "ffmpeg", "-y", "-i", input_file,
        "-vf", "scale='min(1920,iw)':-2",
        "-c:v", "libx264",
        "-b:v", "3500k", "-maxrate", "4000k", "-bufsize", "8000k",
        "-profile:v", "high", "-level", "4.0",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an",  # no audio
        desktop_out
    ]
    run_command(cmd_desktop, "Desktop Encode (1080p, H.264)")

    # 2. Mobile Encode
    # 720p/1080p scaled, H.264, ~2M bitrate, faststart, no audio
    mobile_out = os.path.join(args.output_dir, f"showreel-mobile-{args.version}.mp4")
    cmd_mobile = [
        "ffmpeg", "-y", "-i", input_file,
        "-vf", "scale='min(1080,iw)':-2",
        "-c:v", "libx264",
        "-b:v", "2000k", "-maxrate", "2500k", "-bufsize", "5000k",
        "-profile:v", "high", "-level", "4.0",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an",
        mobile_out
    ]
    run_command(cmd_mobile, "Mobile Encode (Scaled, H.264)")

    # 3. Poster Image
    poster_out = os.path.join(args.output_dir, f"showreel-poster-{args.version}.webp")
    cmd_poster = [
        "ffmpeg", "-y", "-i", input_file,
        "-vframes", "1",
        "-c:v", "libwebp", "-quality", "85",
        poster_out
    ]
    run_command(cmd_poster, "Poster Extraction (WebP)")

    print(f"\n✅ All web-optimized encodes completed successfully!")
    print(f"Files saved to {args.output_dir}:")
    print(f"  - {os.path.basename(desktop_out)}")
    print(f"  - {os.path.basename(mobile_out)}")
    print(f"  - {os.path.basename(poster_out)}")

if __name__ == "__main__":
    main()
