import os
from pathlib import Path

organized = Path(r'C:\Users\Neil\Documents\thesis\organized_images')
source = Path(r'C:\Users\Neil\Documents\thesis\images')

print("=" * 80)
print("ORGANIZED IMAGES CHECK")
print("=" * 80)

# Check organized folder
print("\nOrganized folder contents:")
for d in organized.iterdir():
    if d.is_dir():
        count = len([f for f in d.iterdir() if f.suffix.lower() == '.jpg'])
        print(f"  {d.name}: {count} images")
    elif d.suffix.lower() == '.csv':
        print(f"  {d.name} (CSV file)")

# Check if any images remain in source
remaining_images = []
for root, dirs, files in os.walk(source):
    for file in files:
        if file.lower().endswith('.jpg'):
            remaining_images.append(os.path.join(root, file))

print(f"\nRemaining images in source directory: {len(remaining_images)}")
if remaining_images:
    print("Sample of remaining images:")
    for img in remaining_images[:10]:
        print(f"  - {img}")

# Total count
total_organized = sum([len([f for f in d.iterdir() if f.suffix.lower() == '.jpg'])
                       for d in organized.iterdir() if d.is_dir()])
print(f"\nTotal images organized: {total_organized}")
print(f"Total images remaining: {len(remaining_images)}")
print(f"Grand total: {total_organized + len(remaining_images)}")
