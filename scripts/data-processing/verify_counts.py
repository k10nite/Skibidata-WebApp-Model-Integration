import os
import pandas as pd
from pathlib import Path

# Paths
organized_dir = Path(r"C:\Users\Neil\Documents\thesis\organized_images")
csv_file = organized_dir / "combined_field_data.csv"

print("=" * 80)
print("VERIFICATION: IMAGES vs CSV ENTRIES")
print("=" * 80)

# Count actual image files
print("\n1. Counting actual image files in folders...")
actual_images = []
for municipality in ['Atok', 'Latrinidad']:
    municipality_path = organized_dir / municipality
    if municipality_path.exists():
        images = list(municipality_path.glob('*.jpg'))
        actual_images.extend([f.name for f in images])
        print(f"   {municipality}: {len(images)} files")

print(f"\n   TOTAL IMAGE FILES: {len(actual_images)}")

# Read CSV
print("\n2. Counting CSV entries...")
df = pd.read_csv(csv_file)
print(f"   TOTAL CSV ROWS: {len(df)}")

# Count unique images in CSV
print("\n3. Counting unique images referenced in CSV...")
df['image_basename'] = df['image_filename'].apply(lambda x: os.path.basename(x) if pd.notna(x) else None)
unique_in_csv = df['image_basename'].nunique()
print(f"   UNIQUE IMAGES IN CSV: {unique_in_csv}")

# Show specific examples of duplicates
print("\n4. Proof - showing actual duplicate examples:")
print("=" * 80)

duplicates = df[df.duplicated(subset=['image_basename'], keep=False)]
dup_images = duplicates.groupby('image_basename').size().sort_values(ascending=False)

print(f"\nShowing 5 images that have multiple CSV entries:\n")
for i, (img, count) in enumerate(list(dup_images.head(5).items())):
    print(f"Example {i+1}: {img}")
    print(f"  - Number of CSV entries: {count}")

    # Show the actual entries
    entries = df[df['image_basename'] == img][['uuid', 'spot_number', 'shot_number', 'capture_datetime', 'latitude', 'longitude']]
    print(f"  - CSV Rows:")
    for idx, row in entries.iterrows():
        print(f"      Row {idx}: UUID={row['uuid']}, Spot={row['spot_number']}, Shot={row['shot_number']}")

    # Check if file exists
    file_exists_atok = (organized_dir / 'Atok' / img).exists()
    file_exists_latrinidad = (organized_dir / 'Latrinidad' / img).exists()
    if file_exists_atok:
        print(f"  - File exists in: Atok/ (1 file)")
    elif file_exists_latrinidad:
        print(f"  - File exists in: Latrinidad/ (1 file)")
    else:
        print(f"  - File exists: NO")
    print()

# Final summary
print("=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"Physical image files on disk: {len(actual_images)}")
print(f"Unique images in CSV: {unique_in_csv}")
print(f"Total CSV entries: {len(df)}")
print(f"Duplicate CSV entries: {len(df) - unique_in_csv}")
print(f"\nConclusion: {'MATCH!' if len(actual_images) == unique_in_csv else 'MISMATCH!'}")
print("=" * 80)
