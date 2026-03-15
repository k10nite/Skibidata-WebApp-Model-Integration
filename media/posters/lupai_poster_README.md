# LupAI Academic Research Poster

## Overview
Professional A0 landscape research poster for LupAI - an AI-powered fertilizer recommendation system for Filipino farmers.

## File Information
- **Main File**: `lupai_poster.html`
- **Dimensions**: A0 Landscape (33.1" × 46.8" / 841mm × 1189mm)
- **Format**: HTML/CSS (print-ready)

## Design Specifications

### Color Scheme
| Color | Hex Code | Usage |
|-------|----------|-------|
| Rice Green | #84934A | Primary accent, highlights |
| Deep Green | #2E7D32 | Headers, important elements |
| Clay Dark | #492828 | Text, borders, footer |
| Rice White | #FAFAF8 | Background |
| Light Green | #A8B566 | Secondary accents |
| Accent Orange | #D4853B | Highlights, warnings |

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Inter Bold (700-800 weight)
- **Body Text**: Inter Regular (400 weight)

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                              │
├──────────────┬───────────────────────┬──────────────────────┤
│              │                       │                      │
│   LEFT       │       MIDDLE          │      RIGHT           │
│   COLUMN     │       COLUMN          │      COLUMN          │
│              │                       │                      │
│ 1. Problem   │ 4. Soil Analysis      │ 7. Results & Impact  │
│ 2. Objectives│ 5. UI Screenshots     │ 8. Technology Stack  │
│ 3. Methodology│6. Fertilizer Table   │ 9. Key Features      │
│              │                       │ 10. Conclusion       │
│              │                       │ 11. QR Code          │
│              │                       │                      │
├──────────────┴───────────────────────┴──────────────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

## Printing Instructions

### Method 1: Browser Print (Recommended)
1. Open `lupai_poster.html` in Google Chrome or Microsoft Edge
2. Press `Ctrl + P` (or `Cmd + P` on Mac)
3. Settings:
   - **Destination**: Save as PDF or select large-format printer
   - **Paper Size**: A0 (841 × 1189 mm) or Custom: 46.8" × 33.1"
   - **Orientation**: Landscape
   - **Margins**: None
   - **Scale**: 100%
   - **Background Graphics**: ON (essential for colors)
4. Click Print/Save

### Method 2: Professional Print Shop
1. Send `lupai_poster.html` and `lupai_poster.pdf` (if converted)
2. Specify:
   - Size: A0 Landscape (841mm × 1189mm)
   - Paper: Matte or glossy photo paper recommended
   - Color: Full color CMYK
   - Resolution: 300 DPI minimum

### Method 3: PDF Conversion
```bash
# Using Chrome headless
chrome --headless --print-to-pdf="lupai_poster.pdf" --run-all-compositor-stages-before-draw --print-to-pdf-no-header lupai_poster.html

# Or use the provided Python script
python print_poster.py
```

## Content Sections

### 1. Problem Statement
- 85% smallholder farms statistic
- ₱18.5B annual waste figure
- ₱2,000-5,000 soil test cost
- Limited extension services

### 2. Objectives
- Free soil nutrient analysis
- 30-40% fertilizer cost reduction
- Data-driven decision making
- Sustainable agriculture support

### 3. Methodology
5-step system architecture flowchart:
1. Location Selection
2. Satellite Data Processing
3. Plant Selection
4. AI Soil Analysis
5. Fertilizer Recommendations

### 4. Soil Analysis Dashboard
Sample data from La Trinidad, Benguet:
- Nitrogen: 80 ppm (Medium)
- Phosphorus: 8 ppm (Low)
- Potassium: 150 ppm (Medium)
- pH: 6.2 (Slightly Acidic)

### 5. User Interface Flow
5-panel flow showing:
- Welcome screen
- Interactive map
- Plant selection
- Soil analysis
- Recommendations

### 6. Fertilizer Recommendations
Table with products, NPK ratios, application rates, and pricing.

### 7. Results & Impact
- 5 soil scenarios tested
- 3 municipalities covered
- Field validation complete

### 8. Technology Stack
React, Vite, Tailwind, Leaflet, Recharts, Sentinel-2, AI/ML

### 9. Key Features
8 highlighted feature boxes

### 10. Conclusion & Future Work
Current prototype status and 6 planned enhancements

### 11. QR Code Section
Placeholder for demo link

## Browser Compatibility
- ✅ Google Chrome (recommended)
- ✅ Microsoft Edge
- ✅ Firefox
- ⚠️ Safari (may need adjustments)

## Notes for Presenters

### At the Conference
1. **Stand to the left** of the poster (natural reading flow)
2. **Prepare a 2-minute pitch** covering:
   - The problem (15 seconds)
   - Your solution (30 seconds)
   - Key results (30 seconds)
   - Future work (15 seconds)
3. **Bring handouts** with:
   - Project summary
   - QR code to demo
   - Contact information

### Poster Session Tips
- Arrive early to set up
- Bring push pins or adhesive (check conference requirements)
- Have a tablet/laptop with demo ready
- Prepare business cards or contact slips

## Customization

### Changing Colors
Edit CSS variables in the `:root` section:
```css
:root {
    --rice-green: #84934A;
    --deep-green: #2E7D32;
    --clay-dark: #492828;
    /* ... */
}
```

### Updating Content
Simply edit the HTML text content between tags.

### Adding Authors
Update the `.header-meta` section in the HTML.

## Technical Details

### Poster Dimensions
| Unit | Width | Height |
|------|-------|--------|
| Inches | 46.8" | 33.1" |
| Millimeters | 1189mm | 841mm |
| Pixels (at 96 DPI) | 4493px | 3178px |
| Pixels (at 300 DPI) | 14040px | 9930px |

### Font Sizes
- Main Title: 42pt
- Subtitle: 22pt
- Section Headers: 16pt
- Body Text: 9-11pt

## Credits
- Design: Academic Research Poster Template
- Icons: Custom SVG
- Fonts: Inter by Rasmus Andersson (Google Fonts)
- Color Palette: Filipino Agriculture Inspired

## License
For academic and research use. Copyright © 2024 LupAI Research Team.

## Contact
- Email: research@lupai.ph
- Website: www.lupai.ph
- Institution: Cordillera Administrative Region Agricultural Research
