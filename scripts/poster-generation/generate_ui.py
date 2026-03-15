#!/usr/bin/env python3
"""
Script to generate beautiful UI components using Kimi/Moonshot API
"""
import requests
import json
import sys

API_KEY = "sk-kimi-cDjeL3OcvPbxkdhAFojv6Lc0CWaWn5QWydUR9gyyGD3RGu61HgKhL6uN1DPBclJ7"
API_URL = "https://api.kimi.com/coding/v1/chat/completions"

def generate_ui_component(prompt):
    """Generate UI component using Kimi API"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    payload = {
        "model": "kimi-for-coding",
        "messages": [
            {
                "role": "system",
                "content": "You are an expert React developer specializing in creating beautiful, modern UI components with Tailwind CSS, GSAP animations, and premium design aesthetics (Apple/Airbnb style). You ALWAYS generate complete, production-ready React component code. You NEVER add explanations - ONLY code."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7,
        "max_tokens": 4000
    }

    try:
        print(f"Making request to: {API_URL}")
        print(f"Using model: {payload['model']}")
        print(f"Prompt length: {len(prompt)} chars")
        response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
        print(f"Status code: {response.status_code}")
        if response.status_code != 200:
            print(f"Error response: {response.text}")
        response.raise_for_status()
        data = response.json()
        return data['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        if hasattr(e, 'response') and e.response:
            print(f"Response status: {e.response.status_code}", file=sys.stderr)
            print(f"Response text: {e.response.text}", file=sys.stderr)
        return None

if __name__ == "__main__":
    prompt = """Create a stunning, modern crop selection screen for a Filipino farm app called 'AgriCapture'.

Requirements:
- Premium SaaS aesthetic (Airbnb/Apple style with clean, minimal design)
- Category-based filtering for crops with these categories:
  * Highland Vegetables (green theme)
  * Root Crops (brown theme)
  * Cereals (golden theme)
  * Vegetables (red theme)
- Beautiful crop cards with:
  * Gradient overlays on hover
  * Smooth scale transforms
  * Icons/emojis for each crop
  * Filipino name and English name
  * Scientific name
  * Color-coded by category
- GSAP stagger animations for:
  * Initial page load (cards fade in)
  * Category filter pills
  * Search results
- Search functionality that filters crops
- Fixed bottom action bar with "Continue" button
- Responsive grid (1-4 columns based on screen size)
- Use lucide-react icons (Search, ChevronRight, Leaf, Sprout, Wheat, Apple)
- Include these 20+ Philippine crops:
  1. Repolyo (Cabbage) - Highland
  2. Litsugas (Lettuce) - Highland
  3. Kamatis (Tomato) - Highland
  4. Broccoli - Highland
  5. Cauliflower - Highland
  6. Pechay (Bok Choy) - Highland
  7. Sayote (Chayote) - Highland
  8. Bell Pepper - Highland
  9. Sitaw (String Beans) - Highland
  10. Labanos (Radish) - Highland
  11. Strawberry - Highland
  12. Carrots - Highland
  13. Patatas (Potato) - Root
  14. Kamote (Sweet Potato) - Root
  15. Gabi (Taro) - Root
  16. Palay (Rice) - Cereals
  17. Mais (Corn) - Cereals
  18. Talong (Eggplant) - Vegetables
  19. Sili (Chili Pepper) - Vegetables
  20. Ampalaya (Bitter Gourd) - Vegetables
  21. Kalabasa (Squash) - Vegetables

Tech stack:
- React (functional component with hooks: useState, useRef, useEffect)
- GSAP with useGSAP hook from @gsap/react
- Tailwind CSS for styling
- react-router-dom for navigation
- Zustand store (useAppStore) with setPlant method
- lucide-react icons

Component structure:
- Import all dependencies
- Define CROP_DATABASE object organized by category
- Define CATEGORIES array with id, name, icon, color
- PlantSelection component with:
  * State: searchQuery, selectedCategory, selectedPlant
  * Refs for GSAP animations
  * GSAP animations on mount and filter changes
  * Search and filter logic
  * Premium UI with smooth transitions

Generate ONLY the complete, production-ready PlantSelection.jsx React component code. NO explanations, NO markdown formatting, NO comments before or after the code. Start directly with the imports."""

    print("Generating UI component with Kimi AI...")
    result = generate_ui_component(prompt)

    if result:
        # Save to file
        with open("src/screens/PlantSelection_Kimi.jsx", "w", encoding="utf-8") as f:
            f.write(result)
        print("\n✓ Generated component saved to: src/screens/PlantSelection_Kimi.jsx")
        print("\nPreview:")
        print("=" * 80)
        print(result[:2000] + "..." if len(result) > 2000 else result)
        print("=" * 80)
    else:
        print("Failed to generate component")
        sys.exit(1)
