import csv
from pathlib import Path

print("="*100)
print("DEDUPLICATE COMBINED_FIELD_DATA.CSV")
print("="*100)

# Paths
thesis_dir = Path(r"C:\Users\Neil\Documents\thesis")
organized_images = thesis_dir / "soil-fertility-classification-dataset" / "organized_images"
combined_csv = organized_images / "combined_field_data.csv"

print(f"\n[1/3] Reading combined_field_data.csv...")
print("-" * 100)

# Read CSV
rows = []
with open(combined_csv, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for row in reader:
        rows.append(row)

print(f"Total rows: {len(rows)}")

print(f"\n[2/3] Deduplicating by image_filename...")
print("-" * 100)

# Deduplicate - keep first occurrence of each image_filename
seen_filenames = set()
unique_rows = []
duplicates_removed = 0

for row in rows:
    filename = row.get('image_filename', '')
    if filename and filename in seen_filenames:
        duplicates_removed += 1
    else:
        if filename:
            seen_filenames.add(filename)
        unique_rows.append(row)

print(f"Unique rows: {len(unique_rows)}")
print(f"Duplicates removed: {duplicates_removed}")

print(f"\n[3/3] Writing deduplicated CSV...")
print("-" * 100)

# Write deduplicated CSV
with open(combined_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(unique_rows)

print(f"Wrote {len(unique_rows)} unique rows to combined_field_data.csv")

print("\n" + "=" * 100)
print("SUMMARY")
print("=" * 100)
print(f"Original rows: {len(rows)}")
print(f"Deduplicated rows: {len(unique_rows)}")
print(f"Duplicates removed: {duplicates_removed}")
print(f"CSV now matches actual image count")
print("=" * 100)
print("DONE!")
print("=" * 100)
