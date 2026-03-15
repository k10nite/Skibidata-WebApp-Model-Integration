import os
import shutil
from pathlib import Path

print("="*100)
print("JAN16 ORPHANED IMAGES ORGANIZATION")
print("="*100)

# Paths
thesis_dir = Path(r"C:\Users\Neil\Documents\thesis")
dylan_dir = thesis_dir / "dylan"
organized_images = thesis_dir / "soil-fertility-classification-dataset" / "organized_images"

# Create directory for orphaned images
orphaned_dir = organized_images / "orphaned-jan16-no-metadata"
orphaned_dir.mkdir(exist_ok=True)

# Subdirectory for betag location
betag_dir = orphaned_dir / "latrinidad_betag_sf"
betag_dir.mkdir(exist_ok=True)

print(f"\n[1/3] Scanning for IMG20260116 files...")
print("-" * 100)

# Find all IMG files in dylan directory
img_files = []
for img_file in dylan_dir.rglob("IMG20260116*.jpg"):
    img_files.append(img_file)

print(f"Found {len(img_files)} IMG files from Jan 16, 2026")

# Check which are not in organized_images
print(f"\n[2/3] Identifying files not in organized_images...")
print("-" * 100)

to_copy = []
already_exists = 0

for img_file in img_files:
    # Check if already in organized_images (excluding orphaned dir)
    existing = list(organized_images.rglob(img_file.name))
    existing = [f for f in existing if "orphaned" not in str(f)]

    if not existing:
        to_copy.append(img_file)
    else:
        already_exists += 1

print(f"To copy: {len(to_copy)} images")
print(f"Already in organized_images: {already_exists} images")

# Copy files
print(f"\n[3/3] Copying orphaned images to {betag_dir}...")
print("-" * 100)

copied = 0
skipped = 0

for img_file in to_copy:
    dest_file = betag_dir / img_file.name

    if dest_file.exists():
        skipped += 1
    else:
        try:
            shutil.copy2(img_file, dest_file)
            copied += 1
            if copied <= 10:
                print(f"Copied: {img_file.name}")
        except Exception as e:
            print(f"ERROR copying {img_file.name}: {e}")

if copied > 10:
    print(f"... and {copied - 10} more")

print("\n" + "=" * 100)
print("SUMMARY")
print("=" * 100)
print(f"Destination: {betag_dir}")
print(f"Copied: {copied} images")
print(f"Skipped (already exist): {skipped} images")
print(f"\nNOTE: These images lack CSV metadata (no GPS, crops, etc.)")
print(f"      Located in separate 'orphaned-jan16-no-metadata' directory")
print(f"      Source: La Trinidad, Betag SF field samples from 2026-01-16")
print("=" * 100)
print("DONE!")
print("=" * 100)
