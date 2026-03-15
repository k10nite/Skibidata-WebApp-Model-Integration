import os
import csv
import shutil
from pathlib import Path
from collections import defaultdict

print("="*100)
print("COMPLETE THESIS IMAGE INTEGRATION")
print("="*100)

# Paths
thesis_dir = Path(r"C:\Users\Neil\Documents\thesis")
repo_images = thesis_dir / "soil-fertility-classification-dataset" / "organized_images"
combined_csv = repo_images / "combined_field_data.csv"

# Directories to scan
dylan_dir = thesis_dir / "dylan"
liam_dir = thesis_dir / "liam"

# Get current repository inventory
print("\n[1/5] Inventorying current repository...")
repo_images_set = set()
for img_file in repo_images.rglob("*.jpg"):
    repo_images_set.add(img_file.name)
print(f"Repository has {len(repo_images_set)} images")

# Read existing CSV
existing_csv_rows = []
csv_header = None
if combined_csv.exists():
    with open(combined_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        csv_header = reader.fieldnames
        existing_csv_rows = list(reader)
print(f"Repository CSV has {len(existing_csv_rows)} rows")

# Find all CSV files with field data
print("\n[2/5] Scanning for all field-mode CSV data...")
all_csv_files = []

# Dylan CSVs
for csv_file in dylan_dir.rglob("*.csv"):
    if csv_file.is_file() and "agricapture" in csv_file.name.lower():
        all_csv_files.append(csv_file)

# Liam CSVs
for csv_file in liam_dir.rglob("*.csv"):
    if csv_file.is_file() and "agricapture" in csv_file.name.lower():
        all_csv_files.append(csv_file)

print(f"Found {len(all_csv_files)} CSV files")

# Process all CSVs
print("\n[3/5] Extracting field-mode data from CSVs...")
new_field_data = []
new_images_needed = defaultdict(list)  # {image_filename: [csv_row, source_path]}

for csv_file in all_csv_files:
    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Only process field mode
                if row.get('capture_mode', '').strip().lower() != 'field':
                    continue

                image_filename = row.get('image_filename', '')
                if not image_filename:
                    continue

                # Get just the base filename
                base_filename = os.path.basename(image_filename)

                # Check if already in repo
                if base_filename in repo_images_set:
                    continue  # Skip, already have it

                # Check if already in existing CSV rows
                already_in_csv = any(
                    os.path.basename(r.get('image_filename', '')) == base_filename
                    for r in existing_csv_rows
                )
                if already_in_csv:
                    continue

                # Find the actual image file
                csv_dir = csv_file.parent

                # Try to find the image in the same directory or subdirectories
                possible_paths = [
                    csv_dir / image_filename,  # Full relative path
                    csv_dir / base_filename,    # Just filename
                ]

                # Also search in parent directories
                for i in range(3):
                    search_dir = csv_dir
                    for _ in range(i):
                        search_dir = search_dir.parent
                    possible_paths.extend([
                        search_dir / image_filename,
                        search_dir / base_filename,
                    ])

                # Find actual file
                source_path = None
                for p in possible_paths:
                    if p.exists() and p.is_file():
                        source_path = p
                        break

                if not source_path:
                    # Try searching more broadly
                    for img in csv_dir.rglob(base_filename):
                        source_path = img
                        break

                if source_path:
                    new_images_needed[base_filename] = (row, source_path)
                    new_field_data.append(row)

    except Exception as e:
        print(f"Error reading {csv_file.name}: {e}")

print(f"Found {len(new_field_data)} new field-mode rows")
print(f"Found {len(new_images_needed)} new images to add")

# Add missing data
if new_field_data:
    print("\n[4/5] Adding missing data...")

    # Append CSV data
    with open(combined_csv, 'a', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=csv_header)
        writer.writerows(new_field_data)

    print(f"Added {len(new_field_data)} rows to CSV")

    # Copy images
    copied = 0
    for base_filename, (row, source_path) in new_images_needed.items():
        municipality = row.get('municipality', 'Unknown').replace(' ', '').capitalize()
        if municipality == 'Latrinidad' or municipality == 'Latrinidad':
            dest_dir = repo_images / "Latrinidad"
        else:
            dest_dir = repo_images / municipality

        dest_dir.mkdir(parents=True, exist_ok=True)
        dest_file = dest_dir / base_filename

        try:
            if not dest_file.exists():
                shutil.copy2(source_path, dest_file)
                copied += 1
        except Exception as e:
            print(f"Error copying {base_filename}: {e}")

    print(f"Copied {copied} images")

# Verify
print("\n[5/5] Verifying final counts...")
final_images = sum(1 for _ in repo_images.rglob("*.jpg"))
final_csv_rows = sum(1 for _ in open(combined_csv, 'r', encoding='utf-8')) - 1

print("\n" + "="*100)
print("SUMMARY")
print("="*100)
print(f"Images:     {len(repo_images_set)} -> {final_images}")
print(f"CSV Rows:   {len(existing_csv_rows)} -> {final_csv_rows}")
print(f"New Added:  {len(new_field_data)} field-mode records")
print("="*100)
