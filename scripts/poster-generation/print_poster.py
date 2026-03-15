#!/usr/bin/env python3
"""
LupAI Poster PDF Generation Script
Converts the HTML poster to print-ready PDF

Requirements:
    - Python 3.7+
    - playwright: pip install playwright
    - After install: playwright install chromium

Usage:
    python print_poster.py
    
Output:
    lupai_poster.pdf (A0 Landscape, print-ready)
"""

import asyncio
import os
from pathlib import Path

# A0 Landscape dimensions in inches
A0_WIDTH_IN = 46.8
A0_HEIGHT_IN = 33.1

# Convert to pixels at 300 DPI (print quality)
DPI = 300
WIDTH_PX = int(A0_WIDTH_IN * DPI)
HEIGHT_PX = int(A0_HEIGHT_IN * DPI)


async def generate_pdf():
    """Generate PDF from HTML poster using Playwright."""
    
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("Installing required packages...")
        import subprocess
        subprocess.check_call(["pip", "install", "playwright"])
        subprocess.check_call(["playwright", "install", "chromium"])
        from playwright.async_api import async_playwright
    
    poster_html = Path("lupai_poster.html").resolve()
    
    if not poster_html.exists():
        print(f"Error: {poster_html} not found!")
        print("Please ensure lupai_poster.html is in the same directory.")
        return
    
    print("🚀 Starting PDF generation...")
    print(f"📄 Input: {poster_html}")
    print(f"📐 Dimensions: {A0_WIDTH_IN}\" × {A0_HEIGHT_IN}\" (A0 Landscape)")
    print(f"🎯 Resolution: {DPI} DPI")
    
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Load HTML file
        await page.goto(f"file://{poster_html}")
        
        # Wait for fonts to load
        await page.wait_for_timeout(3000)
        
        # Generate PDF
        output_pdf = "lupai_poster.pdf"
        
        await page.pdf(
            path=output_pdf,
            width=f"{A0_WIDTH_IN}in",
            height=f"{A0_HEIGHT_IN}in",
            print_background=True,  # Essential for colors
            prefer_css_page_size=True,
        )
        
        await browser.close()
        
    # Get file size
    file_size = os.path.getsize(output_pdf) / (1024 * 1024)  # MB
    
    print(f"\n✅ PDF generated successfully!")
    print(f"📁 Output: {output_pdf}")
    print(f"📊 File size: {file_size:.2f} MB")
    print(f"\n🖨️  Ready for printing at A0 Landscape size (841mm × 1189mm)")
    

async def generate_png_preview():
    """Generate PNG preview at lower resolution."""
    
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        return
    
    poster_html = Path("lupai_poster.html").resolve()
    
    print("\n🖼️  Generating PNG preview...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        await page.goto(f"file://{poster_html}")
        await page.wait_for_timeout(3000)
        
        # Set viewport to poster size at lower DPI for preview
        preview_width = int(A0_WIDTH_IN * 96)  # 96 DPI for screen
        preview_height = int(A0_HEIGHT_IN * 96)
        
        await page.set_viewport_size({
            "width": preview_width,
            "height": preview_height
        })
        
        # Take screenshot
        await page.screenshot(
            path="lupai_poster_preview.png",
            full_page=False
        )
        
        await browser.close()
    
    print("✅ Preview saved as: lupai_poster_preview.png")


def print_instructions():
    """Display printing instructions."""
    
    print("\n" + "="*60)
    print("🖨️  PRINTING INSTRUCTIONS")
    print("="*60)
    print("""
1. PROFESSIONAL PRINT SHOP:
   - File: lupai_poster.pdf
   - Size: A0 Landscape (841mm × 1189mm)
   - Paper: Matte or glossy photo paper
   - Color: Full color (CMYK)
   - Expected cost: $30-80 USD depending on material

2. ACADEMIC PRINTING SERVICES:
   - Many universities offer large-format printing
   - Submit PDF via their online portal
   - Turnaround: Usually 24-48 hours

3. LOCAL PRINT SHOPS:
   - Call ahead to confirm A0 printing capability
   - Request a proof print first if possible
   - Ask about fabric poster options (travel-friendly)

📋 What to Bring to Conference:
   - Poster tube or fabric carrying case
   - Push pins or adhesive strips (check venue requirements)
   - Backup: USB drive with PDF
   - Tablet/laptop with live demo
   - Business cards or contact information
""")


def main():
    """Main entry point."""
    
    print("="*60)
    print("🌾 LupAI Academic Poster PDF Generator")
    print("="*60)
    
    # Generate PDF
    asyncio.run(generate_pdf())
    
    # Optional: Generate preview
    try:
        asyncio.run(generate_png_preview())
    except Exception as e:
        print(f"\n⚠️  Preview generation skipped: {e}")
    
    # Print instructions
    print_instructions()
    
    print("\n✨ Done! Your poster is ready for the conference.")
    print("="*60)


if __name__ == "__main__":
    main()
