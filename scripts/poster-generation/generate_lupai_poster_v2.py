"""
LupAI Poster Generator v2 - Enhanced
Creates a high-quality A0 poster (841 x 1189mm) at 300 DPI
Final resolution: 9933 x 14043 pixels
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

# A0 dimensions at 300 DPI
WIDTH = 9933
HEIGHT = 14043

# Brand Colors
COLORS = {
    'rice_green': '#84934A',
    'deep_green': '#2E7D32',
    'clay_dark': '#492828',
    'pure_black': '#1A1A1A',
    'pure_white': '#FFFFFF',
    'emerald': '#10B981',
    'amber': '#F59E0B',
    'red': '#EF4444',
    'light_gray': '#F8F9FA',
    'medium_gray': '#E9ECEF',
    'dark_gray': '#6C757D',
}

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def get_font(size, bold=False):
    """Get font with fallbacks"""
    font_paths = [
        f"C:/Windows/Fonts/{'Inter-Bold.ttf' if bold else 'Inter-Regular.ttf'}",
        f"C:/Windows/Fonts/{'ArialBD.ttf' if bold else 'Arial.ttf'}",
        f"C:/Windows/Fonts/{'arialbd.ttf' if bold else 'arial.ttf'}",
        f"C:/Windows/Fonts/{'segoeuib.ttf' if bold else 'segoeui.ttf'}",
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                pass
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
            pass  # Simplified for performance
    
    def add_gradient(self, y_start, height, color1, color2, alpha=0.1):
        """Add subtle vertical gradient"""
        c1, c2 = hex_to_rgb(color1), hex_to_rgb(color2)
        for y in range(y_start, min(y_start + height, HEIGHT)):
            ratio = (y - y_start) / height
            r = int(c1[0] * (1 - ratio) + c2[0] * ratio)
            g = int(c1[1] * (1 - ratio) + c2[1] * ratio)
            b = int(c1[2] * (1 - ratio) + c2[2] * ratio)
            for x in range(WIDTH):
                base = self.img.getpixel((x, y))
                nr = int(base[0] * (1 - alpha) + r * alpha)
                ng = int(base[1] * (1 - alpha) + g * alpha)
                nb = int(base[2] * (1 - alpha) + b * alpha)
                self.img.putpixel((x, y), (nr, ng, nb))
    
    def draw_shadow(self, x, y, w, h, radius, intensity=40):
        """Draw drop shadow"""
        shadow = Image.new('RGBA', (w + 60, h + 60), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow)
        sd.rounded_rectangle([30, 30, 30 + w, 30 + h], radius=radius, fill=(0, 0, 0, intensity))
        shadow = shadow.filter(ImageFilter.GaussianBlur(15))
        self.img.paste(shadow, (x - 30, y - 30), shadow)
        self.draw = ImageDraw.Draw(self.img)

    def draw_icon_circle(self, cx, cy, size, icon_type, bg_color='rice_green', icon_color='pure_white'):
        """Draw icon inside circle"""
        r = size // 2
        self.draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=self.hex(bg_color))
        
        # Draw icon symbol
        s = int(size * 0.4)
        ix, iy = cx - s//2, cy - s//2
        c = self.hex(icon_color)
        
        if icon_type == 'money':
            self.draw.ellipse([ix, iy, ix + s, iy + s], outline=c, width=4)
            self.draw.text((ix + s//3, iy + s//5), "P", fill=c, font=get_font(int(s*0.7), bold=True))
        elif icon_type == 'crop':
            self.draw.line([(cx, cy + s//2), (cx, cy - s//3)], fill=c, width=4)
            self.draw.ellipse([cx - s//3, cy - s//2, cx + s//3, cy], outline=c, width=4)
        elif icon_type == 'phone':
            self.draw.rounded_rectangle([ix + s//4, iy, ix + s*3//4, iy + s], radius=5, outline=c, width=3)
        elif icon_type == 'users':
            self.draw.ellipse([cx - s//2, cy - s//3, cx, cy + s//3], outline=c, width=3)
            self.draw.ellipse([cx, cy - s//3, cx + s//2, cy + s//3], outline=c, width=3)
        elif icon_type == 'check':
            self.draw.line([(ix, cy), (cx, cy + s//2), (ix + s, cy - s//3)], fill=c, width=5)
        elif icon_type == 'chart':
            for i, h in enumerate([0.4, 0.7, 0.5]):
                bx = ix + i * s//3 + 5
                bh = int(s * h)
                self.draw.rectangle([bx, iy + s - bh, bx + s//4, iy + s], fill=c)
        elif icon_type == 'location':
            self.draw.ellipse([cx - s//3, cy - s//2, cx + s//3, cy], outline=c, width=3)
            self.draw.polygon([(cx, cy + s//2), (cx - s//3, cy - s//4), (cx + s//3, cy - s//4)], fill=c)
        elif icon_type == 'satellite':
            self.draw.arc([ix, iy + s//3, ix + s, iy + s], 180, 360, fill=c, width=3)
            self.draw.line([(cx, cy + s//3), (cx, iy)], fill=c, width=3)
        elif icon_type == 'clock':
            self.draw.ellipse([ix, iy, ix + s, iy + s], outline=c, width=3)
            self.draw.line([(cx, cy), (cx, iy + s//4)], fill=c, width=3)
            self.draw.line([(cx, cy), (cx + s//3, cy)], fill=c, width=3)

    def create_phone(self, screen_type):
        """Create phone mockup"""
        pw, ph = 800, 1650
        phone = Image.new('RGBA', (pw, ph), (0, 0, 0, 0))
        d = ImageDraw.Draw(phone)
        
        # Frame
        d.rounded_rectangle([0, 0, pw, ph], radius=70, fill=(20, 20, 20))
        m = 22
        d.rounded_rectangle([m, m, pw - m, ph - m], radius=55, fill=(255, 255, 255))
        
        # Dynamic Island
        d.rounded_rectangle([pw//2 - 50, 35, pw//2 + 50, 70], radius=12, fill=(0, 0, 0))
        
        cm = m + 35
        
        if screen_type == 'location':
            d.text((pw//2, 100), "Select Location", fill=(0,0,0), font=get_font(38, bold=True), anchor="mm")
            
            # Map
            my = 160
            d.rounded_rectangle([cm, my, pw - cm, my + 380], radius=20, fill=(232, 245, 233))
            # Province shapes
            d.polygon([(cm+80, my+80), (cm+220, my+60), (cm+300, my+180), (cm+180, my+280)], 
                     fill=(200, 230, 201), outline=(129, 199, 132), width=2)
            d.polygon([(cm+250, my+100), (cm+380, my+120), (cm+350, my+250), (cm+200, my+220)], 
                     fill=(165, 214, 167), outline=(102, 187, 106), width=2)
            
            # Pin
            px, py = cm + 220, my + 180
            d.ellipse([px-18, py-18, px+18, py+18], fill=(239, 68, 68))
            d.polygon([(px, py+30), (px-15, py-5), (px+15, py-5)], fill=(239, 68, 68))
            
            # Location card
            cy = my + 420
            d.rounded_rectangle([cm, cy, pw - cm, cy + 180], radius=18, fill=(255,255,255), outline=(220,220,220), width=2)
            d.text((cm + 30, cy + 35), "La Trinidad, Benguet", fill=(0,0,0), font=get_font(32, bold=True))
            d.text((cm + 30, cy + 85), "Cordillera Administrative Region", fill=(100,100,100), font=get_font(24))
            d.text((cm + 30, cy + 125), "Philippines", fill=(130,147,74), font=get_font(24))
            
        elif screen_type == 'soil':
            d.text((pw//2, 100), "Soil Status", fill=(0,0,0), font=get_font(38, bold=True), anchor="mm")
            d.text((pw//2, 145), "La Trinidad, Benguet", fill=(100,100,100), font=get_font(24), anchor="mm")
            
            sy = 200
            cards = [
                ('Nitrogen (N)', 'LOW', 'red', '24 mg/kg'),
                ('Phosphorus (P)', 'MEDIUM', 'amber', '18 mg/kg'),
                ('Potassium (K)', 'HIGH', 'emerald', '285 mg/kg'),
                ('pH Level', 'OPTIMAL', 'emerald', '6.5 pH')
            ]
            colors = {'red': (239, 68, 68), 'amber': (245, 158, 11), 'emerald': (16, 185, 129)}
            
            for i, (name, level, ck, val) in enumerate(cards):
                y = sy + i * 160
                d.rounded_rectangle([cm, y, pw - cm, y + 140], radius=18, fill=(255,255,255), outline=(220,220,220), width=2)
                d.text((cm + 25, y + 25), name, fill=(0,0,0), font=get_font(28))
                d.text((cm + 25, y + 75), val, fill=(100,100,100), font=get_font(24))
                
                bc = colors[ck]
                bw = 160
                d.rounded_rectangle([pw - cm - bw - 15, y + 35, pw - cm - 15, y + 95], radius=25, fill=bc)
                d.text((pw - cm - bw//2 - 15, y + 52), level, fill=(255,255,255), font=get_font(22, bold=True), anchor="mm")
                
        elif screen_type == 'fertilizer':
            d.text((pw//2, 100), "Recommendations", fill=(0,0,0), font=get_font(36, bold=True), anchor="mm")
            
            fy = 170
            ferts = [
                ('Complete 14-14-14', 'Atlas Fertilizer', '1,350/bag', 'emerald'),
                ('Urea 46-0-0', 'Planters Products', '1,180/bag', 'amber'),
                ('Organic Compost', 'Cocofed', '450/bag', 'rice_green')
            ]
            cmap = {'emerald': (16, 185, 129), 'amber': (245, 158, 11), 'rice_green': (132, 147, 74)}
            
            for i, (name, brand, price, ck) in enumerate(ferts):
                y = fy + i * 270
                col = cmap[ck]
                d.rounded_rectangle([cm, y, pw - cm, y + 240], radius=18, fill=(255,255,255), outline=(220,220,220), width=2)
                d.rounded_rectangle([cm, y, cm + 12, y + 240], radius=18, fill=col)
                d.text((cm + 40, y + 35), name, fill=(0,0,0), font=get_font(30, bold=True))
                d.text((cm + 40, y + 85), brand, fill=(100,100,100), font=get_font(24))
                d.text((cm + 40, y + 140), "P" + price, fill=col, font=get_font(32, bold=True))
                d.rounded_rectangle([pw - cm - 150, y + 130, pw - cm - 20, y + 190], radius=20, fill=col)
                d.text((pw - cm - 85, y + 148), "Apply", fill=(255,255,255), font=get_font(24, bold=True), anchor="mm")
        
        # Home bar
        d.rounded_rectangle([pw//2 - 50, ph - 25, pw//2 + 50, ph - 12], radius=6, fill=(0,0,0))
        return phone

    def hero_section(self):
        """Hero section"""
        h = int(HEIGHT * 0.20)
        
        # Clean white background with subtle green tint at bottom
        for y in range(h):
            ratio = y / h
            alpha = ratio * 0.08
            for x in range(WIDTH):
                base = self.img.getpixel((x, y))
                gc = self.hex('rice_green')
                nr = int(base[0] * (1 - alpha) + gc[0] * alpha)
                ng = int(base[1] * (1 - alpha) + gc[1] * alpha)
                nb = int(base[2] * (1 - alpha) + gc[2] * alpha)
                self.img.putpixel((x, y), (nr, ng, nb))
        self.draw = ImageDraw.Draw(self.img)
        
        # Decorative circles
        circles = [(700, 450, 250, 25), (8800, 400, 300, 20), (6500, 800, 180, 15)]
        for cx, cy, r, a in circles:
            overlay = Image.new('RGBA', (WIDTH, h), (0, 0, 0, 0))
            od = ImageDraw.Draw(overlay)
            od.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(*self.hex('rice_green'), a))
            self.img.paste(Image.alpha_composite(Image.new('RGBA', (WIDTH, h), (255,255,255,0)), overlay).convert('RGB'), (0, 0))
        self.draw = ImageDraw.Draw(self.img)
        
        # Logo circle with L
        ls = 180
        lx = WIDTH // 2 - ls // 2
        ly = 220
        self.draw.ellipse([lx, ly, lx + ls, ly + ls], fill=self.hex('rice_green'))
        self.draw.text((WIDTH // 2, ly + 95), "L", fill=(255,255,255), font=get_font(110, bold=True), anchor="mm")
        
        # Main title
        self.draw.text((WIDTH // 2, 480), "LupAI", fill=self.hex('pure_black'), font=get_font(220, bold=True), anchor="mm")
        
        # Taglines
        self.draw.text((WIDTH // 2, 680), "From Satellite to Soil", fill=self.hex('clay_dark'), font=get_font(64), anchor="mm")
        self.draw.text((WIDTH // 2, 800), "AI-Powered Fertilizer Recommendations in 8 Seconds", 
                      fill=self.hex('rice_green'), font=get_font(40), anchor="mm")
        self.draw.text((WIDTH // 2, 880), "Mula Satellite hanggang Lupa — Para sa Bawat Magsasakang Pilipino", 
                      fill=self.hex('deep_green'), font=get_font(28), anchor="mm")
        
        self.current_y = h

    def app_showcase(self):
        """App screenshots"""
        h = int(HEIGHT * 0.30)
        ys = self.current_y
        
        self.draw.rectangle([0, ys, WIDTH, ys + h], fill=self.hex('light_gray'))
        
        # Title
        self.draw.text((WIDTH // 2, ys + 100), "Precision Agriculture in Your Pocket", 
                      fill=self.hex('pure_black'), font=get_font(56, bold=True), anchor="mm")
        
        # Generate phones
        phones = [self.create_phone(t) for t in ['location', 'soil', 'fertilizer']]
        
        # Position with depth
        positions = [
            (WIDTH // 2 - 1300, ys + 180, 0.82),
            (WIDTH // 2 - 400, ys + 120, 1.0),
            (WIDTH // 2 + 500, ys + 180, 0.82)
        ]
        
        labels = ["1. Select Location", "2. View Soil Status", "3. Get Recommendations"]
        
        for phone, (px, py, sc), label in zip(phones, positions, labels):
            sw, sh = int(800 * sc), int(1650 * sc)
            ps = phone.resize((sw, sh), Image.Resampling.LANCZOS)
            
            self.draw_shadow(px, py, sw, sh, int(60 * sc))
            self.img.paste(ps, (px, py), ps)
            
            self.draw.text((px + sw // 2, py + sh + 60), label, 
                          fill=self.hex('clay_dark'), font=get_font(36, bold=True), anchor="mm")
        
        self.current_y = ys + h

    def benefits_section(self):
        """Benefits"""
        h = int(HEIGHT * 0.15)
        ys = self.current_y
        pd = 150
        
        self.draw.text((WIDTH // 2, ys + 100), "Why Filipino Farmers Choose LupAI", 
                      fill=self.hex('pure_black'), font=get_font(56, bold=True), anchor="mm")
        
        cw = (WIDTH - pd * 4) // 3
        cols = [pd + cw//2, pd*2 + cw + cw//2, pd*3 + cw*2 + cw//2]
        
        benefits = [
            ('money', 'COST SAVINGS', ['Save P5,000 per hectare', 'No expensive soil tests'], 'emerald'),
            ('crop', 'BETTER YIELDS', ['20+ crop varieties', 'Precision nutrient targeting'], 'rice_green'),
            ('phone', 'EASY TO USE', ['Results in 8 seconds', 'No technical knowledge needed'], 'deep_green')
        ]
        
        cy = ys + 240
        for cx, (icon, title, lines, color) in zip(cols, benefits):
            self.draw_icon_circle(cx, cy, 120, icon, color, 'pure_white')
            self.draw.text((cx, cy + 110), title, fill=self.hex('pure_black'), font=get_font(34, bold=True), anchor="mm")
            ly = cy + 190
            for line in lines:
                self.draw.text((cx, ly), line, fill=self.hex('clay_dark'), font=get_font(28), anchor="mm")
                ly += 50
        
        self.current_y = ys + h

    def how_it_works(self):
        """How it works"""
        h = int(HEIGHT * 0.20)
        ys = self.current_y
        
        # Subtle gradient bg
        self.add_gradient(ys, h, COLORS['rice_green'], COLORS['deep_green'], 0.06)
        
        self.draw.text((WIDTH // 2, ys + 90), "Simple as 1-2-3-4-5", 
                      fill=self.hex('pure_black'), font=get_font(56, bold=True), anchor="mm")
        
        steps = [
            ('1', 'Select Location', 'GPS or tap map', 'location'),
            ('2', 'Choose Crop', 'Tomato, Cabbage, etc.', 'crop'),
            ('3', 'AI Analyzes', 'Satellite in 6 sec', 'satellite'),
            ('4', 'View Soil Status', 'N-P-K-pH levels', 'chart'),
            ('5', 'Get Recommendations', 'Atlas, Planters brands', 'check')
        ]
        
        sw = (WIDTH - 200) // 5
        sx = 100
        cy = ys + 280
        
        for i, (num, title, desc, icon) in enumerate(steps):
            x = sx + i * sw + sw // 2
            
            # Number circle
            self.draw.ellipse([x - 90, cy - 90, x + 90, cy + 90], fill=self.hex('rice_green'))
            self.draw.text((x, cy + 10), num, fill=(255,255,255), font=get_font(72, bold=True), anchor="mm")
            
            # Icon
            self.draw_icon_circle(x, cy + 160, 80, icon, 'pure_white', 'deep_green')
            
            # Text
            self.draw.text((x, cy + 300), title, fill=self.hex('pure_black'), font=get_font(32, bold=True), anchor="mm")
            self.draw.text((x, cy + 360), desc, fill=self.hex('clay_dark'), font=get_font(24), anchor="mm")
            
            # Arrow
            if i < 4:
                ax = x + sw // 2 + 30
                self.draw.polygon([(ax, cy), (ax + 35, cy - 18), (ax + 35, cy + 18)], fill=self.hex('rice_green'))
        
        self.current_y = ys + h

    def before_after(self):
        """Comparison"""
        h = int(HEIGHT * 0.10)
        ys = self.current_y
        pd = 180
        
        cw = (WIDTH - pd * 3) // 2
        ch = h - 150
        
        cards = [
            (pd, 'WITHOUT LupAI', 'red', [
                'P3,500 for soil lab test',
                '7-14 days waiting',
                'Complex numeric reports'
            ]),
            (pd * 2 + cw, 'WITH LupAI', 'emerald', [
                'FREE instant analysis',
                '8 seconds results',
                'Simple Low/Medium/High display'
            ])
        ]
        
        cy = ys + 75
        for x, title, color, points in cards:
            self.draw_shadow(x, cy, cw, ch, 25)
            self.rounded_rectangle([x, cy, x + cw, cy + ch], 25, fill=self.hex('pure_white'))
            
            # X or Check
            sym = 'X' if color == 'red' else ''
            if color == 'red':
                self.draw.ellipse([x + 50, cy + 50, x + 110, cy + 110], fill=self.hex('red'))
                self.draw.text((x + 80, cy + 78), "X", fill=(255,255,255), font=get_font(40, bold=True), anchor="mm")
            else:
                self.draw.ellipse([x + 50, cy + 50, x + 110, cy + 110], fill=self.hex('emerald'))
                self.draw.text((x + 80, cy + 78), "V", fill=(255,255,255), font=get_font(36, bold=True), anchor="mm")
            
            self.draw.text((x + 140, cy + 60), title, fill=self.hex(color), font=get_font(38, bold=True))
            
            py = cy + 160
            for pt in points:
                self.draw.text((x + 50, py), "• " + pt, fill=self.hex('clay_dark'), font=get_font(28))
                py += 55
        
        self.current_y = ys + h

    def metrics_section(self):
        """Impact metrics"""
        h = int(HEIGHT * 0.10)
        ys = self.current_y
        
        self.draw.text((WIDTH // 2, ys + 80), "Our Growing Impact", 
                      fill=self.hex('pure_black'), font=get_font(48, bold=True), anchor="mm")
        
        cw = 700
        ch = 320
        gap = (WIDTH - cw * 3) // 4
        metrics = [
            ('1000+', 'CAR Farmers', 'Served across Benguet'),
            ('20+', 'Crop Varieties', 'Tomato, Cabbage, Potato...'),
            ('8 sec', 'From GPS to', 'Fertilizer Recommendations')
        ]
        
        cy = ys + 160
        for i, (num, l1, l2) in enumerate(metrics):
            x = gap + i * (cw + gap)
            self.draw_shadow(x, cy, cw, ch, 20)
            self.rounded_rectangle([x, cy, x + cw, cy + ch], 20, fill=self.hex('pure_white'), 
                                  outline=self.hex('medium_gray'), width=2)
            
            self.draw.text((x + cw // 2, cy + 90), num, fill=self.hex('rice_green'), 
                          font=get_font(90, bold=True), anchor="mm")
            self.draw.text((x + cw // 2, cy + 190), l1, fill=self.hex('pure_black'), 
                          font=get_font(34, bold=True), anchor="mm")
            self.draw.text((x + cw // 2, cy + 245), l2, fill=self.hex('clay_dark'), 
                          font=get_font(26), anchor="mm")
        
        self.current_y = ys + h

    def tech_section(self):
        """Technology"""
        h = int(HEIGHT * 0.08)
        ys = self.current_y
        
        self.draw.rectangle([0, ys, WIDTH, ys + h], fill=self.hex('light_gray'))
        
        self.draw.text((WIDTH // 2, ys + 70), "Powered by Advanced Technology", 
                      fill=self.hex('pure_black'), font=get_font(40, bold=True), anchor="mm")
        
        badges = ['Sentinel-2 Satellite', 'Machine Learning AI', 'CAR Region Data', 'Philippine Fertilizers']
        bw = 450
        start_x = (WIDTH - len(badges) * bw) // 2 + bw // 2
        
        by = ys + 170
        for i, badge in enumerate(badges):
            x = start_x + i * bw
            self.rounded_rectangle([x - bw//2 + 20, by - 40, x + bw//2 - 20, by + 40], 25, 
                                  fill=self.hex('pure_white'))
            self.draw.text((x, by - 5), badge, fill=self.hex('clay_dark'), font=get_font(26), anchor="mm")
        
        self.current_y = ys + h

    def cta_footer(self):
        """Footer CTA"""
        h = int(HEIGHT * 0.07)
        ys = self.current_y
        
        # Dark gradient background
        for y in range(ys, ys + h):
            ratio = (y - ys) / h
            c1, c2 = self.hex('deep_green'), self.hex('clay_dark')
            r = int(c1[0] * (1 - ratio) + c2[0] * ratio)
            g = int(c1[1] * (1 - ratio) + c2[1] * ratio)
            b = int(c1[2] * (1 - ratio) + c2[2] * ratio)
            for x in range(WIDTH):
                self.img.putpixel((x, y), (r, g, b))
        self.draw = ImageDraw.Draw(self.img)
        
        # QR Code
        qr_s = 450
        qr_x, qr_y = 350, ys + (h - qr_s) // 2
        self.rounded_rectangle([qr_x, qr_y, qr_x + qr_s, qr_y + qr_s], 20, fill=self.hex('pure_white'))
        
        # Generate QR pattern
        cs = 22
        for row in range(qr_s // cs):
            for col in range(qr_s // cs):
                if row < 3 or row > qr_s//cs - 4 or col < 3 or col > qr_s//cs - 4:
                    if (row + col) % 2 == 0:
                        self.draw.rectangle([qr_x + col*cs + 3, qr_y + row*cs + 3,
                                            qr_x + (col+1)*cs - 3, qr_y + (row+1)*cs - 3], fill=self.hex('pure_black'))
                elif (row > 8 and row < 15 and col > 8 and col < 15):
                    if (row + col) % 2 == 0:
                        self.draw.rectangle([qr_x + col*cs + 3, qr_y + row*cs + 3,
                                            qr_x + (col+1)*cs - 3, qr_y + (row+1)*cs - 3], fill=self.hex('pure_black'))
                else:
                    if ((row * 7 + col * 13) % 7) > 2:
                        self.draw.rectangle([qr_x + col*cs + 3, qr_y + row*cs + 3,
                                            qr_x + (col+1)*cs - 3, qr_y + (row+1)*cs - 3], fill=self.hex('pure_black'))
        
        # CTA text
        tx = qr_x + qr_s + 120
        ty = ys + 160
        self.draw.text((tx, ty), "Try LupAI Free Today", fill=(255,255,255), font=get_font(68, bold=True))
        self.draw.text((tx, ty + 110), "Scan to access the web app — No download required", 
                      fill=(255,255,255, 220), font=get_font(36))
        self.draw.text((tx, ty + 220), "lupai.app", fill=self.hex('emerald'), font=get_font(52, bold=True))
        
        # Supported by
        sx = WIDTH - 550
        self.draw.text((sx, ys + 170), "Supported by:", fill=(255,255,255, 180), font=get_font(26))
        self.draw.text((sx, ys + 220), "CAR Agricultural", fill=(255,255,255), font=get_font(32, bold=True))
        self.draw.text((sx, ys + 270), "Research Center", fill=(255,255,255), font=get_font(32, bold=True))
        
        self.current_y = ys + h

    def generate(self):
        """Generate poster"""
        print("Generating LupAI Poster v2...")
        print("1. Hero Section..."); self.hero_section()
        print("2. App Showcase..."); self.app_showcase()
        print("3. Benefits Section..."); self.benefits_section()
        print("4. How It Works..."); self.how_it_works()
        print("5. Before/After..."); self.before_after()
        print("6. Metrics Section..."); self.metrics_section()
        print("7. Technology Section..."); self.tech_section()
        print("8. CTA Footer..."); self.cta_footer()
        return self.img

def main():
    gen = PosterGenerator()
    poster = gen.generate()
    
    # Save
    poster.save("LupAI_Poster_A0.png", "PNG", dpi=(300, 300))
    print("\n[OK] Poster saved: LupAI_Poster_A0.png")
    print(f"   Resolution: {poster.size[0]} x {poster.size[1]} px")
    print(f"   Print: A0 at 300 DPI")
    
    # Preview
    preview = poster.resize((1987, 2809), Image.Resampling.LANCZOS)
    preview.save("LupAI_Poster_Preview.png", "PNG")
    print(f"   Preview: LupAI_Poster_Preview.png")

if __name__ == "__main__":
    main()
