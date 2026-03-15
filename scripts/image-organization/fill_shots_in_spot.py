import csv
from pathlib import Path
from collections import defaultdict

print("="*100)
print("FILL SHOTS_IN_SPOT COLUMN")
print("="*100)

# Paths
thesis_dir = Path(r"C:\Users\Neil\Documents\thesis")
organized_images = thesis_dir / "soil-fertility-classification-dataset" / "organized_images"
metadata_csv = organized_images / "orphaned-jan16-no-metadata" / "jan16_betag_metadata.csv"

print(f"\n[1/3] Reading CSV and counting shots per spot...")
print("-" * 100)

# Read CSV
rows = []
with open(metadata_csv, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for row in reader:
        rows.append(row)

print(f"Total rows: {len(rows)}")

# Count shots per spot
shots_per_spot = defaultdict(int)
for row in rows:
    spot = row.get('spot_number', '')
    if spot:
        shots_per_spot[spot] += 1

print(f"Unique spots: {len(shots_per_spot)}")
print("\nShots per spot:")
for spot in sorted(shots_per_spot.keys(), key=lambda x: int(x) if x.isdigit() else 0):
    print(f"  Spot {spot}: {shots_per_spot[spot]} shots")

print(f"\n[2/3] Filling shots_in_spot column...")
print("-" * 100)

# Fill in shots_in_spot for each row
updated_count = 0
for row in rows:
    spot = row.get('spot_number', '')
    if spot and spot in shots_per_spot:
        row['shots_in_spot'] = str(shots_per_spot[spot])
        updated_count += 1

print(f"Updated {updated_count} rows")

print(f"\n[3/3] Writing updated CSV...")
print("-" * 100)

# Write updated CSV
with open(metadata_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Wrote {len(rows)} rows to {metadata_csv.name}")

print("\n" + "=" * 100)
print("SUMMARY")
print("=" * 100)
print(f"Total rows updated: {updated_count}")
print(f"Spots found: {len(shots_per_spot)}")
print(f"shots_in_spot column now populated")
print("=" * 100)
print("DONE!")
print("=" * 100)
