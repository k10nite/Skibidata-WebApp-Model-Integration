import os
import shutil
from pathlib import Path
from collections import defaultdict
import pandas as pd

# Base directory
source_dir = r"C:\Users\Neil\Documents\thesis\images"
output_dir = r"C:\Users\Neil\Documents\thesis\organized_images"

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Dictionary to store file counts
organized_files = defaultdict(int)
csv_files = []

print("=" * 80)
print("IMAGE ORGANIZATION SCRIPT")
print("=" * 80)
print(f"\nSource directory: {source_dir}")
print(f"Output directory: {output_dir}")
print("\nScanning files...")

# Walk through all directories
for root, dirs, files in os.walk(source_dir):
    for file in files:
        full_path = os.path.join(root, file)

        # Handle JPG images
        if file.lower().endswith('.jpg'):
            # Extract municipality from filename (first part before underscore)
            # Expected pattern: {municipality}_{sublocation}_{category}_{date}_{time}_{hash}.jpg
            parts = file.replace('.jpg', '').split('_')

            if len(parts) >= 1:
                # Use first part as municipality name
                municipality = parts[0].capitalize()

                # Create destination folder
                dest_folder = os.path.join(output_dir, municipality)
                os.makedirs(dest_folder, exist_ok=True)

                # Destination file path
                dest_file = os.path.join(dest_folder, file)

                # Move file (use shutil.move to cut, not copy)
                try:
                    shutil.move(full_path, dest_file)
                    organized_files[municipality] += 1
                except Exception as e:
                    print(f"Error moving {file}: {e}")
            else:
                # File doesn't match expected pattern
                other_folder = os.path.join(output_dir, "_uncategorized")
                os.makedirs(other_folder, exist_ok=True)
                dest_file = os.path.join(other_folder, file)
                try:
                    shutil.move(full_path, dest_file)
                    organized_files["_uncategorized"] += 1
                except Exception as e:
                    print(f"Error moving {file}: {e}")

        # Collect CSV files
        elif file.lower().endswith('.csv'):
            csv_files.append(full_path)

# Print summary
print("\n" + "=" * 80)
print("ORGANIZATION COMPLETE")
print("=" * 80)
print(f"\nTotal municipalities: {len(organized_files)}")
print("\nFiles organized per municipality:")
for municipality, count in sorted(organized_files.items(), key=lambda x: x[1], reverse=True):
    print(f"  {municipality}: {count} files")

# Handle CSV files
print("\n" + "=" * 80)
print("CSV FILES FOUND")
print("=" * 80)
print(f"\nTotal CSV files found: {len(csv_files)}")

if csv_files:
    print("\nCSV files:")
    for csv_file in csv_files:
        print(f"  - {os.path.basename(csv_file)} ({os.path.dirname(csv_file)})")

    # Attempt to combine CSV files
    print("\nAttempting to combine CSV files...")

    all_data = []
    for csv_file in csv_files:
        try:
            df = pd.read_csv(csv_file)
            # Add source file column
            df['source_file'] = os.path.basename(csv_file)
            df['source_directory'] = os.path.basename(os.path.dirname(csv_file))
            all_data.append(df)
            print(f"  [OK] Loaded {os.path.basename(csv_file)} ({len(df)} rows)")
        except Exception as e:
            print(f"  [ERROR] Loading {os.path.basename(csv_file)}: {e}")

    if all_data:
        # Combine all dataframes
        combined_df = pd.concat(all_data, ignore_index=True)

        # Save combined CSV
        output_csv = os.path.join(output_dir, "combined_field_data.csv")
        combined_df.to_csv(output_csv, index=False)

        print(f"\n[SUCCESS] Combined CSV saved to: {output_csv}")
        print(f"  Total rows: {len(combined_df)}")
        print(f"  Total columns: {len(combined_df.columns)}")
        print(f"\n  Columns: {', '.join(combined_df.columns.tolist())}")

print("\n" + "=" * 80)
print("ALL TASKS COMPLETED")
print("=" * 80)
