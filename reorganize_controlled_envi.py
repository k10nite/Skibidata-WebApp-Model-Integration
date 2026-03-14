import os
import csv
import shutil
from pathlib import Path
from collections import defaultdict

print("="*100)
print("CONTROLLED-ENVI REORGANIZATION SCRIPT")
print("="*100)

# Paths
thesis_dir = Path(r"C:\Users\Neil\Documents\thesis")
repo_images = thesis_dir / "soil-fertility-classification-dataset" / "organized_images"
controlled_dir = repo_images / "controlled-envi"
combined_csv = repo_images / "combined_field_data.csv"

# Statistics
stats = {
    'total_in_controlled': 0,
    'correctly_labeled_controlled': 0,
    'mislabeled_as_field': 0,
    'moved_to_atok': 0,
    'moved_to_latrinidad': 0,
    'errors': 0,
    'skipped_already_exists': 0
}

print("\n[1/4] Reading CSV to build filename-to-capture_mode mapping...")
print("-" * 100)

# Build mapping: filename -> (capture_mode, municipality)
filename_metadata = {}
with open(combined_csv, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        image_filename = row.get('image_filename', '')
        if image_filename:
            # Get just the base filename
            base_filename = os.path.basename(image_filename)
            capture_mode = row.get('capture_mode', '').strip().lower()
            municipality = row.get('municipality', 'Unknown').strip()
            filename_metadata[base_filename] = {
                'capture_mode': capture_mode,
                'municipality': municipality,
                'uuid': row.get('uuid', '')
            }

print(f"Loaded metadata for {len(filename_metadata)} images from CSV")

# Scan controlled-envi directory
print("\n[2/4] Scanning controlled-envi directory...")
print("-" * 100)

if not controlled_dir.exists():
    print(f"ERROR: Directory not found: {controlled_dir}")
    exit(1)

files_in_controlled = list(controlled_dir.glob("*.jpg"))
stats['total_in_controlled'] = len(files_in_controlled)
print(f"Found {stats['total_in_controlled']} images in controlled-envi/")

# Categorize files
field_files = []  # Should be moved
controlled_files = []  # Should stay
unknown_files = []  # Not in CSV

for img_file in files_in_controlled:
    base_filename = img_file.name

    if base_filename in filename_metadata:
        metadata = filename_metadata[base_filename]
        capture_mode = metadata['capture_mode']

        if capture_mode == 'controlled':
            controlled_files.append((img_file, metadata))
            stats['correctly_labeled_controlled'] += 1
        elif capture_mode == 'field':
            field_files.append((img_file, metadata))
            stats['mislabeled_as_field'] += 1
        else:
            unknown_files.append((img_file, metadata))
    else:
        unknown_files.append((img_file, None))

print(f"\nCategorization:")
print(f"  - Correctly labeled 'controlled': {stats['correctly_labeled_controlled']} files (will stay)")
print(f"  - Mislabeled as 'field': {stats['mislabeled_as_field']} files (will move)")
print(f"  - Unknown/Not in CSV: {len(unknown_files)} files")

if unknown_files:
    print("\nWARNING: Found files not in CSV:")
    for img_file, metadata in unknown_files[:10]:
        print(f"  - {img_file.name}")
    if len(unknown_files) > 10:
        print(f"  ... and {len(unknown_files) - 10} more")

# Preview moves
print("\n[3/4] Preview of moves to be performed...")
print("-" * 100)

moves_by_municipality = defaultdict(list)
for img_file, metadata in field_files:
    municipality = metadata['municipality']
    moves_by_municipality[municipality].append(img_file.name)

for municipality, filenames in sorted(moves_by_municipality.items()):
    print(f"\n{municipality}: {len(filenames)} files")
    for filename in filenames[:5]:
        print(f"  - {filename}")
    if len(filenames) > 5:
        print(f"  ... and {len(filenames) - 5} more")

# Auto-confirm for non-interactive execution
print("\n" + "=" * 100)
print("READY TO REORGANIZE")
print("=" * 100)
print(f"Will move {stats['mislabeled_as_field']} files from controlled-envi/ to their municipality directories")
print(f"Will keep {stats['correctly_labeled_controlled']} files in controlled-envi/")
print("\nProceeding with reorganization...")

# Perform moves
print("\n[4/4] Moving files...")
print("-" * 100)

for img_file, metadata in field_files:
    municipality = metadata['municipality'].strip()

    # Determine destination directory
    # Handle La Trinidad -> Latrinidad normalization
    if municipality.lower().replace(' ', '') == 'latrinidad':
        dest_dir = repo_images / "Latrinidad"
    elif municipality.lower() == 'atok':
        dest_dir = repo_images / "Atok"
    else:
        # Capitalize first letter
        dest_dir = repo_images / municipality.capitalize()

    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_file = dest_dir / img_file.name

    try:
        if dest_file.exists():
            # File already exists in destination
            stats['skipped_already_exists'] += 1
            print(f"SKIP (exists): {img_file.name} -> {dest_dir.name}/")
            # Remove from controlled-envi since it exists in the correct location
            img_file.unlink()
        else:
            # Move the file
            shutil.move(str(img_file), str(dest_file))
            if dest_dir.name == 'Atok':
                stats['moved_to_atok'] += 1
            elif dest_dir.name == 'Latrinidad':
                stats['moved_to_latrinidad'] += 1
            print(f"MOVED: {img_file.name} -> {dest_dir.name}/")
    except Exception as e:
        print(f"ERROR moving {img_file.name}: {e}")
        stats['errors'] += 1

# Verify final state
print("\n" + "=" * 100)
print("VERIFICATION")
print("=" * 100)

final_count = sum(1 for _ in controlled_dir.glob("*.jpg"))
print(f"Images remaining in controlled-envi/: {final_count}")
print(f"Expected (correctly labeled 'controlled'): {stats['correctly_labeled_controlled']}")

if final_count == stats['correctly_labeled_controlled']:
    print("✓ PERFECT MATCH - All field images successfully moved!")
else:
    print(f"⚠ MISMATCH - Check for errors or unknown files")

# Final summary
print("\n" + "=" * 100)
print("SUMMARY")
print("=" * 100)
print(f"Total files processed: {stats['total_in_controlled']}")
print(f"Correctly labeled 'controlled' (stayed): {stats['correctly_labeled_controlled']}")
print(f"Mislabeled as 'field' (moved): {stats['mislabeled_as_field']}")
print(f"  - Moved to Atok/: {stats['moved_to_atok']}")
print(f"  - Moved to Latrinidad/: {stats['moved_to_latrinidad']}")
print(f"  - Skipped (already exists): {stats['skipped_already_exists']}")
print(f"Errors: {stats['errors']}")
print("=" * 100)
print("DONE!")
print("=" * 100)
