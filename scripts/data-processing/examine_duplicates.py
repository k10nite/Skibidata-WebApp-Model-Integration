import os
import pandas as pd
from pathlib import Path

# Paths
organized_dir = Path(r"C:\Users\Neil\Documents\thesis\organized_images")
csv_file = organized_dir / "combined_field_data.csv"

print("=" * 80)
print("EXAMINING DUPLICATE ENTRIES")
print("=" * 80)

# Read CSV
df = pd.read_csv(csv_file)
print(f"\nTotal CSV entries: {len(df)}")

# Find duplicates based on image_filename
duplicates = df[df.duplicated(subset=['image_filename'], keep=False)]
print(f"Duplicate entries found: {len(duplicates)}")

# Get unique images that have duplicates
dup_images = duplicates['image_filename'].unique()
print(f"Images with duplicate entries: {len(dup_images)}")

# Examine a few examples in detail
print("\n" + "=" * 80)
print("SAMPLE DUPLICATE ANALYSIS")
print("=" * 80)

for i, img in enumerate(sorted(dup_images)[:3]):
    print(f"\n--- Example {i+1} ---")
    img_basename = os.path.basename(img)
    print(f"Image: {img_basename}")

    # Get all rows for this image
    rows = df[df['image_filename'] == img]
    print(f"Number of entries: {len(rows)}")

    # Show key fields
    print("\nDetails:")
    for idx, row in rows.iterrows():
        print(f"  Entry {idx}:")
        print(f"    UUID: {row['uuid']}")
        print(f"    Spot: {row['spot_number']}, Shot: {row['shot_number']}")
        print(f"    Municipality: {row['municipality']}, Barangay: {row['barangay']}")
        print(f"    Capture time: {row['capture_datetime']}")
        print(f"    Lat/Lon: {row['latitude']}, {row['longitude']}")

    # Check if they're truly identical
    cols_to_check = ['spot_number', 'shot_number', 'latitude', 'longitude', 'capture_datetime']
    if len(rows) > 1:
        first_row = rows.iloc[0][cols_to_check]
        all_same = True
        for idx in range(1, len(rows)):
            if not rows.iloc[idx][cols_to_check].equals(first_row):
                all_same = False
                break

        if all_same:
            print("\n  [WARNING] These entries appear to be IDENTICAL (same spot, shot, location, time)")
        else:
            print("\n  [INFO] These entries have DIFFERENT data (different spots or metadata)")

# Summary by duplicate count
print("\n" + "=" * 80)
print("DUPLICATE COUNT BREAKDOWN")
print("=" * 80)

dup_counts = duplicates.groupby('image_filename').size()
print(f"\nImages with 2 entries: {len(dup_counts[dup_counts == 2])}")
print(f"Images with 3 entries: {len(dup_counts[dup_counts == 3])}")
print(f"Images with 4+ entries: {len(dup_counts[dup_counts >= 4])}")

print("\n" + "=" * 80)
