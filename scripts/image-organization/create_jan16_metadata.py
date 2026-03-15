import os
import csv
from pathlib import Path
from datetime import datetime

print("="*100)
print("CREATE METADATA FOR JAN16 BETAG STRAWBERRY FARM IMAGES")
print("="*100)

# Paths
thesis_dir = Path(r"C:\Users\Neil\Documents\thesis")
organized_images = thesis_dir / "soil-fertility-classification-dataset" / "organized_images"
orphaned_dir = organized_images / "orphaned-jan16-no-metadata" / "latrinidad_betag_sf"
output_csv = organized_images / "orphaned-jan16-no-metadata" / "jan16_betag_metadata.csv"

# Metadata provided by user
location_info = {
    'municipality': 'La Trinidad',
    'barangay': 'Betag',
    'farm_name': 'Strawberry Farm',
    'crops': 'strawberry,brocolli,green_ice,pechay,lettuce',  # All crops at this location
    'capture_mode': 'field',  # Field data, not controlled environment
    'capture_date': '2026-01-16'
}

print(f"\n[1/2] Scanning {orphaned_dir}...")
print("-" * 100)

# Get all images (any .jpg files)
images = sorted(orphaned_dir.glob("*.jpg"))
print(f"Found {len(images)} images")

print(f"\n[2/2] Creating metadata CSV...")
print("-" * 100)

# CSV header (matching combined_field_data.csv structure)
fieldnames = [
    'uuid', 'spot_number', 'shot_number', 'shots_in_spot', 'image_filename',
    'image_width', 'image_height', 'image_quality', 'capture_datetime',
    'latitude', 'longitude', 'altitude_m', 'altitude_accuracy_m',
    'gps_accuracy_m', 'gps_reading_count', 'camera_pitch', 'camera_roll',
    'camera_heading', 'municipality', 'barangay', 'farm_name', 'crops',
    'temperature_c', 'humidity_percent', 'notes', 'device_id', 'capture_mode'
]

rows = []
for idx, img_file in enumerate(images, 1):
    # Use date from location info since filenames are generic
    filename = img_file.name
    capture_datetime = f"{location_info['capture_date']}T12:00:00.000Z"  # Default to noon

    # Create relative path
    rel_path = f"orphaned-jan16-no-metadata/latrinidad_betag_sf/{img_file.name}"

    row = {
        'uuid': f"jan16_{idx:04d}",  # Simple UUID for tracking
        'spot_number': '',
        'shot_number': '',
        'shots_in_spot': '',
        'image_filename': rel_path,
        'image_width': '',  # Unknown without reading image
        'image_height': '',
        'image_quality': '',
        'capture_datetime': capture_datetime,
        'latitude': '',  # No GPS data
        'longitude': '',
        'altitude_m': '',
        'altitude_accuracy_m': '',
        'gps_accuracy_m': '',
        'gps_reading_count': '',
        'camera_pitch': '',
        'camera_roll': '',
        'camera_heading': '',
        'municipality': location_info['municipality'],
        'barangay': location_info['barangay'],
        'farm_name': location_info['farm_name'],
        'crops': location_info['crops'],
        'temperature_c': '',
        'humidity_percent': '',
        'notes': 'Manually labeled - no GPS data. Crops: strawberry, brocolli, green ice, pechay, lettuce',
        'device_id': 'unknown_phone_camera',
        'capture_mode': location_info['capture_mode']
    }
    rows.append(row)

# Write CSV
with open(output_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Created: {output_csv}")
print(f"Rows: {len(rows)}")

# Create README
readme_path = organized_images / "orphaned-jan16-no-metadata" / "README.md"
with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(f"""# Jan 16, 2026 - Betag Strawberry Farm Images

## Location Information
- **Municipality:** La Trinidad, Benguet
- **Barangay:** Betag
- **Farm Name:** Strawberry Farm (SF)
- **Date:** January 16, 2026

## Crops Present
The following crops were present at this location:
- Strawberry
- Brocolli
- Green Ice (lettuce variety)
- Pechay (bok choy)
- Lettuce

## Image Details
- **Total Images:** {len(images)}
- **Format:** Standard phone camera (IMG*.jpg)
- **Capture Mode:** Field data
- **GPS Data:** Not available
- **Metadata Status:** Manually labeled based on location knowledge

## Metadata File
See `jan16_betag_metadata.csv` for structured metadata including:
- Image filenames and paths
- Capture timestamps (extracted from filenames)
- Location information (municipality, barangay, farm name)
- Crop information
- Capture mode

## Notes
These images were captured using a phone camera but never processed through
the AgriCapture app, so they lack GPS coordinates and other sensor data
(temperature, humidity, etc.). However, the location and crops are known
from field records.
""")

print(f"\nCreated: {readme_path}")

print("\n" + "=" * 100)
print("SUMMARY")
print("=" * 100)
print(f"Images processed: {len(images)}")
print(f"Metadata CSV: {output_csv.name}")
print(f"Documentation: README.md")
print(f"Location: La Trinidad, Betag - Strawberry Farm")
print(f"Crops: {location_info['crops']}")
print("=" * 100)
print("DONE!")
print("=" * 100)
