import csv
from pathlib import Path

print("="*100)
print("MERGE JAN16 METADATA INTO COMBINED_FIELD_DATA.CSV")
print("="*100)

# Paths
thesis_dir = Path(r"C:\Users\Neil\Documents\thesis")
organized_images = thesis_dir / "soil-fertility-classification-dataset" / "organized_images"
combined_csv = organized_images / "combined_field_data.csv"
jan16_csv = organized_images / "orphaned-jan16-no-metadata" / "jan16_betag_metadata.csv"

print(f"\n[1/4] Reading combined_field_data.csv...")
print("-" * 100)

# Read combined CSV
combined_rows = []
with open(combined_csv, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    combined_fieldnames = reader.fieldnames
    for row in reader:
        combined_rows.append(row)

print(f"Current rows in combined_field_data.csv: {len(combined_rows)}")
print(f"Columns: {len(combined_fieldnames)}")

print(f"\n[2/4] Reading jan16_betag_metadata.csv...")
print("-" * 100)

# Read Jan16 CSV
jan16_rows = []
with open(jan16_csv, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    jan16_fieldnames = reader.fieldnames
    for row in reader:
        jan16_rows.append(row)

print(f"Rows in jan16_betag_metadata.csv: {len(jan16_rows)}")
print(f"Columns: {len(jan16_fieldnames)}")

print(f"\n[3/4] Verifying column compatibility...")
print("-" * 100)

# Verify columns match
if combined_fieldnames != jan16_fieldnames:
    print("WARNING: Column mismatch!")
    combined_set = set(combined_fieldnames)
    jan16_set = set(jan16_fieldnames)

    only_in_combined = combined_set - jan16_set
    only_in_jan16 = jan16_set - combined_set

    if only_in_combined:
        print(f"Columns only in combined: {only_in_combined}")
    if only_in_jan16:
        print(f"Columns only in jan16: {only_in_jan16}")

    # Use combined fieldnames as master
    print(f"Using combined_field_data.csv column order as master")
else:
    print("Column structures match perfectly")

# Check for UUID conflicts
print("\nChecking for UUID conflicts...")
combined_uuids = {row['uuid'] for row in combined_rows if row.get('uuid')}
jan16_uuids = {row['uuid'] for row in jan16_rows if row.get('uuid')}
conflicts = combined_uuids & jan16_uuids

if conflicts:
    print(f"WARNING: {len(conflicts)} UUID conflicts found!")
    print(f"Sample conflicts: {list(conflicts)[:5]}")
    print("Renaming jan16 UUIDs to avoid conflicts...")

    # Rename conflicting UUIDs
    for row in jan16_rows:
        if row.get('uuid') in conflicts:
            old_uuid = row['uuid']
            row['uuid'] = f"betag_sf_{old_uuid}"
else:
    print("No UUID conflicts found")

print(f"\n[4/4] Merging and writing combined CSV...")
print("-" * 100)

# Merge rows
all_rows = combined_rows + jan16_rows

print(f"Total rows after merge: {len(all_rows)}")

# Write merged CSV
with open(combined_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=combined_fieldnames)
    writer.writeheader()
    writer.writerows(all_rows)

print(f"Wrote {len(all_rows)} rows to combined_field_data.csv")

print("\n" + "=" * 100)
print("SUMMARY")
print("=" * 100)
print(f"Original combined rows: {len(combined_rows)}")
print(f"Jan16 rows added: {len(jan16_rows)}")
print(f"Final total rows: {len(all_rows)}")
print(f"New total images: {len(all_rows)}")
print("=" * 100)
print("DONE!")
print("=" * 100)
