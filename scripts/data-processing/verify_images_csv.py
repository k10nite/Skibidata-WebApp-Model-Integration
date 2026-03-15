import os
import pandas as pd
from pathlib import Path

# Paths
organized_dir = Path(r"C:\Users\Neil\Documents\thesis\organized_images")
csv_file = organized_dir / "combined_field_data.csv"

print("=" * 80)
print("IMAGE-CSV VERIFICATION")
print("=" * 80)

# Read CSV
print("\nReading CSV file...")
df = pd.read_csv(csv_file)
print(f"Total CSV entries: {len(df)}")

# Get image filenames from CSV (extract just the basename, not full path)
csv_images_raw = df['image_filename'].dropna().unique()
csv_images = set([os.path.basename(img) for img in csv_images_raw])
print(f"Unique images in CSV: {len(csv_images)}")

# Get actual image files from folders
print("\nScanning organized folders...")
actual_images = set()

for municipality in ['Atok', 'Latrinidad']:
    municipality_path = organized_dir / municipality
    if municipality_path.exists():
        images = [f.name for f in municipality_path.glob('*.jpg')]
        actual_images.update(images)
        print(f"  {municipality}: {len(images)} files")

print(f"\nTotal actual images: {len(actual_images)}")

# Compare
print("\n" + "=" * 80)
print("COMPARISON RESULTS")
print("=" * 80)

# Images in CSV but not in folders
missing_images = csv_images - actual_images
if missing_images:
    print(f"\n[WARNING] MISSING IMAGES ({len(missing_images)}): Referenced in CSV but not found in folders")
    for img in sorted(list(missing_images)[:10]):
        print(f"  - {img}")
    if len(missing_images) > 10:
        print(f"  ... and {len(missing_images) - 10} more")
else:
    print("\n[OK] All images in CSV are present in folders")

# Images in folders but not in CSV
orphaned_images = actual_images - csv_images
if orphaned_images:
    print(f"\n[WARNING] ORPHANED IMAGES ({len(orphaned_images)}): In folders but not in CSV")
    for img in sorted(list(orphaned_images)[:10]):
        print(f"  - {img}")
    if len(orphaned_images) > 10:
        print(f"  ... and {len(orphaned_images) - 10} more")
else:
    print("\n[OK] All images in folders are referenced in CSV")

# Matching images
matching_images = csv_images & actual_images
print(f"\n[OK] MATCHING: {len(matching_images)} images have both file and CSV entry")

# Summary
print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"CSV entries: {len(df)}")
print(f"Unique images in CSV: {len(csv_images)}")
print(f"Actual image files: {len(actual_images)}")
print(f"Matching: {len(matching_images)}")
print(f"Missing (in CSV, not in folders): {len(missing_images)}")
print(f"Orphaned (in folders, not in CSV): {len(orphaned_images)}")

# Match percentage
if len(csv_images) > 0:
    match_rate = (len(matching_images) / len(csv_images)) * 100
    print(f"\nMatch rate: {match_rate:.1f}%")

# Check for duplicate entries
print("\n" + "=" * 80)
print("DUPLICATE CHECK")
print("=" * 80)
duplicates = df[df.duplicated(subset=['image_filename'], keep=False)]
if len(duplicates) > 0:
    print(f"\n[WARNING] Found {len(duplicates)} duplicate entries in CSV")
    dup_images = duplicates['image_filename'].unique()
    print(f"Images with duplicates: {len(dup_images)}")
    for img in sorted(dup_images)[:5]:
        count = len(df[df['image_filename'] == img])
        print(f"  - {img}: {count} entries")
    if len(dup_images) > 5:
        print(f"  ... and {len(dup_images) - 5} more")
else:
    print("\n[OK] No duplicate entries found")

print("\n" + "=" * 80)
