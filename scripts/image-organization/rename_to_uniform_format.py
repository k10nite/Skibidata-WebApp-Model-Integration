import os
import csv
import re
import hashlib
from pathlib import Path

print("="*100)
print("RENAME JAN16 FILES TO UNIFORM FORMAT")
print("="*100)

# Paths
thesis_dir = Path(r"C:\Users\Neil\Documents\thesis")
dylan_dir = thesis_dir / "dylan"
organized_images = thesis_dir / "soil-fertility-classification-dataset" / "organized_images"
orphaned_dir = organized_images / "orphaned-jan16-no-metadata" / "latrinidad_betag_sf"
metadata_csv = organized_images / "orphaned-jan16-no-metadata" / "jan16_betag_metadata.csv"

print(f"\n[1/5] Building mapping from original IMG files...")
print("-" * 100)

# Get all original IMG files with their timestamps from filenames
original_img_files = sorted(dylan_dir.glob("**/IMG20260116*.jpg"))
print(f"Found {len(original_img_files)} original IMG files")

# Create size -> (timestamp, path) mapping
size_to_img_info = {}
for img_file in original_img_files:
    size = img_file.stat().st_size
    # Extract timestamp from filename: IMG20260116HHMMSS.jpg
    match = re.search(r'IMG20260116(\d{6})', img_file.name)
    if match:
        timestamp = match.group(1)
        size_to_img_info[size] = {'timestamp': timestamp, 'path': img_file}

print(f"Mapped {len(size_to_img_info)} files by size")

print(f"\n[2/5] Parsing sf/s naming for spot and shot numbers...")
print("-" * 100)

# Get current orphaned files
orphaned_files = sorted(orphaned_dir.glob("*.jpg"))
print(f"Found {len(orphaned_files)} files to rename")

# Parse sf/s naming: sf12 (1).jpg = spot 12, shot 1
file_info = []
for img_file in orphaned_files:
    filename = img_file.name

    # Parse spot and shot from filename
    # Patterns: "sf12 (1).jpg" or "s6 (2).jpg"
    match = re.match(r'\s*s(?:f)?(\d+)\s*\((\d+)\)\.jpg', filename)
    if match:
        spot = int(match.group(1))
        shot = int(match.group(2))

        # Get timestamp from original IMG file by matching size
        size = img_file.stat().st_size
        timestamp = "000000"  # default
        if size in size_to_img_info:
            timestamp = size_to_img_info[size]['timestamp']

        # Generate UUID from filename for consistency
        uuid = hashlib.md5(filename.encode()).hexdigest()[:8]

        file_info.append({
            'current_name': filename,
            'current_path': img_file,
            'spot': spot,
            'shot': shot,
            'timestamp': timestamp,
            'uuid': uuid,
            'size': size
        })

print(f"Parsed {len(file_info)} files with spot/shot info")

print(f"\n[3/5] Generating new uniform filenames...")
print("-" * 100)

# Generate new filenames: latrinidad_betag_sf_20260116_HHMMSS_UUID.jpg
rename_map = {}  # old_name -> new_info
for info in file_info:
    new_filename = f"latrinidad_betag_sf_20260116_{info['timestamp']}_{info['uuid']}.jpg"
    rename_map[info['current_name']] = {
        'new_filename': new_filename,
        'spot': info['spot'],
        'shot': info['shot'],
        'current_path': info['current_path']
    }

print(f"Generated {len(rename_map)} new filenames")
for i, (old, new_info) in enumerate(list(rename_map.items())[:5]):
    print(f"  {old} -> {new_info['new_filename']} (spot={new_info['spot']}, shot={new_info['shot']})")
if len(rename_map) > 5:
    print(f"  ... and {len(rename_map) - 5} more")

print(f"\n[4/5] Renaming files...")
print("-" * 100)

renamed_count = 0
for old_name, new_info in rename_map.items():
    old_path = new_info['current_path']
    new_path = orphaned_dir / new_info['new_filename']

    if new_path.exists():
        print(f"SKIP: {new_info['new_filename']} already exists")
        continue

    try:
        old_path.rename(new_path)
        renamed_count += 1
        if renamed_count <= 10:
            print(f"Renamed: {old_name} -> {new_info['new_filename']}")
    except Exception as e:
        print(f"ERROR renaming {old_name}: {e}")

if renamed_count > 10:
    print(f"... and {renamed_count - 10} more")

print(f"\n[5/5] Updating CSV metadata...")
print("-" * 100)

# Read existing CSV
rows = []
with open(metadata_csv, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for row in reader:
        rows.append(row)

# Update rows with new filenames and spot/shot numbers
updated_count = 0
for row in rows:
    img_path = row.get('image_filename', '')
    if img_path:
        old_basename = os.path.basename(img_path)
        if old_basename in rename_map:
            new_info = rename_map[old_basename]
            # Update filename
            row['image_filename'] = f"orphaned-jan16-no-metadata/latrinidad_betag_sf/{new_info['new_filename']}"
            # Update spot and shot numbers
            row['spot_number'] = str(new_info['spot'])
            row['shot_number'] = str(new_info['shot'])
            updated_count += 1

# Write updated CSV
with open(metadata_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Updated {updated_count} CSV rows")

print("\n" + "=" * 100)
print("SUMMARY")
print("=" * 100)
print(f"Files renamed: {renamed_count}")
print(f"CSV rows updated: {updated_count}")
print(f"New format: latrinidad_betag_sf_20260116_HHMMSS_UUID.jpg")
print(f"Spot/shot numbers populated in CSV")
print("=" * 100)
print("DONE!")
print("=" * 100)
