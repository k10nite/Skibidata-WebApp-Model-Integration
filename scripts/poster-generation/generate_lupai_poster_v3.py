"""
LupAI Poster Generator v3 - Optimized
Creates a high-quality A0 poster (841 x 1189mm) at 300 DPI
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import numpy as np
import os

# A0 dimensions at 300 DPI
WIDTH = 9933
HEIGHT = 14043

# Brand Colors
COLORS = {
    'rice_green': (132, 147, 74),
    'deep_green': (46, 125, 50),
    'clay_dark': (73, 40, 40),
    'pure_black': (26, 26, 26),
    'pure_white': (255, 255, 255),
    'emerald': (16, 185, 129),
    'amber': (245, 158, 11),
    'red': (239, 68, 68),
    'light_gray': (248, 249, 250),
    'medium_gray': (233, 236, 239),
    'dark_gray': (108, 117, 125),
}

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
        self.img = Image.new('RGB', (WIDTH, HEIGHT), COLORS['pure_white'])
        self.draw = ImageDraw.Draw(self.img)
        self.current_y = 0
    
    def rounded_rect(self, xy, radius, fill, outline=None, width=1):
        """Draw rounded rectangle"""
        x1, y1, x2, y2 = xy
        self.draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)
    
    def shadow(self, x, y, w, h, radius, intensity=50):
        """Draw drop shadow"""
        shadow = Image.new('RGBA', (w + 80, h + 80), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow)
        sd.rounded_rectangle([40, 40, 40 + w, 40 + h], radius=radius, fill=(0, 0, 0, intensity))
        shadow = shadow.filter(ImageFilter.GaussianBlur(20))
        self.img.paste(shadow, (x - 40, y - 40), shadow)
        self.draw = ImageDraw.Draw(self.img)

    def icon_circle(self, cx, cy, size, icon_type, bg_color='rice_green', icon_color='pure_white'):
        """Draw icon in circle"""
        r = size // 2
        self.draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=COLORS[bg_color])
        
        s = int(size * 0.35)
        c = COLORS[icon_color]
        
        if icon_type == 'money':
            self.draw.ellipse([cx - s//2, cy - s//2, cx + s//2, cy + s//2], outline=c, width=4)
            self.draw.text((cx - 12, cy - 18), "P", fill=c, font=get_font(int(s*0.8), bold=True))
        elif icon_type == 'crop':
            self.draw.line([(cx, cy + s//3), (cx, cy - s//3)], fill=c, width=4)
            self.draw.ellipse([cx - s//3, cy - s//2, cx + s//3, cy], outline=c, width=3)
        elif icon_type == 'phone':
            self.draw.rounded_rectangle([cx - s//3, cy - s//2, cx + s//3, cy + s//2], radius=6, outline=c, width=3)
        elif icon_type == 'users':
            self.draw.ellipse([cx - s//2, cy - s//4, cx, cy + s//4], outline=c, width=3)
            self.draw.ellipse([cx, cy - s//4, cx + s//2, cy + s//4], outline=c, width=3)
        elif icon_type == 'check':
            self.draw.line([(cx - s//2, cy), (cx - s//6, cy + s//3), (cx + s//2, cy - s//3)], fill=c, width=5)
        elif icon_type == 'chart':
            for i, h in enumerate([0.5, 0.8, 0.6]):
                bx = cx - s//2 + i * s//3
                bh = int(s * h)
                self.draw.rectangle([bx, cy + s//2 - bh, bx + s//4, cy + s//2], fill=c)
        elif icon_type == 'location':
            self.draw.ellipse([cx - s//3, cy - s//2, cx + s//3, cy], outline=c, width=3)
            self.draw.polygon([(cx, cy + s//2), (cx - s//3, cy - s//4), (cx + s//3, cy - s//4)], fill=c)
        elif icon_type == 'satellite':
            self.draw.arc([cx - s//2, cy - s//6, cx + s//2, cy + s//2], 180, 360, fill=c, width=3)
            self.draw.line([(cx, cy + s//6), (cx, cy - s//2)], fill=c, width=3)
            self.draw.ellipse([cx - 6, cy - s//2 - 6, cx + 6, cy - s//2 + 6], fill=c)
        elif icon_type == 'clock':
            self.draw.ellipse([cx - s//2, cy - s//2, cx + s//2, cy + s//2], outline=c, width=3)
            self.draw.line([(cx, cy), (cx, cy - s//3)], fill=c, width=3)
            self.draw.line([(cx, cy), (cx + s//3, cy)], fill=c, width=3)

    def create_phone(self, screen_type):
        """Create phone mockup"""
        pw, ph = 750, 1550
        phone = Image.new('RGBA', (pw, ph), (0, 0, 0, 0))
        d = ImageDraw.Draw(phone)
        
        # Frame
        d.rounded_rectangle([0, 0, pw, ph], radius=60, fill=(25, 25, 25))
        m = 20
        d.rounded_rectangle([m, m, pw - m, ph - m], radius=48, fill=(255, 255, 255))
        
        # Notch
        d.rounded_rectangle([pw//2 - 45, 32, pw//2 + 45, 62], radius=10, fill=(0, 0, 0))
        
        cm = m + 30
        
        if screen_type == 'location':
            d.text((pw//2, 95), "Select Location", fill=(0,0,0), font=get_font(34, bold=True), anchor="mm")
            
            my = 155
            d.rounded_rectangle([cm, my, pw - cm, my + 360], radius=18, fill=(232, 245, 233))
            # Benguet map stylized
            d.polygon([(cm+70, my+70), (cm+200, my+50), (cm+280, my+160), (cm+160, my+260)], 
                     fill=(200, 230, 201), outline=(129, 199, 132), width=2)
            d.polygon([(cm+230, my+90), (cm+360, my+110), (cm+330, my+230), (cm+180, my+200)], 
                     fill=(165, 214, 167), outline=(102, 187, 106), width=2)
            
            # Pin
            px, py = cm + 200, my + 170
            d.ellipse([px-15, py-15, px+15, py+15], fill=(239, 68, 68))
            d.polygon([(px, py+25), (px-12, py-5), (px+12, py-5)], fill=(239, 68, 68))
            
            # Card
            cy = my + 400
            d.rounded_rectangle([cm, cy, pw - cm, cy + 170], radius=16, fill=(255,255,255), outline=(220,220,220), width=2)
            d.text((cm + 25, cy + 30), "La Trinidad, Benguet", fill=(0,0,0), font=get_font(28, bold=True))
            d.text((cm + 25, cy + 75), "Cordillera Administrative Region", fill=(100,100,100), font=get_font(22))
            d.text((cm + 25, cy + 115), "Philippines", fill=COLORS['rice_green'], font=get_font(22))
            
        elif screen_type == 'soil':
            d.text((pw//2, 95), "Soil Status", fill=(0,0,0), font=get_font(34, bold=True), anchor="mm")
            d.text((pw//2, 135), "La Trinidad, Benguet", fill=(100,100,100), font=get_font(22), anchor="mm")
            
            sy = 185
            cards = [
                ('Nitrogen (N)', 'LOW', 'red', '24 mg/kg'),
                ('Phosphorus (P)', 'MEDIUM', 'amber', '18 mg/kg'),
                ('Potassium (K)', 'HIGH', 'emerald', '285 mg/kg'),
                ('pH Level', 'OPTIMAL', 'emerald', '6.5 pH')
            ]
            colors = {'red': (239, 68, 68), 'amber': (245, 158, 11), 'emerald': (16, 185, 129)}
            
            for i, (name, level, ck, val) in enumerate(cards):
                y = sy + i * 150
                d.rounded_rectangle([cm, y, pw - cm, y + 130], radius=16, fill=(255,255,255), outline=(220,220,220), width=2)
                d.text((cm + 22, y + 22), name, fill=(0,0,0), font=get_font(26))
                d.text((cm + 22, y + 70), val, fill=(100,100,100), font=get_font(22))
                
                bc = colors[ck]
                bw = 140
                d.rounded_rectangle([pw - cm - bw - 12, y + 32, pw - cm - 12, y + 88], radius=22, fill=bc)
                d.text((pw - cm - bw//2 - 12, y + 48), level, fill=(255,255,255), font=get_font(20, bold=True), anchor="mm")
                
        elif screen_type == 'fertilizer':
            d.text((pw//2, 95), "Recommendations", fill=(0,0,0), font=get_font(32, bold=True), anchor="mm")
            
            fy = 160
            ferts = [
                ('Complete 14-14-14', 'Atlas Fertilizer', '1,350/bag', 'emerald'),
                ('Urea 46-0-0', 'Planters Products', '1,180/bag', 'amber'),
                ('Organic Compost', 'Cocofed', '450/bag', 'rice_green')
            ]
            cmap = {'emerald': (16, 185, 129), 'amber': (245, 158, 11), 'rice_green': (132, 147, 74)}
            
            for i, (name, brand, price, ck) in enumerate(ferts):
                y = fy + i * 260
                col = cmap[ck]
                d.rounded_rectangle([cm, y, pw - cm, y + 230], radius=16, fill=(255,255,255), outline=(220,220,220), width=2)
                d.rounded_rectangle([cm, y, cm + 10, y + 230], radius=16, fill=col)
                d.text((cm + 35, y + 32), name, fill=(0,0,0), font=get_font(28, bold=True))
                d.text((cm + 35, y + 78), brand, fill=(100,100,100), font=get_font(22))
                d.text((cm + 35, y + 130), "P" + price, fill=col, font=get_font(30, bold=True))
                d.rounded_rectangle([pw - cm - 130, y + 120, pw - cm - 18, y + 175], radius=18, fill=col)
                d.text((pw - cm - 74, y + 138), "Apply", fill=(255,255,255), font=get_font(22, bold=True), anchor="mm")
        
        # Home indicator
        d.rounded_rectangle([pw//2 - 45, ph - 22, pw//2 + 45, ph - 10], radius=6, fill=(0,0,0))
        return phone

    def hero_section(self):
        """Hero"""
        h = int(HEIGHT * 0.20)
        
        # Background
        arr = np.array(self.img)
        for y in range(h):
            alpha = (y / h) * 0.06
            arr[y, :] = arr[y, :] * (1 - alpha) + np.array(COLORS['rice_green']) * alpha
        self.img = Image.fromarray(arr.astype(np.uint8))
        self.draw = ImageDraw.Draw(self.img)
        
        # Logo
        ls = 170
        self.draw.ellipse([WIDTH//2 - ls//2, 200, WIDTH//2 + ls//2, 370], fill=COLORS['rice_green'])
        self.draw.text((WIDTH // 2, 290), "L", fill=COLORS['pure_white'], font=get_font(100, bold=True), anchor="mm")
        
        # Headlines
        self.draw.text((WIDTH // 2, 450), "LupAI", fill=COLORS['pure_black'], font=get_font(200, bold=True), anchor="mm")
        self.draw.text((WIDTH // 2, 650), "From Satellite to Soil", fill=COLORS['clay_dark'], font=get_font(60), anchor="mm")
        self.draw.text((WIDTH // 2, 760), "AI-Powered Fertilizer Recommendations in 8 Seconds", 
                      fill=COLORS['rice_green'], font=get_font(38), anchor="mm")
        self.draw.text((WIDTH // 2, 840), "Mula Satellite hanggang Lupa — Para sa Bawat Magsasakang Pilipino", 
                      fill=COLORS['deep_green'], font=get_font(26), anchor="mm")
        
        self.current_y = h

    def app_showcase(self):
        """App screenshots"""
        h = int(HEIGHT * 0.30)
        ys = self.current_y
        
        self.draw.rectangle([0, ys, WIDTH, ys + h], fill=COLORS['light_gray'])
        
        self.draw.text((WIDTH // 2, ys + 90), "Precision Agriculture in Your Pocket", 
                      fill=COLORS['pure_black'], font=get_font(54, bold=True), anchor="mm")
        
        phones = [self.create_phone(t) for t in ['location', 'soil', 'fertilizer']]
        positions = [
            (WIDTH // 2 - 1200, ys + 150, 0.85),
            (WIDTH // 2 - 375, ys + 100, 1.0),
            (WIDTH // 2 + 450, ys + 150, 0.85)
        ]
        labels = ["1. Select Location", "2. View Soil Status", "3. Get Recommendations"]
        
        for phone, (px, py, sc), label in zip(phones, positions, labels):
            sw, sh = int(750 * sc), int(1550 * sc)
            ps = phone.resize((sw, sh), Image.Resampling.LANCZOS)
            self.shadow(px, py, sw, sh, int(55 * sc))
            self.img.paste(ps, (px, py), ps)
            self.draw.text((px + sw // 2, py + sh + 55), label, 
                          fill=COLORS['clay_dark'], font=get_font(34, bold=True), anchor="mm")
        
        self.current_y = ys + h

    def benefits_section(self):
        """Benefits"""
        h = int(HEIGHT * 0.15)
        ys = self.current_y
        pd = 150
        
        self.draw.text((WIDTH // 2, ys + 90), "Why Filipino Farmers Choose LupAI", 
                      fill=COLORS['pure_black'], font=get_font(54, bold=True), anchor="mm")
        
        cw = (WIDTH - pd * 4) // 3
        cols = [pd + cw//2, pd*2 + cw + cw//2, pd*3 + cw*2 + cw//2]
        
        benefits = [
            ('money', 'COST SAVINGS', ['Save P5,000 per hectare', 'No expensive soil tests'], 'emerald'),
            ('crop', 'BETTER YIELDS', ['20+ crop varieties', 'Precision nutrient targeting'], 'rice_green'),
            ('phone', 'EASY TO USE', ['Results in 8 seconds', 'No technical knowledge needed'], 'deep_green')
        ]
        
        cy = ys + 220
        for cx, (icon, title, lines, color) in zip(cols, benefits):
            self.icon_circle(cx, cy, 110, icon, color, 'pure_white')
            self.draw.text((cx, cy + 100), title, fill=COLORS['pure_black'], font=get_font(32, bold=True), anchor="mm")
            ly = cy + 170
            for line in lines:
                self.draw.text((cx, ly), line, fill=COLORS['clay_dark'], font=get_font(26), anchor="mm")
                ly += 45
        
        self.current_y = ys + h

    def how_it_works(self):
        """Steps"""
        h = int(HEIGHT * 0.20)
        ys = self.current_y
        
        # Light green bg
        arr = np.array(self.img)
        for y in range(ys, ys + h):
            alpha = 0.05
            arr[y, :] = arr[y, :] * (1 - alpha) + np.array(COLORS['rice_green']) * alpha
        self.img = Image.fromarray(arr.astype(np.uint8))
        self.draw = ImageDraw.Draw(self.img)
        
        self.draw.text((WIDTH // 2, ys + 80), "Simple as 1-2-3-4-5", 
                      fill=COLORS['pure_black'], font=get_font(54, bold=True), anchor="mm")
        
        steps = [
            ('1', 'Select Location', 'GPS or tap map', 'location'),
            ('2', 'Choose Crop', 'Tomato, Cabbage, etc.', 'crop'),
            ('3', 'AI Analyzes', 'Satellite in 6 sec', 'satellite'),
            ('4', 'View Soil Status', 'N-P-K-pH levels', 'chart'),
            ('5', 'Get Recommendations', 'Atlas, Planters', 'check')
        ]
        
        sw = (WIDTH - 150) // 5
        sx = 75
        cy = ys + 250
        
        for i, (num, title, desc, icon) in enumerate(steps):
            x = sx + i * sw + sw // 2
            
            self.draw.ellipse([x - 85, cy - 85, x + 85, cy + 85], fill=COLORS['rice_green'])
            self.draw.text((x, cy + 8), num, fill=COLORS['pure_white'], font=get_font(68, bold=True), anchor="mm")
            
            self.icon_circle(x, cy + 150, 75, icon, 'pure_white', 'deep_green')
            
            self.draw.text((x, cy + 280), title, fill=COLORS['pure_black'], font=get_font(30, bold=True), anchor="mm")
            self.draw.text((x, cy + 335), desc, fill=COLORS['clay_dark'], font=get_font(22), anchor="mm")
            
            if i < 4:
                ax = x + sw // 2 + 25
                self.draw.polygon([(ax, cy), (ax + 30, cy - 15), (ax + 30, cy + 15)], fill=COLORS['rice_green'])
        
        self.current_y = ys + h

    def before_after(self):
        """Comparison"""
        h = int(HEIGHT * 0.10)
        ys = self.current_y
        pd = 160
        
        cw = (WIDTH - pd * 3) // 2
        ch = h - 130
        cy = ys + 65
        
        # Without
        x = pd
        self.shadow(x, cy, cw, ch, 22)
        self.rounded_rect([x, cy, x + cw, cy + ch], 22, fill=COLORS['pure_white'])
        self.draw.ellipse([x + 45, cy + 45, x + 100, cy + 100], fill=COLORS['red'])
        self.draw.text((x + 73, cy + 58), "X", fill=COLORS['pure_white'], font=get_font(36, bold=True), anchor="mm")
        self.draw.text((x + 125, cy + 55), "WITHOUT LupAI", fill=COLORS['red'], font=get_font(36, bold=True))
        
        points = ['P3,500 for soil lab test', '7-14 days waiting', 'Complex numeric reports']
        py = cy + 150
        for pt in points:
            self.draw.text((x + 45, py), "• " + pt, fill=COLORS['clay_dark'], font=get_font(26))
            py += 50
        
        # With
        x = pd * 2 + cw
        self.shadow(x, cy, cw, ch, 22)
        self.rounded_rect([x, cy, x + cw, cy + ch], 22, fill=COLORS['pure_white'])
        self.draw.ellipse([x + 45, cy + 45, x + 100, cy + 100], fill=COLORS['emerald'])
        self.draw.text((x + 73, cy + 58), "L", fill=COLORS['pure_white'], font=get_font(32, bold=True), anchor="mm")
        self.draw.text((x + 125, cy + 55), "WITH LupAI", fill=COLORS['emerald'], font=get_font(36, bold=True))
        
        points = ['FREE instant analysis', '8 seconds results', 'Simple Low/Medium/High display']
        py = cy + 150
        for pt in points:
            self.draw.text((x + 45, py), "• " + pt, fill=COLORS['clay_dark'], font=get_font(26))
            py += 50
        
        self.current_y = ys + h

    def metrics_section(self):
        """Metrics"""
        h = int(HEIGHT * 0.10)
        ys = self.current_y
        
        self.draw.text((WIDTH // 2, ys + 70), "Our Growing Impact", 
                      fill=COLORS['pure_black'], font=get_font(46, bold=True), anchor="mm")
        
        cw = 650
        ch = 300
        gap = (WIDTH - cw * 3) // 4
        metrics = [
            ('1000+', 'CAR Farmers', 'Served across Benguet'),
            ('20+', 'Crop Varieties', 'Tomato, Cabbage, Potato...'),
            ('8 sec', 'From GPS to', 'Recommendations')
        ]
        
        cy = ys + 150
        for i, (num, l1, l2) in enumerate(metrics):
            x = gap + i * (cw + gap)
            self.shadow(x, cy, cw, ch, 18)
            self.rounded_rect([x, cy, x + cw, cy + ch], 18, fill=COLORS['pure_white'], 
                            outline=COLORS['medium_gray'], width=2)
            
            self.draw.text((x + cw // 2, cy + 85), num, fill=COLORS['rice_green'], 
                          font=get_font(84, bold=True), anchor="mm")
            self.draw.text((x + cw // 2, cy + 180), l1, fill=COLORS['pure_black'], 
                          font=get_font(32, bold=True), anchor="mm")
            self.draw.text((x + cw // 2, cy + 230), l2, fill=COLORS['clay_dark'], 
                          font=get_font(24), anchor="mm")
        
        self.current_y = ys + h

    def tech_section(self):
        """Tech"""
        h = int(HEIGHT * 0.08)
        ys = self.current_y
        
        self.draw.rectangle([0, ys, WIDTH, ys + h], fill=COLORS['light_gray'])
        
        self.draw.text((WIDTH // 2, ys + 60), "Powered by Advanced Technology", 
                      fill=COLORS['pure_black'], font=get_font(38, bold=True), anchor="mm")
        
        badges = ['Sentinel-2 Satellite', 'Machine Learning AI', 'CAR Region Data', 'Philippine Fertilizers']
        bw = 420
        start_x = (WIDTH - len(badges) * bw) // 2 + bw // 2
        by = ys + 160
        
        for i, badge in enumerate(badges):
            x = start_x + i * bw
            self.rounded_rect([x - bw//2 + 15, by - 35, x + bw//2 - 15, by + 35], 22, 
                            fill=COLORS['pure_white'])
            self.draw.text((x, by - 4), badge, fill=COLORS['clay_dark'], font=get_font(24), anchor="mm")
        
        self.current_y = ys + h

    def cta_footer(self):
        """Footer"""
        ys = self.current_y
        h = HEIGHT - ys
        
        # Dark gradient
        arr = np.array(self.img)
        c1, c2 = np.array(COLORS['deep_green']), np.array(COLORS['clay_dark'])
        for y in range(ys, min(ys + h, HEIGHT)):
            ratio = (y - ys) / h if h > 0 else 0
            arr[y, :] = c1 * (1 - ratio) + c2 * ratio
        self.img = Image.fromarray(arr.astype(np.uint8))
        self.draw = ImageDraw.Draw(self.img)
        
        # QR Code
        qs = 420
        qx, qy = 320, ys + (h - qs) // 2
        self.rounded_rect([qx, qy, qx + qs, qy + qs], 18, fill=COLORS['pure_white'])
        
        cs = 20
        for row in range(qs // cs):
            for col in range(qs // cs):
                is_corner = row < 3 or row > qs//cs - 4 or col < 3 or col > qs//cs - 4
                is_center = row > 8 and row < 15 and col > 8 and col < 15
                if is_corner or is_center:
                    if (row + col) % 2 == 0:
                        self.draw.rectangle([qx + col*cs + 2, qy + row*cs + 2,
                                            qx + (col+1)*cs - 2, qy + (row+1)*cs - 2], 
                                           fill=COLORS['pure_black'])
                elif ((row * 7 + col * 13) % 7) > 2:
                    self.draw.rectangle([qx + col*cs + 2, qy + row*cs + 2,
                                        qx + (col+1)*cs - 2, qy + (row+1)*cs - 2], 
                                       fill=COLORS['pure_black'])
        
        # Text
        tx = qx + qs + 100
        ty = ys + 140
        self.draw.text((tx, ty), "Try LupAI Free Today", fill=COLORS['pure_white'], font=get_font(64, bold=True))
        self.draw.text((tx, ty + 100), "Scan to access the web app — No download required", 
                      fill=(255,255,255), font=get_font(34))
        self.draw.text((tx, ty + 200), "lupai.app", fill=COLORS['emerald'], font=get_font(48, bold=True))
        
        # Support
        sx = WIDTH - 500
        self.draw.text((sx, ys + 150), "Supported by:", fill=(255,255,255, 200), font=get_font(24))
        self.draw.text((sx, ys + 195), "CAR Agricultural", fill=COLORS['pure_white'], font=get_font(30, bold=True))
        self.draw.text((sx, ys + 240), "Research Center", fill=COLORS['pure_white'], font=get_font(30, bold=True))
        
        self.current_y = ys + h

    def generate(self):
        """Generate poster"""
        print("Generating LupAI Poster v3 (Optimized)...")
        sections = [
            ("Hero", self.hero_section),
            ("App Showcase", self.app_showcase),
            ("Benefits", self.benefits_section),
            ("How It Works", self.how_it_works),
            ("Before/After", self.before_after),
            ("Metrics", self.metrics_section),
            ("Technology", self.tech_section),
            ("Footer", self.cta_footer),
        ]
        for name, func in sections:
            print(f"  Rendering {name}...")
            func()
        return self.img

def main():
    gen = PosterGenerator()
    poster = gen.generate()
    
    print("\nSaving poster...")
    poster.save("LupAI_Poster_A0.png", "PNG", dpi=(300, 300))
    print("[OK] LupAI_Poster_A0.png saved")
    print(f"   Size: {poster.size[0]} x {poster.size[1]} px")
    print(f"   Print: A0 (841 x 1189mm) @ 300 DPI")
    
    preview = poster.resize((1987, 2809), Image.Resampling.LANCZOS)
    preview.save("LupAI_Poster_Preview.png", "PNG")
    print("[OK] Preview saved")

if __name__ == "__main__":
    main()
