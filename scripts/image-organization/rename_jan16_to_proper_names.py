import os
import csv
import shutil
from pathlib import Path
from collections import defaultdict

print("="*100)
print("RENAME JAN16 ORPHANED IMAGES TO PROPER NAMES")
print("="*100)

# Paths
thesis_dir = Path(r"C:\Users\Neil\Documents\thesis")
dylan_dir = thesis_dir / "dylan"
organized_images = thesis_dir / "soil-fertility-classification-dataset" / "organized_images"
orphaned_dir = organized_images / "orphaned-jan16-no-metadata" / "latrinidad_betag_sf"
metadata_csv = organized_images / "orphaned-jan16-no-metadata" / "jan16_betag_metadata.csv"

# Step 1: Get all original IMG filenames from dylan directory
print(f"\n[1/4] Finding original IMG files in dylan directory...")
print("-" * 100)

original_img_files = sorted(dylan_dir.glob("**/IMG20260116*.jpg"))
print(f"Found {len(original_img_files)} original IMG files")

# Create mapping: basename -> full original filename
img_basenames = {}
for img_file in original_img_files:
    basename = img_file.name
    img_basenames[basename] = img_file

# Step 2: Get current orphaned files
print(f"\n[2/4] Scanning orphaned directory...")
print("-" * 100)

orphaned_files = sorted(orphaned_dir.glob("*.jpg"))
print(f"Found {len(orphaned_files)} files to rename")

if len(orphaned_files) != len(original_img_files):
    print(f"WARNING: Count mismatch! Orphaned: {len(orphaned_files)}, Original: {len(original_img_files)}")
    response = input("Continue anyway? (yes/no): ").strip().lower()
    if response != 'yes':
        print("Aborted.")
        exit(0)

# Step 3: Create mapping by comparing file sizes (more reliable than timestamps)
print(f"\n[3/4] Matching files by size...")
print("-" * 100)

# Group original files by size
size_to_original = defaultdict(list)
for img_file in original_img_files:
    size = img_file.stat().st_size
    size_to_original[size].append(img_file.name)

# Match orphaned files to original names by size
file_mapping = {}  # current_name -> new_IMG_name
unmatched = []

for orphaned_file in orphaned_files:
    size = orphaned_file.stat().st_size
    if size in size_to_original and len(size_to_original[size]) > 0:
        # Pop the first match
        original_name = size_to_original[size].pop(0)
        file_mapping[orphaned_file.name] = original_name
    else:
        unmatched.append(orphaned_file.name)

print(f"Matched: {len(file_mapping)} files")
print(f"Unmatched: {len(unmatched)} files")

if unmatched:
    print("\nUnmatched files:")
    for f in unmatched[:10]:
        print(f"  - {f}")
    if len(unmatched) > 10:
        print(f"  ... and {len(unmatched) - 10} more")

# Step 4: Rename files
print(f"\n[4/4] Renaming files...")
print("-" * 100)

renamed_count = 0
for current_name, new_name in file_mapping.items():
    current_path = orphaned_dir / current_name
    new_path = orphaned_dir / new_name

    if new_path.exists():
        print(f"SKIP: {new_name} already exists")
        continue

    try:
        current_path.rename(new_path)
        renamed_count += 1
        if renamed_count <= 10:
            print(f"Renamed: {current_name} -> {new_name}")
    except Exception as e:
        print(f"ERROR renaming {current_name}: {e}")

if renamed_count > 10:
    print(f"... and {renamed_count - 10} more")

# Step 5: Update CSV metadata
print(f"\n[5/5] Updating metadata CSV...")
print("-" * 100)

# Read existing CSV
rows = []
with open(metadata_csv, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for row in reader:
        rows.append(row)

# Update image_filename field
updated_rows = 0
for row in rows:
    img_path = row.get('image_filename', '')
    if img_path:
        current_basename = os.path.basename(img_path)
        if current_basename in file_mapping:
            new_basename = file_mapping[current_basename]
            # Update path
            new_path = f"orphaned-jan16-no-metadata/latrinidad_betag_sf/{new_basename}"
            row['image_filename'] = new_path
            updated_rows += 1

# Write updated CSV
with open(metadata_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Updated {updated_rows} CSV rows")

print("\n" + "=" * 100)
print("SUMMARY")
print("=" * 100)
print(f"Original IMG files found: {len(original_img_files)}")
print(f"Orphaned files renamed: {renamed_count}")
print(f"CSV rows updated: {updated_rows}")
print(f"Unmatched files: {len(unmatched)}")
print("=" * 100)
print("DONE!")
print("=" * 100)
