"""
LupAI Poster Generator
Creates a high-quality A0 poster (841 x 1189mm) at 300 DPI
Final resolution: 9933 x 14043 pixels
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

# A0 dimensions at 300 DPI
WIDTH = 9933  # 841mm at 300 DPI
HEIGHT = 14043  # 1189mm at 300 DPI

# Brand Colors
COLORS = {
    'rice_green': '#84934A',
    'deep_green': '#2E7D32',
    'clay_dark': '#492828',
    'pure_black': '#000000',
    'pure_white': '#FFFFFF',
    'emerald': '#10B981',
    'amber': '#F59E0B',
    'red': '#EF4444',
    'light_gray': '#F5F5F5',
    'medium_gray': '#E0E0E0',
}

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def get_font(size, bold=False):
    """Get Inter font or fallback"""
    try:
        if bold:
            return ImageFont.truetype("C:/Windows/Fonts/Inter-Bold.ttf", size)
        return ImageFont.truetype("C:/Windows/Fonts/Inter-Regular.ttf", size)
    except:
        try:
            if bold:
                return ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", size)
            return ImageFont.truetype("C:/Windows/Fonts/arial.ttf", size)
        except:
            return ImageFont.load_default()

class PosterGenerator:
    def __init__(self):
        self.img = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(COLORS['pure_white']))
        self.draw = ImageDraw.Draw(self.img)
        self.current_y = 0
        
    def hex(self, color):
        return hex_to_rgb(COLORS[color])
    
    def rounded_rectangle(self, xy, radius, fill, outline=None, width=1):
        """Draw a rounded rectangle"""
        x1, y1, x2, y2 = xy
        
        # Main rectangle
        self.draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill)
        self.draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill)
        
        # Corners
        self.draw.ellipse([x1, y1, x1 + radius * 2, y1 + radius * 2], fill=fill)
        self.draw.ellipse([x2 - radius * 2, y1, x2, y1 + radius * 2], fill=fill)
        self.draw.ellipse([x1, y2 - radius * 2, x1 + radius * 2, y2], fill=fill)
        self.draw.ellipse([x2 - radius * 2, y2 - radius * 2, x2, y2], fill=fill)
        
        if outline:
            # Draw outline
            self.draw.arc([x1, y1, x1 + radius * 2, y1 + radius * 2], 180, 270, fill=outline, width=width)
            self.draw.arc([x2 - radius * 2, y1, x2, y1 + radius * 2], 270, 360, fill=outline, width=width)
            self.draw.arc([x1, y2 - radius * 2, x1 + radius * 2, y2], 90, 180, fill=outline, width=width)
            self.draw.arc([x2 - radius * 2, y2 - radius * 2, x2, y2], 0, 90, fill=outline, width=width)
            self.draw.line([(x1 + radius, y1), (x2 - radius, y1)], fill=outline, width=width)
            self.draw.line([(x1 + radius, y2), (x2 - radius, y2)], fill=outline, width=width)
            self.draw.line([(x1, y1 + radius), (x1, y2 - radius)], fill=outline, width=width)
            self.draw.line([(x2, y1 + radius), (x2, y2 - radius)], fill=outline, width=width)
    
    def add_gradient_background(self, y_start, height, color1, color2, opacity=0.1):
        """Add subtle gradient background"""
        for y in range(y_start, min(y_start + height, HEIGHT)):
            ratio = (y - y_start) / height
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            for x in range(WIDTH):
                current = self.img.getpixel((x, y))
                new_r = int(current[0] * (1 - opacity) + r * opacity)
                new_g = int(current[1] * (1 - opacity) + g * opacity)
                new_b = int(current[2] * (1 - opacity) + b * opacity)
                self.img.putpixel((x, y), (new_r, new_g, new_b))
    
    def add_shadow(self, x, y, width, height, radius, blur=20):
        """Add drop shadow effect"""
        shadow = Image.new('RGBA', (width + blur * 2, height + blur * 2), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.rounded_rectangle([blur, blur, blur + width, blur + height], radius=radius, fill=(0, 0, 0, 40))
        shadow = shadow.filter(ImageFilter.GaussianBlur(blur // 2))
        self.img.paste(shadow, (x - blur, y - blur), shadow)
    
    def draw_icon(self, icon_type, x, y, size, color='rice_green'):
        """Draw simple line icons"""
        s = size
        c = self.hex(color)
        
        if icon_type == 'location':
            # Pin icon
            self.draw.ellipse([x + s*0.2, y, x + s*0.8, y + s*0.5], outline=c, width=3)
            self.draw.polygon([(x + s*0.5, y + s), (x + s*0.2, y + s*0.4), (x + s*0.8, y + s*0.4)], fill=c)
        elif icon_type == 'crop':
            # Plant/sprout icon
            self.draw.arc([x, y + s*0.3, x + s, y + s], 0, 180, fill=c, width=3)
            self.draw.line([(x + s*0.5, y + s), (x + s*0.5, y + s*0.2)], fill=c, width=3)
            self.draw.ellipse([x + s*0.35, y, x + s*0.65, y + s*0.3], outline=c, width=3)
        elif icon_type == 'satellite':
            # Satellite dish
            self.draw.arc([x, y + s*0.3, x + s, y + s*0.9], 180, 360, fill=c, width=3)
            self.draw.line([(x + s*0.5, y + s*0.6), (x + s*0.5, y)], fill=c, width=3)
            self.draw.ellipse([x + s*0.45, y, x + s*0.55, y + s*0.15], fill=c)
        elif icon_type == 'chart':
            # Chart bar
            self.draw.rectangle([x + s*0.1, y + s*0.6, x + s*0.3, y + s], outline=c, width=3)
            self.draw.rectangle([x + s*0.4, y + s*0.3, x + s*0.6, y + s], outline=c, width=3)
            self.draw.rectangle([x + s*0.7, y + s*0.5, x + s*0.9, y + s], outline=c, width=3)
        elif icon_type == 'check':
            # Checkmark
            self.draw.line([(x, y + s*0.5), (x + s*0.4, y + s), (x + s, y)], fill=c, width=4)
        elif icon_type == 'users':
            # Users group
            self.draw.ellipse([x + s*0.1, y, x + s*0.4, y + s*0.35], outline=c, width=3)
            self.draw.ellipse([x + s*0.5, y, x + s*0.8, y + s*0.35], outline=c, width=3)
            self.draw.arc([x, y + s*0.4, x + s*0.5, y + s], 0, 180, fill=c, width=3)
            self.draw.arc([x + s*0.5, y + s*0.4, x + s, y + s], 0, 180, fill=c, width=3)
        elif icon_type == 'money':
            # Coin/Peso
            self.draw.ellipse([x, y, x + s, y + s], outline=c, width=3)
            self.draw.text((x + s*0.35, y + s*0.2), "₱", fill=c, font=get_font(int(s*0.5), bold=True))
        elif icon_type == 'clock':
            # Clock
            self.draw.ellipse([x, y, x + s, y + s], outline=c, width=3)
            self.draw.line([(x + s*0.5, y + s*0.5), (x + s*0.5, y + s*0.2)], fill=c, width=3)
            self.draw.line([(x + s*0.5, y + s*0.5), (x + s*0.75, y + s*0.5)], fill=c, width=3)
        elif icon_type == 'phone':
            # Phone
            self.draw.rounded_rectangle([x + s*0.2, y, x + s*0.8, y + s], radius=10, outline=c, width=3)
            self.draw.ellipse([x + s*0.4, y + s*0.85, x + s*0.6, y + s*0.95], outline=c, width=2)

    def create_phone_mockup(self, screen_type='location'):
        """Create an iPhone mockup with UI"""
        phone_w, phone_h = 900, 1800
        phone = Image.new('RGBA', (phone_w, phone_h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(phone)
        
        # Phone frame (iPhone 14 Pro style)
        frame_color = (30, 30, 30)
        draw.rounded_rectangle([0, 0, phone_w, phone_h], radius=80, fill=frame_color)
        
        # Screen area
        margin = 25
        screen_w = phone_w - margin * 2
        screen_h = phone_h - margin * 2
        draw.rounded_rectangle([margin, margin, phone_w - margin, phone_h - margin], 
                               radius=60, fill=(255, 255, 255))
        
        # Dynamic Island
        island_w, island_h = 120, 35
        island_x = (phone_w - island_w) // 2
        draw.rounded_rectangle([island_x, 40, island_x + island_w, 40 + island_h], 
                               radius=15, fill=(0, 0, 0))
        
        # Draw UI content based on screen type
        content_margin = margin + 40
        content_w = screen_w - 80
        
        if screen_type == 'location':
            # Header
            draw.text((phone_w//2 - 180, 120), "Select Location", fill=(0,0,0), 
                     font=get_font(42, bold=True))
            
            # Map visualization (CAR region)
            map_y = 220
            draw.rounded_rectangle([content_margin, map_y, phone_w - content_margin, map_y + 400], 
                                   radius=20, fill=(232, 245, 233))
            # Simple map polygons
            draw.polygon([(content_margin+100, map_y+100), (content_margin+250, map_y+80),
                         (content_margin+350, map_y+200), (content_margin+200, map_y+300)], 
                        fill=(200, 230, 201), outline=(129, 199, 132), width=2)
            
            # Location pin
            pin_x = content_margin + 200
            pin_y = map_y + 180
            draw.ellipse([pin_x-15, pin_y-15, pin_x+15, pin_y+15], fill=(239, 68, 68))
            draw.polygon([(pin_x, pin_y+25), (pin_x-12, pin_y-5), (pin_x+12, pin_y-5)], fill=(239, 68, 68))
            
            # Location card
            card_y = map_y + 450
            draw.rounded_rectangle([content_margin, card_y, phone_w - content_margin, card_y + 200], 
                                   radius=20, fill=(255, 255, 255), outline=(224, 224, 224), width=2)
            draw.text((content_margin + 40, card_y + 40), "📍 La Trinidad, Benguet", 
                     fill=(0,0,0), font=get_font(36, bold=True))
            draw.text((content_margin + 40, card_y + 100), "Cordillera Administrative Region", 
                     fill=(100,100,100), font=get_font(28))
            
        elif screen_type == 'soil':
            # Header
            draw.text((phone_w//2 - 150, 120), "Soil Status", fill=(0,0,0), 
                     font=get_font(42, bold=True))
            draw.text((phone_w//2 - 180, 170), "La Trinidad, Benguet", fill=(100,100,100), 
                     font=get_font(26))
            
            # NPK Cards
            card_y = 250
            card_h = 140
            nutrients = [
                ('Nitrogen (N)', 'LOW', 'red', '24 mg/kg'),
                ('Phosphorus (P)', 'MEDIUM', 'amber', '18 mg/kg'),
                ('Potassium (K)', 'HIGH', 'emerald', '285 mg/kg'),
                ('pH Level', 'OPTIMAL', 'emerald', '6.5 pH')
            ]
            
            colors = {'red': (239, 68, 68), 'amber': (245, 158, 11), 'emerald': (16, 185, 129)}
            
            for i, (name, level, color_key, value) in enumerate(nutrients):
                y = card_y + i * (card_h + 30)
                draw.rounded_rectangle([content_margin, y, phone_w - content_margin, y + card_h], 
                                       radius=20, fill=(255,255,255), outline=(224,224,224), width=2)
                draw.text((content_margin + 40, y + 30), name, fill=(0,0,0), font=get_font(32))
                draw.text((content_margin + 40, y + 80), value, fill=(100,100,100), font=get_font(28))
                
                # Status badge
                badge_color = colors[color_key]
                badge_w = 180
                draw.rounded_rectangle([phone_w - content_margin - badge_w - 20, y + 35, 
                                       phone_w - content_margin - 20, y + 95], 
                                       radius=30, fill=badge_color)
                draw.text((phone_w - content_margin - badge_w + 20, y + 48), level, 
                         fill=(255,255,255), font=get_font(26, bold=True))
                         
        elif screen_type == 'fertilizer':
            # Header
            draw.text((phone_w//2 - 220, 120), "Fertilizer Recommendations", fill=(0,0,0), 
                     font=get_font(38, bold=True))
            
            # Fertilizer cards
            card_y = 220
            fertilizers = [
                ('Complete 14-14-14', 'Atlas Fertilizer', '₱1,350/bag', 'emerald'),
                ('Urea 46-0-0', 'Planters Products', '₱1,180/bag', 'amber'),
                ('Organic Compost', 'Cocofed', '₱450/bag', 'rice_green')
            ]
            
            colors_map = {'emerald': (16, 185, 129), 'amber': (245, 158, 11), 
                         'rice_green': (132, 147, 74)}
            
            for i, (name, brand, price, color_key) in enumerate(fertilizers):
                y = card_y + i * 280
                color = colors_map[color_key]
                
                # Card
                draw.rounded_rectangle([content_margin, y, phone_w - content_margin, y + 250], 
                                       radius=20, fill=(255,255,255), outline=(224,224,224), width=2)
                
                # Left color bar
                draw.rounded_rectangle([content_margin, y, content_margin + 15, y + 250], 
                                       radius=20, fill=color)
                
                draw.text((content_margin + 50, y + 40), name, fill=(0,0,0), font=get_font(34, bold=True))
                draw.text((content_margin + 50, y + 100), brand, fill=(100,100,100), font=get_font(28))
                draw.text((content_margin + 50, y + 160), price, fill=color, font=get_font(36, bold=True))
                
                # Apply button
                draw.rounded_rectangle([phone_w - content_margin - 180, y + 150, 
                                       phone_w - content_margin - 20, y + 210], 
                                       radius=25, fill=color)
                draw.text((phone_w - content_margin - 160, y + 165), "Apply", 
                         fill=(255,255,255), font=get_font(28, bold=True))
        
        # Home indicator
        draw.rounded_rectangle([phone_w//2 - 60, phone_h - 30, phone_w//2 + 60, phone_h - 15], 
                               radius=7, fill=(0, 0, 0))
        
        return phone

    def draw_hero_section(self):
        """Hero section - 20% of poster"""
        height = int(HEIGHT * 0.20)
        
        # Gradient background
        self.add_gradient_background(0, height, (255, 255, 255), hex_to_rgb(COLORS['rice_green']), 0.08)
        
        # Decorative circles
        for i, (cx, cy, r) in enumerate([(800, 600, 300), (8500, 500, 400), (7000, 1000, 200)]):
            alpha = 30 - i * 5
            overlay = Image.new('RGBA', (WIDTH, height), (0, 0, 0, 0))
            overlay_draw = ImageDraw.Draw(overlay)
            overlay_draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(*hex_to_rgb(COLORS['rice_green']), alpha))
            self.img.paste(Image.blend(Image.new('RGBA', (WIDTH, height), (255,255,255,0)), overlay, 0.3).convert('RGB'), (0, 0))
            self.draw = ImageDraw.Draw(self.img)
        
        # Logo/Brand mark (circle with L)
        logo_size = 200
        logo_x = WIDTH // 2 - logo_size // 2
        logo_y = 250
        self.draw.ellipse([logo_x, logo_y, logo_x + logo_size, logo_y + logo_size], 
                         fill=self.hex('rice_green'))
        self.draw.text((logo_x + 75, logo_y + 45), "L", fill=(255,255,255), 
                      font=get_font(120, bold=True))
        
        # Main headline - LupAI
        headline_y = 520
        self.draw.text((WIDTH // 2, headline_y), "LupAI", fill=self.hex('pure_black'), 
                      font=get_font(200, bold=True), anchor="mm")
        
        # Tagline - From Satellite to Soil
        tagline_y = headline_y + 180
        self.draw.text((WIDTH // 2, tagline_y), "From Satellite to Soil", 
                      fill=self.hex('clay_dark'), font=get_font(72), anchor="mm")
        
        # Subtitle - AI-Powered Fertilizer Recommendations in 8 Seconds
        sub_y = tagline_y + 120
        self.draw.text((WIDTH // 2, sub_y), "AI-Powered Fertilizer Recommendations in 8 Seconds", 
                      fill=self.hex('rice_green'), font=get_font(42), anchor="mm")
        
        # Tagline in Tagalog
        tag_y = sub_y + 80
        self.draw.text((WIDTH // 2, tag_y), "Mula Satellite hanggang Lupa — Para sa Bawat Magsasakang Pilipino", 
                      fill=self.hex('deep_green'), font=get_font(32), anchor="mm")
        
        self.current_y = height

    def draw_app_showcase(self):
        """App screenshots showcase - 30% of poster"""
        height = int(HEIGHT * 0.30)
        y_start = self.current_y
        
        # Background
        self.draw.rectangle([0, y_start, WIDTH, y_start + height], fill=self.hex('light_gray'))
        
        # Section title
        title_y = y_start + 80
        self.draw.text((WIDTH // 2, title_y), "Precision Agriculture in Your Pocket", 
                      fill=self.hex('pure_black'), font=get_font(56, bold=True), anchor="mm")
        
        # Generate phone mockups
        phones = [
            self.create_phone_mockup('location'),
            self.create_phone_mockup('soil'),
            self.create_phone_mockup('fertilizer')
        ]
        
        # Position phones with perspective effect
        positions = [
            (WIDTH // 2 - 1400, y_start + 250, 0.85),  # Left, smaller
            (WIDTH // 2 - 450, y_start + 180, 1.0),    # Center, largest
            (WIDTH // 2 + 500, y_start + 250, 0.85),   # Right, smaller
        ]
        
        for i, (phone, (px, py, scale)) in enumerate(zip(phones, positions)):
            # Add shadow
            scaled_w = int(900 * scale)
            scaled_h = int(1800 * scale)
            phone_scaled = phone.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
            
            # Shadow
            self.add_shadow(px, py, scaled_w, scaled_h, 80 * int(scale))
            
            # Paste phone
            self.img.paste(phone_scaled, (px, py), phone_scaled)
            
            # Label
            labels = ["1. Select Location", "2. View Soil Status", "3. Get Recommendations"]
            self.draw.text((px + scaled_w // 2, py + scaled_h + 50), labels[i], 
                          fill=self.hex('clay_dark'), font=get_font(36, bold=True), anchor="mm")
        
        self.current_y = y_start + height

    def draw_benefits_section(self):
        """Key benefits section - 15% of poster"""
        height = int(HEIGHT * 0.15)
        y_start = self.current_y
        padding = 150
        
        # Title
        title_y = y_start + 100
        self.draw.text((WIDTH // 2, title_y), "Why Filipino Farmers Choose LupAI", 
                      fill=self.hex('pure_black'), font=get_font(60, bold=True), anchor="mm")
        
        # Three columns
        col_width = (WIDTH - padding * 4) // 3
        cols_x = [padding + col_width // 2, 
                  padding * 2 + col_width + col_width // 2,
                  padding * 3 + col_width * 2 + col_width // 2]
        
        benefits = [
            {
                'icon': 'money',
                'title': 'COST SAVINGS',
                'lines': ['Save ₱5,000 per hectare', 'No expensive soil tests needed'],
                'color': 'emerald'
            },
            {
                'icon': 'crop',
                'title': 'BETTER YIELDS',
                'lines': ['20+ crop varieties supported', 'Precision nutrient targeting'],
                'color': 'rice_green'
            },
            {
                'icon': 'phone',
                'title': 'EASY TO USE',
                'lines': ['Results in 8 seconds', 'No technical knowledge required'],
                'color': 'deep_green'
            }
        ]
        
        content_y = title_y + 180
        for i, (col_x, benefit) in enumerate(zip(cols_x, benefits)):
            # Icon circle
            icon_size = 100
            self.draw.ellipse([col_x - icon_size, content_y - icon_size//2, 
                              col_x + icon_size, content_y + icon_size//2], 
                             fill=self.hex(benefit['color']))
            self.draw_icon(benefit['icon'], col_x - 35, content_y - 35, 70, 'pure_white')
            
            # Title
            self.draw.text((col_x, content_y + 100), benefit['title'], 
                          fill=self.hex('pure_black'), font=get_font(38, bold=True), anchor="mm")
            
            # Lines
            line_y = content_y + 180
            for line in benefit['lines']:
                self.draw.text((col_x, line_y), line, fill=self.hex('clay_dark'), 
                              font=get_font(32), anchor="mm")
                line_y += 55
        
        self.current_y = y_start + height

    def draw_how_it_works(self):
        """How it works section - 20% of poster"""
        height = int(HEIGHT * 0.20)
        y_start = self.current_y
        
        # Background gradient
        self.add_gradient_background(y_start, height, hex_to_rgb(COLORS['rice_green']), 
                                     hex_to_rgb(COLORS['deep_green']), 0.05)
        
        # Title
        title_y = y_start + 100
        self.draw.text((WIDTH // 2, title_y), "Simple as 1-2-3-4-5", 
                      fill=self.hex('pure_black'), font=get_font(60, bold=True), anchor="mm")
        
        # 5 steps horizontally
        step_width = (WIDTH - 300) // 5
        steps = [
            ('1', 'Select Location', 'GPS or tap map', 'location'),
            ('2', 'Choose Crop', 'Tomato, Cabbage, etc.', 'crop'),
            ('3', 'AI Analyzes', 'Satellite data in 6 sec', 'satellite'),
            ('4', 'View Soil Status', 'N-P-K-pH levels', 'chart'),
            ('5', 'Get Recommendations', 'Atlas, Planters brands', 'check')
        ]
        
        start_x = 150
        step_y = title_y + 200
        
        for i, (num, title, desc, icon) in enumerate(steps):
            x = start_x + i * step_width + step_width // 2
            
            # Step circle
            circle_r = 100
            self.draw.ellipse([x - circle_r, step_y - circle_r, x + circle_r, step_y + circle_r], 
                             fill=self.hex('rice_green'))
            
            # Number
            self.draw.text((x, step_y + 10), num, fill=(255,255,255), 
                          font=get_font(80, bold=True), anchor="mm")
            
            # Icon below
            self.draw_icon(icon, x - 40, step_y + 140, 80, 'deep_green')
            
            # Title
            self.draw.text((x, step_y + 280), title, fill=self.hex('pure_black'), 
                          font=get_font(36, bold=True), anchor="mm")
            
            # Description
            self.draw.text((x, step_y + 340), desc, fill=self.hex('clay_dark'), 
                          font=get_font(28), anchor="mm")
            
            # Arrow (except last)
            if i < 4:
                arrow_x = x + step_width // 2 + 20
                self.draw.polygon([(arrow_x, step_y), (arrow_x + 30, step_y - 15), 
                                  (arrow_x + 30, step_y + 15)], fill=self.hex('rice_green'))
        
        self.current_y = y_start + height

    def draw_before_after(self):
        """Before/After comparison - 10% of poster"""
        height = int(HEIGHT * 0.10)
        y_start = self.current_y
        padding = 200
        
        card_w = (WIDTH - padding * 3) // 2
        card_h = height - 200
        
        # Without LupAI card
        x1 = padding
        y1 = y_start + 100
        self.add_shadow(x1, y1, card_w, card_h, 30, 30)
        self.rounded_rectangle([x1, y1, x1 + card_w, y1 + card_h], 30, 
                              fill=self.hex('pure_white'))
        
        # Red X mark
        self.draw.text((x1 + 80, y1 + 60), "✗", fill=self.hex('red'), font=get_font(80))
        self.draw.text((x1 + 200, y1 + 70), "WITHOUT LupAI", fill=self.hex('red'), 
                      font=get_font(42, bold=True))
        
        # Points
        points = ["₱3,500 for soil lab test", "7-14 days waiting", "Complex numeric reports"]
        py = y1 + 180
        for point in points:
            self.draw.text((x1 + 60, py), "• " + point, fill=self.hex('clay_dark'), font=get_font(32))
            py += 60
        
        # With LupAI card
        x2 = padding * 2 + card_w
        self.add_shadow(x2, y1, card_w, card_h, 30, 30)
        self.rounded_rectangle([x2, y1, x2 + card_w, y1 + card_h], 30, 
                              fill=self.hex('pure_white'))
        
        # Green check
        self.draw.text((x2 + 80, y1 + 60), "✓", fill=self.hex('emerald'), font=get_font(80))
        self.draw.text((x2 + 200, y1 + 70), "WITH LupAI", fill=self.hex('emerald'), 
                      font=get_font(42, bold=True))
        
        # Points
        points = ["FREE instant analysis", "8 seconds results", "Simple Low/Medium/High display"]
        py = y1 + 180
        for point in points:
            self.draw.text((x2 + 60, py), "• " + point, fill=self.hex('clay_dark'), font=get_font(32))
            py += 60
        
        self.current_y = y_start + height

    def draw_metrics(self):
        """Big impact numbers - 10% of poster"""
        height = int(HEIGHT * 0.10)
        y_start = self.current_y
        
        # Title
        title_y = y_start + 80
        self.draw.text((WIDTH // 2, title_y), "Our Growing Impact", 
                      fill=self.hex('pure_black'), font=get_font(52, bold=True), anchor="mm")
        
        # Three metric cards
        card_w = 750
        card_h = 350
        gap = (WIDTH - card_w * 3) // 4
        
        metrics = [
            ('1000+', 'CAR Farmers', 'Served'),
            ('20+', 'Crop Varieties', 'Tomato, Cabbage, Potato...'),
            ('8 sec', 'From GPS to', 'Recommendations')
        ]
        
        card_y = title_y + 150
        for i, (number, label1, label2) in enumerate(metrics):
            x = gap + i * (card_w + gap)
            
            # Shadow and card
            self.add_shadow(x, card_y, card_w, card_h, 25, 25)
            self.rounded_rectangle([x, card_y, x + card_w, card_y + card_h], 25, 
                                  fill=self.hex('pure_white'), outline=self.hex('medium_gray'), width=2)
            
            # Number
            self.draw.text((x + card_w // 2, card_y + 100), number, fill=self.hex('rice_green'), 
                          font=get_font(100, bold=True), anchor="mm")
            
            # Labels
            self.draw.text((x + card_w // 2, card_y + 200), label1, fill=self.hex('pure_black'), 
                          font=get_font(38, bold=True), anchor="mm")
            self.draw.text((x + card_w // 2, card_y + 260), label2, fill=self.hex('clay_dark'), 
                          font=get_font(30), anchor="mm")
        
        self.current_y = y_start + height

    def draw_technology(self):
        """Technology section - 8% of poster"""
        height = int(HEIGHT * 0.08)
        y_start = self.current_y
        
        # Background
        self.draw.rectangle([0, y_start, WIDTH, y_start + height], fill=self.hex('light_gray'))
        
        # Title
        title_y = y_start + 80
        self.draw.text((WIDTH // 2, title_y), "Powered by Advanced Technology", 
                      fill=self.hex('pure_black'), font=get_font(44, bold=True), anchor="mm")
        
        # Tech badges
        badges = [
            ('SAT', 'Sentinel-2 Satellite'),
            ('AI', 'Machine Learning AI'),
            ('MAP', 'CAR Region Data'),
            ('PH', 'Philippine Fertilizers')
        ]
        
        total_badge_w = len(badges) * 500
        start_x = (WIDTH - total_badge_w) // 2 + 250
        badge_y = title_y + 180
        
        for i, (icon, text) in enumerate(badges):
            x = start_x + i * 500
            
            # Badge background
            self.rounded_rectangle([x - 200, badge_y - 50, x + 200, badge_y + 50], 30, 
                                  fill=self.hex('pure_white'))
            
            # Icon and text
            self.draw.text((x - 160, badge_y - 25), icon, fill=self.hex('rice_green'), font=get_font(32, bold=True))
            self.draw.text((x - 50, badge_y - 20), text, fill=self.hex('clay_dark'), font=get_font(28))
        
        self.current_y = y_start + height

    def draw_cta_footer(self):
        """Call-to-action footer - 7% of poster"""
        height = int(HEIGHT * 0.07)
        y_start = self.current_y
        
        # Background gradient
        self.add_gradient_background(y_start, height, hex_to_rgb(COLORS['deep_green']), 
                                     hex_to_rgb(COLORS['clay_dark']), 0.3)
        
        # QR Code placeholder (simplified)
        qr_size = 400
        qr_x = 400
        qr_y = y_start + (height - qr_size) // 2
        
        self.rounded_rectangle([qr_x, qr_y, qr_x + qr_size, qr_y + qr_size], 20, 
                              fill=self.hex('pure_white'))
        
        # Draw simple QR pattern
        cell_size = 20
        for row in range(qr_size // cell_size):
            for col in range(qr_size // cell_size):
                if ((row + col) % 3 == 0 or row < 3 or row > qr_size//cell_size - 4 or 
                    col < 3 or col > qr_size//cell_size - 4 or (row > 8 and row < 14 and col > 8 and col < 14)):
                    if ((row * 7 + col * 13) % 5) > 1:
                        self.draw.rectangle([qr_x + col * cell_size, qr_y + row * cell_size,
                                            qr_x + (col + 1) * cell_size, qr_y + (row + 1) * cell_size],
                                           fill=self.hex('pure_black'))
        
        # CTA text
        text_x = qr_x + qr_size + 100
        text_y = y_start + 150
        
        self.draw.text((text_x, text_y), "Try LupAI Free Today", fill=(255,255,255), 
                      font=get_font(72, bold=True))
        self.draw.text((text_x, text_y + 110), "Scan to access the web app — No download required", 
                      fill=(255,255,255, 200), font=get_font(42))
        
        # Website
        self.draw.text((text_x, text_y + 220), "lupai.app", fill=self.hex('emerald'), 
                      font=get_font(56, bold=True))
        
        # Supported by
        support_x = WIDTH - 600
        self.draw.text((support_x, text_y + 50), "Supported by:", fill=(255,255,255, 180), 
                      font=get_font(32))
        self.draw.text((support_x, text_y + 110), "CAR Agricultural", fill=(255,255,255), 
                      font=get_font(36, bold=True))
        self.draw.text((support_x, text_y + 165), "Research Center", fill=(255,255,255), 
                      font=get_font(36, bold=True))
        
        self.current_y = y_start + height

    def generate(self):
        """Generate the complete poster"""
        print("Generating LupAI Poster...")
        print("Step 1/8: Hero Section")
        self.draw_hero_section()
        
        print("Step 2/8: App Showcase")
        self.draw_app_showcase()
        
        print("Step 3/8: Benefits Section")
        self.draw_benefits_section()
        
        print("Step 4/8: How It Works")
        self.draw_how_it_works()
        
        print("Step 5/8: Before/After Comparison")
        self.draw_before_after()
        
        print("Step 6/8: Impact Metrics")
        self.draw_metrics()
        
        print("Step 7/8: Technology Section")
        self.draw_technology()
        
        print("Step 8/8: CTA Footer")
        self.draw_cta_footer()
        
        return self.img

def main():
    generator = PosterGenerator()
    poster = generator.generate()
    
    # Save the poster
    output_path = "LupAI_Poster_A0.png"
    poster.save(output_path, "PNG", dpi=(300, 300))
    print(f"\n[OK] Poster saved to: {output_path}")
    print(f"   Dimensions: {poster.size[0]} x {poster.size[1]} pixels")
    print(f"   Print size: A0 (841 x 1189mm) at 300 DPI")
    print(f"   File size: {os.path.getsize(output_path) / 1024 / 1024:.2f} MB")
    
    # Also save a smaller preview
    preview = poster.resize((1987, 2809), Image.Resampling.LANCZOS)
    preview_path = "LupAI_Poster_Preview.png"
    preview.save(preview_path, "PNG")
    print(f"   Preview saved to: {preview_path}")

if __name__ == "__main__":
    main()
