# Thesis Directory Organization Plan

**Generated:** 2026-03-15

## Current Issues
- 60+ files scattered in root directory
- Multiple dataset directories mixed with application code
- Analysis files, scripts, and documentation not organized
- Difficult to navigate and find specific files

## Proposed Structure

```
thesis/
├── AgriCapture/                    [KEEP - Main React Native app]
├── datasets/                       [NEW - All datasets consolidated]
│   ├── soil-fertility/            (6.4G - renamed for clarity)
│   ├── field-images-dylan/        (3.0G - renamed)
│   ├── field-images-liam/         (254M - renamed)
│   ├── organized-images/          (549M)
│   ├── skibidata/                 (5.2M - extracted zip)
│   └── _archive/                  (old zip files)
├── scripts/                        [NEW - All Python processing scripts]
│   ├── data-processing/
│   ├── image-organization/
│   └── poster-generation/
├── docs/                           [NEW - All documentation]
│   ├── design/                    (design system, layouts, specs)
│   ├── setup/                     (setup guides, deployment)
│   ├── reports/                   (field images, controlled env)
│   └── thesis/                    (thesis proposal, defense guide)
├── analysis/                       [NEW - Temporary analysis outputs]
│   ├── filename-lists/
│   ├── comparison-reports/
│   └── csv-exports/
├── media/                          [NEW - Images and posters]
│   ├── logos/
│   └── posters/
├── web-interface/                  [NEW - Web UI if separate]
│   ├── src/
│   ├── public/
│   ├── dist/
│   └── node_modules/
├── config/                         [NEW - Misc configs]
│   └── kimi/
└── [Root - Essential files only]
    ├── README.md
    ├── .gitignore
    ├── .env
    ├── .claude/
    └── SkibiDATA - Thesis Proposal.pdf
```

## File Categorization

### Python Scripts (30+ files)
**Data Processing:**
- complete_integration.py
- analyze_images.py
- check_organized.py
- clean_csv_missing_images.py
- examine_duplicates.py
- verify_counts.py
- verify_images_csv.py

**Image Organization:**
- organize_images.py
- reorganize_controlled_envi.py
- create_jan16_metadata.py
- rename_jan16_to_proper_names.py
- rename_to_uniform_format.py
- fill_shots_in_spot.py
- deduplicate_combined_csv.py

**Poster Generation:**
- generate_lupai_poster.py (+ v2, v3, final variants)
- print_poster.py
- generate_ui.py

### Documentation (20+ files)
**Design Docs:**
- ANIMATION_FLOW_DESIGN.md
- design-system.md
- screen-layouts.md
- component-index.md
- PREMIUM_DESIGN_SYSTEM_GUIDE.md
- PREMIUM_VISUAL_REFERENCE.md
- PREMIUM_INDEX.md
- PREMIUM_DESIGN_SUMMARY.md
- EXAMPLE_SCREEN_IMPLEMENTATION.jsx
- UI_DESIGN_SPECIFICATION.md
- poster-content-strategy.md

**Setup/Deployment:**
- README.md
- SETUP_GUIDE.md
- PROJECT_STRUCTURE.md
- RAILWAY_DEPLOYMENT.md
- QUICK_START_PREMIUM.md
- PROTOTYPE_COMPLETE.md

**Reports:**
- FIELD_IMAGES_COMPLETE_INVENTORY.txt
- field_images_report.txt
- CONTROLLED_ENVI_REORGANIZATION_REPORT.md
- SCAN_RESULTS_SUMMARY.txt
- QUICK_REFERENCE.txt
- organization_summary.txt

**Thesis:**
- SkibiDATA - Thesis Proposal.pdf
- thesis-defense-guide.html

### Analysis Files (20+ .txt files)
**Filename Lists:**
- all_available_filenames.txt
- csv_basefilenames.txt
- csv_filenames.txt
- dylan_filenames.txt
- liam_filenames.txt
- organized_filenames.txt
- dylan_only.txt
- liam_only_not_in_organized.txt

**Comparison Reports:**
- dylan_liam_combined.txt
- dylan_liam_not_in_organized.txt
- dylan_not_in_organized.txt
- dylan_in_organized.txt
- missing_from_organized.txt
- truly_missing.txt
- dylan_unique_images.txt

**CSV Exports:**
- field_images_filelist.csv

### Media Files
**Logos:**
- ABG.jpg

**Posters:**
- PUBMAT.png (5 variants)
- pubs.png
- pubsret.png

**HTML Outputs:**
- soilscan_poster.html
- soilscan_poster_output.html
- lupai_poster_output.txt

### Config Files
**Kimi Configs:**
- kimi_config.toml
- %USERPROFILE%.kimiconfig.toml
- kimi_poster_prompt.txt
- kimi_screens_prompt.txt
- soilscan_poster_prompt_detailed.txt

**Web Dev Configs (check if for AgriCapture or separate):**
- package.json
- package-lock.json
- tailwind.config.js
- vite.config.js
- postcss.config.js
- .eslintrc.cjs
- .eslintignore
- .prettierrc
- .prettierignore

### To Archive/Delete
- nul (empty file)
- CLAUDE.md (empty file in root - should use .claude/CLAUDE.md)
- SkibiData - iCREATE.zip (after extracting to datasets/)

## Implementation Steps

1. **Create directory structure**
2. **Move datasets** (largest files first)
3. **Categorize and move scripts**
4. **Organize documentation**
5. **Move analysis files**
6. **Move media files**
7. **Handle web interface files**
8. **Move config files**
9. **Clean up root directory**
10. **Update paths in scripts/configs if needed**
11. **Test AgriCapture still works**
12. **Commit changes**

## Notes
- Total dataset size: ~10.2GB (handle with care)
- AgriCapture is 3GB (likely includes node_modules)
- Keep .gitignore updated to exclude large datasets if not tracked
- May need to update import paths in scripts after reorganization
- Check if web-interface (src/, public/) is part of AgriCapture or separate project
