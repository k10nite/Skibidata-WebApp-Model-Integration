import os
import pandas as pd
from pathlib import Path

# Paths
organized_dir = Path(r"C:\Users\Neil\Documents\thesis\organized_images")
csv_file = organized_dir / "combined_field_data.csv"

print("=" * 80)
print("CLEANING CSV - REMOVING RECORDS WITH MISSING IMAGES")
print("=" * 80)

# Read CSV
print("\nReading CSV file...")
df = pd.read_csv(csv_file)
initial_count = len(df)
print(f"Initial CSV entries: {initial_count}")

# Get actual image files from folders
print("\nScanning organized folders for actual images...")
actual_images = set()

for municipality in ['Atok', 'Latrinidad']:
    municipality_path = organized_dir / municipality
    if municipality_path.exists():
        images = [f.name for f in municipality_path.glob('*.jpg')]
        actual_images.update(images)

print(f"Total actual images found: {len(actual_images)}")

# Filter CSV to only include rows where the image file exists
print("\nFiltering CSV records...")
df['image_basename'] = df['image_filename'].apply(lambda x: os.path.basename(x) if pd.notna(x) else None)
df_cleaned = df[df['image_basename'].isin(actual_images)]

# Drop the temporary column
df_cleaned = df_cleaned.drop(columns=['image_basename'])

removed_count = initial_count - len(df_cleaned)

print(f"\nRecords removed: {removed_count}")
print(f"Records remaining: {len(df_cleaned)}")

# Save cleaned CSV
df_cleaned.to_csv(csv_file, index=False)

print(f"\n[SUCCESS] Cleaned CSV saved to: {csv_file}")

# Show which images were removed
if removed_count > 0:
    df['image_basename'] = df['image_filename'].apply(lambda x: os.path.basename(x) if pd.notna(x) else None)
    removed_images = set(df['image_basename']) - set(df_cleaned['image_filename'].apply(lambda x: os.path.basename(x) if pd.notna(x) else None))

    print(f"\nImages removed from CSV ({len(removed_images)}):")
    for img in sorted(removed_images)[:27]:
        count = len(df[df['image_basename'] == img])
        print(f"  - {img} ({count} entries removed)")

print("\n" + "=" * 80)
print("CLEANING COMPLETE")
print("=" * 80)
