import os
from pathlib import Path
from collections import defaultdict
import re

# Base directory
base_dir = r"C:\Users\Neil\Documents\thesis\images"

# Analyze the images
image_files = []
patterns = defaultdict(list)

# Walk through all directories
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.lower().endswith('.jpg'):
            full_path = os.path.join(root, file)
            image_files.append(full_path)

            # Extract pattern from filename
            # Expected pattern: {location}_{sublocation}_{category}_{date}_{time}_{hash}.jpg
            parts = file.replace('.jpg', '').split('_')
            if len(parts) >= 3:
                # First 3 parts define the category
                pattern_key = '_'.join(parts[0:3])
                patterns[pattern_key].append(full_path)

print(f"Total images found: {len(image_files)}")
print(f"\nUnique patterns found: {len(patterns)}")
print("\nPattern breakdown:")
print("-" * 80)

for pattern, files in sorted(patterns.items(), key=lambda x: len(x[1]), reverse=True):
    print(f"{pattern}: {len(files)} files")
