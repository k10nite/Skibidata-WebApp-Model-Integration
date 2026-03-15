"""
LupAI Poster Generator - Final Version
A0 poster (841 x 1189mm) at 300 DPI = 9933 x 14043 pixels
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
import os

WIDTH, HEIGHT = 9933, 14043

COLORS = {
    'rice_green': (132, 147, 74),
    'deep_green': (46, 125, 50),
    'clay_dark': (73, 40, 40),
    'pure_black': (28, 28, 28),
    'pure_white': (255, 255, 255),
    'emerald': (16, 185, 129),
    'amber': (245, 158, 11),
    'red': (239, 83, 80),
    'light_gray': (248, 249, 250),
    'medium_gray': (222, 226, 230),
    'soft_green': (232, 245, 233),
}

def get_font(size, bold=False):
    paths = [
        f"C:/Windows/Fonts/{'Inter-Bold.ttf' if bold else 'Inter-Regular.ttf'}",
        f"C:/Windows/Fonts/{'ArialBD.ttf' if bold else 'Arial.ttf'}",
        f"C:/Windows/Fonts/{'arialbd.ttf' if bold else 'arial.ttf'}",
        f"C:/Windows/Fonts/{'segoeuib.ttf' if bold else 'segoeui.ttf'}",
        f"C:/Windows/Fonts/{'calibrib.ttf' if bold else 'calibri.ttf'}",
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

class Poster:
    def __init__(self):
        self.img = Image.new('RGB', (WIDTH, HEIGHT), COLORS['pure_white'])
        self.draw = ImageDraw.Draw(self.img)
        self.y = 0
    
    def shadow(self, x, y, w, h, r, blur=25, opacity=50):
        s = Image.new('RGBA', (w + blur*2, h + blur*2), (0,0,0,0))
        d = ImageDraw.Draw(s)
        d.rounded_rectangle([blur, blur, blur+w, blur+h], radius=r, fill=(0,0,0,opacity))
        s = s.filter(ImageFilter.GaussianBlur(blur//2))
        self.img.paste(s, (x-blur, y-blur), s)
        self.draw = ImageDraw.Draw(self.img)
    
    def phone(self, stype):
        pw, ph = 720, 1480
        p = Image.new('RGBA', (pw, ph), (0,0,0,0))
        d = ImageDraw.Draw(p)
        
        # Frame
        d.rounded_rectangle([0, 0, pw, ph], radius=55, fill=(30, 30, 30))
        m = 18
        d.rounded_rectangle([m, m, pw-m, ph-m], radius=42, fill=(255,255,255))
        
        # Notch
        d.rounded_rectangle([pw//2-40, 30, pw//2+40, 58], radius=10, fill=(0,0,0))
        
        cm = m + 28
        
        if stype == 'location':
            d.text((pw//2, 92), "Select Location", fill=(0,0,0), font=get_font(32, True), anchor="mm")
            
            # Stylized CAR map
            my = 145
            d.rounded_rectangle([cm, my, pw-cm, my+340], radius=16, fill=COLORS['soft_green'])
            d.polygon([(cm+65,my+60), (cm+190,my+45), (cm+270,my+150), (cm+155,my+245)], 
                     fill=(181, 215, 182), outline=(129,199,132), width=2)
            d.polygon([(cm+220,my+80), (cm+340,my+100), (cm+315,my+215), (cm+175,my+185)], 
                     fill=(165, 214, 167), outline=(102,187,106), width=2)
            
            # Pin on La Trinidad
            px, py = cm + 195, my + 155
            d.ellipse([px-14, py-14, px+14, py+14], fill=COLORS['red'])
            d.polygon([(px, py+22), (px-11, py-4), (px+11, py-4)], fill=COLORS['red'])
            
            # Location card
            cy = my + 375
            d.rounded_rectangle([cm, cy, pw-cm, cy+155], radius=14, fill=(255,255,255), outline=(220,220,220), width=2)
            d.text((cm+22, cy+28), "La Trinidad, Benguet", fill=(0,0,0), font=get_font(26, True))
            d.text((cm+22, cy+70), "Cordillera Administrative Region", fill=(100,100,100), font=get_font(20))
            d.text((cm+22, cy+105), "Philippines", fill=COLORS['rice_green'], font=get_font(20))
            
        elif stype == 'soil':
            d.text((pw//2, 92), "Soil Status", fill=(0,0,0), font=get_font(32, True), anchor="mm")
            d.text((pw//2, 130), "La Trinidad, Benguet", fill=(120,120,120), font=get_font(20), anchor="mm")
            
            sy = 175
            cards = [
                ('Nitrogen (N)', 'LOW', COLORS['red'], '24 mg/kg'),
                ('Phosphorus (P)', 'MEDIUM', COLORS['amber'], '18 mg/kg'),
                ('Potassium (K)', 'HIGH', COLORS['emerald'], '285 mg/kg'),
                ('pH Level', 'OPTIMAL', COLORS['emerald'], '6.5 pH')
            ]
            
            for i, (name, lvl, col, val) in enumerate(cards):
                y = sy + i * 145
                d.rounded_rectangle([cm, y, pw-cm, y+125], radius=14, fill=(255,255,255), outline=(220,220,220), width=2)
                d.text((cm+20, y+22), name, fill=(0,0,0), font=get_font(24))
                d.text((cm+20, y+65), val, fill=(100,100,100), font=get_font(20))
                
                bw = 130
                d.rounded_rectangle([pw-cm-bw-10, y+28, pw-cm-10, y+80], radius=20, fill=col)
                d.text((pw-cm-bw//2-10, y+44), lvl, fill=(255,255,255), font=get_font(18, True), anchor="mm")
                
        elif stype == 'fertilizer':
            d.text((pw//2, 92), "Recommendations", fill=(0,0,0), font=get_font(30, True), anchor="mm")
            
            fy = 155
            ferts = [
                ('Complete 14-14-14', 'Atlas Fertilizer', '1,350/bag', COLORS['emerald']),
                ('Urea 46-0-0', 'Planters Products', '1,180/bag', COLORS['amber']),
                ('Organic Compost', 'Cocofed', '450/bag', COLORS['rice_green'])
            ]
            
            for i, (name, brand, price, col) in enumerate(ferts):
                y = fy + i * 255
                d.rounded_rectangle([cm, y, pw-cm, y+225], radius=14, fill=(255,255,255), outline=(220,220,220), width=2)
                d.rounded_rectangle([cm, y, cm+10, y+225], radius=14, fill=col)
                d.text((cm+32, y+30), name, fill=(0,0,0), font=get_font(26, True))
                d.text((cm+32, y+75), brand, fill=(100,100,100), font=get_font(20))
                d.text((cm+32, y+125), "P"+price, fill=col, font=get_font(28, True))
                d.rounded_rectangle([pw-cm-120, y+115, pw-cm-18, y+165], radius=16, fill=col)
                d.text((pw-cm-69, y+131), "Apply", fill=(255,255,255), font=get_font(20, True), anchor="mm")
        
        d.rounded_rectangle([pw//2-45, ph-22, pw//2+45, ph-10], radius=6, fill=(0,0,0))
        return p
    
    def icon(self, cx, cy, size, itype, bg, fg='pure_white'):
        r = size // 2
        self.draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=COLORS[bg])
        s = int(size * 0.35)
        c = COLORS[fg]
        
        if itype == 'money':
            self.draw.ellipse([cx-s//2, cy-s//2, cx+s//2, cy+s//2], outline=c, width=4)
            self.draw.text((cx-10, cy-16), "P", fill=c, font=get_font(s, True))
        elif itype == 'crop':
            self.draw.line([(cx, cy+s//3), (cx, cy-s//3)], fill=c, width=4)
            self.draw.ellipse([cx-s//3, cy-s//2, cx+s//3, cy], outline=c, width=3)
        elif itype == 'phone':
            self.draw.rounded_rectangle([cx-s//3, cy-s//2, cx+s//3, cy+s//2], radius=6, outline=c, width=3)
        elif itype == 'chart':
            for i, h in enumerate([0.5, 0.8, 0.6]):
                bx = cx - s//2 + i * s//3
                bh = int(s * h)
                self.draw.rectangle([bx, cy+s//2-bh, bx+s//4, cy+s//2], fill=c)
        elif itype == 'location':
            self.draw.ellipse([cx-s//3, cy-s//2, cx+s//3, cy], outline=c, width=3)
            self.draw.polygon([(cx, cy+s//2), (cx-s//3, cy-s//4), (cx+s//3, cy-s//4)], fill=c)
        elif itype == 'satellite':
            self.draw.arc([cx-s//2, cy-s//6, cx+s//2, cy+s//2], 180, 360, fill=c, width=3)
            self.draw.line([(cx, cy+s//6), (cx, cy-s//2)], fill=c, width=3)
        elif itype == 'clock':
            self.draw.ellipse([cx-s//2, cy-s//2, cx+s//2, cy+s//2], outline=c, width=3)
            self.draw.line([(cx, cy), (cx, cy-s//3)], fill=c, width=3)
            self.draw.line([(cx, cy), (cx+s//3, cy)], fill=c, width=3)
        elif itype == 'check':
            self.draw.line([(cx-s//2, cy), (cx-s//6, cy+s//3), (cx+s//2, cy-s//3)], fill=c, width=5)

    def apply_gradient(self, y_start, h, c1, c2, vertical=True):
        """Apply gradient using numpy"""
        arr = np.array(self.img)
        if vertical:
            alpha = np.linspace(0, 1, h).reshape(-1, 1, 1)
            grad = np.array(c1) * (1 - alpha) + np.array(c2) * alpha
            arr[y_start:y_start+h] = grad.astype(np.uint8)
        self.img = Image.fromarray(arr)
        self.draw = ImageDraw.Draw(self.img)

    def section1_hero(self):
        h = int(HEIGHT * 0.17)
        
        # Gradient
        self.apply_gradient(0, h, COLORS['pure_white'], COLORS['rice_green'])
        
        # Logo
        self.draw.ellipse([WIDTH//2-90, 180, WIDTH//2+90, 360], fill=COLORS['rice_green'])
        self.draw.text((WIDTH//2, 275), "L", fill=COLORS['pure_white'], font=get_font(100, True), anchor="mm")
        
        # Title
        self.draw.text((WIDTH//2, 440), "LupAI", fill=COLORS['pure_black'], font=get_font(190, True), anchor="mm")
        self.draw.text((WIDTH//2, 610), "From Satellite to Soil", fill=COLORS['clay_dark'], font=get_font(56), anchor="mm")
        self.draw.text((WIDTH//2, 710), "AI-Powered Fertilizer Recommendations in 8 Seconds", 
                      fill=COLORS['rice_green'], font=get_font(36), anchor="mm")
        self.draw.text((WIDTH//2, 790), "Mula Satellite hanggang Lupa — Para sa Bawat Magsasakang Pilipino", 
                      fill=COLORS['deep_green'], font=get_font(26), anchor="mm")
        
        self.y = h

    def section2_phones(self):
        h = int(HEIGHT * 0.26)
        ys = self.y
        
        # Fill background
        arr = np.array(self.img)
        arr[ys:ys+h] = np.array(COLORS['light_gray'])
        self.img = Image.fromarray(arr)
        self.draw = ImageDraw.Draw(self.img)
        
        self.draw.text((WIDTH//2, ys+85), "Precision Agriculture in Your Pocket", 
                      fill=COLORS['pure_black'], font=get_font(52, True), anchor="mm")
        
        phones = [self.phone(t) for t in ['location', 'soil', 'fertilizer']]
        pos = [(WIDTH//2-1150, ys+140, 0.87), (WIDTH//2-360, ys+95, 1.0), (WIDTH//2+430, ys+140, 0.87)]
        labels = ["1. Select Location", "2. View Soil Status", "3. Get Recommendations"]
        
        for ph, (px, py, sc), lbl in zip(phones, pos, labels):
            sw, sh = int(720*sc), int(1480*sc)
            ps = ph.resize((sw, sh), Image.Resampling.LANCZOS)
            self.shadow(px, py, sw, sh, int(50*sc))
            self.img.paste(ps, (px, py), ps)
            self.draw = ImageDraw.Draw(self.img)
            self.draw.text((px+sw//2, py+sh+50), lbl, fill=COLORS['clay_dark'], font=get_font(32, True), anchor="mm")
        
        self.y = ys + h

    def section3_benefits(self):
        h = int(HEIGHT * 0.13)
        ys = self.y
        pd = 140
        
        self.draw.text((WIDTH//2, ys+85), "Why Filipino Farmers Choose LupAI", 
                      fill=COLORS['pure_black'], font=get_font(52, True), anchor="mm")
        
        cw = (WIDTH - pd*4) // 3
        cols = [pd+cw//2, pd*2+cw+cw//2, pd*3+cw*2+cw//2]
        
        benefits = [
            ('money', 'COST SAVINGS', ['Save P5,000 per hectare', 'No expensive soil tests'], 'emerald'),
            ('crop', 'BETTER YIELDS', ['20+ crop varieties', 'Precision nutrient targeting'], 'rice_green'),
            ('phone', 'EASY TO USE', ['Results in 8 seconds', 'No technical knowledge needed'], 'deep_green')
        ]
        
        cy = ys + 200
        for cx, (ic, title, lines, col) in zip(cols, benefits):
            self.icon(cx, cy, 100, ic, col, 'pure_white')
            self.draw.text((cx, cy+95), title, fill=COLORS['pure_black'], font=get_font(30, True), anchor="mm")
            ly = cy + 165
            for line in lines:
                self.draw.text((cx, ly), line, fill=COLORS['clay_dark'], font=get_font(24), anchor="mm")
                ly += 42
        
        self.y = ys + h

    def section4_steps(self):
        h = int(HEIGHT * 0.17)
        ys = self.y
        
        # Light green tint using numpy
        arr = np.array(self.img)
        section = arr[ys:ys+h].astype(float)
        c_green = np.array(COLORS['rice_green'])
        section = section * 0.95 + c_green * 0.05
        arr[ys:ys+h] = section.astype(np.uint8)
        self.img = Image.fromarray(arr)
        self.draw = ImageDraw.Draw(self.img)
        
        self.draw.text((WIDTH//2, ys+75), "Simple as 1-2-3-4-5", 
                      fill=COLORS['pure_black'], font=get_font(52, True), anchor="mm")
        
        steps = [
            ('1', 'Select Location', 'GPS or tap map', 'location'),
            ('2', 'Choose Crop', 'Tomato, Cabbage, etc.', 'crop'),
            ('3', 'AI Analyzes', 'Satellite in 6 sec', 'satellite'),
            ('4', 'View Soil Status', 'N-P-K-pH levels', 'chart'),
            ('5', 'Get Recommendations', 'Atlas, Planters', 'check')
        ]
        
        sw = (WIDTH - 120) // 5
        sx = 60
        cy = ys + 220
        
        for i, (num, title, desc, ic) in enumerate(steps):
            x = sx + i*sw + sw//2
            self.draw.ellipse([x-80, cy-80, x+80, cy+80], fill=COLORS['rice_green'])
            self.draw.text((x, cy+8), num, fill=COLORS['pure_white'], font=get_font(64, True), anchor="mm")
            
            self.icon(x, cy+145, 70, ic, 'pure_white', 'deep_green')
            self.draw.text((x, cy+265), title, fill=COLORS['pure_black'], font=get_font(28, True), anchor="mm")
            self.draw.text((x, cy+315), desc, fill=COLORS['clay_dark'], font=get_font(22), anchor="mm")
            
            if i < 4:
                ax = x + sw//2 + 20
                self.draw.polygon([(ax, cy), (ax+28, cy-14), (ax+28, cy+14)], fill=COLORS['rice_green'])
        
        self.y = ys + h

    def section5_compare(self):
        h = int(HEIGHT * 0.09)
        ys = self.y
        pd = 150
        
        cw = (WIDTH - pd*3) // 2
        ch = h - 100
        cy = ys + 50
        
        # Without
        x = pd
        self.shadow(x, cy, cw, ch, 20)
        self.draw.rounded_rectangle([x, cy, x+cw, cy+ch], radius=20, fill=COLORS['pure_white'])
        self.draw.ellipse([x+40, cy+40, x+95, cy+95], fill=COLORS['red'])
        self.draw.text((x+68, cy+52), "X", fill=COLORS['pure_white'], font=get_font(34, True), anchor="mm")
        self.draw.text((x+115, cy+50), "WITHOUT LupAI", fill=COLORS['red'], font=get_font(34, True))
        
        py = cy + 130
        for pt in ['P3,500 for soil lab test', '7-14 days waiting', 'Complex numeric reports']:
            self.draw.text((x+40, py), "• "+pt, fill=COLORS['clay_dark'], font=get_font(24))
            py += 48
        
        # With
        x = pd*2 + cw
        self.shadow(x, cy, cw, ch, 20)
        self.draw.rounded_rectangle([x, cy, x+cw, cy+ch], radius=20, fill=COLORS['pure_white'])
        self.draw.ellipse([x+40, cy+40, x+95, cy+95], fill=COLORS['emerald'])
        self.draw.text((x+68, cy+52), "L", fill=COLORS['pure_white'], font=get_font(30, True), anchor="mm")
        self.draw.text((x+115, cy+50), "WITH LupAI", fill=COLORS['emerald'], font=get_font(34, True))
        
        py = cy + 130
        for pt in ['FREE instant analysis', '8 seconds results', 'Simple Low/Medium/High display']:
            self.draw.text((x+40, py), "• "+pt, fill=COLORS['clay_dark'], font=get_font(24))
            py += 48
        
        self.y = ys + h

    def section6_metrics(self):
        h = int(HEIGHT * 0.09)
        ys = self.y
        
        self.draw.text((WIDTH//2, ys+55), "Our Growing Impact", 
                      fill=COLORS['pure_black'], font=get_font(44, True), anchor="mm")
        
        cw = 620
        ch = 270
        gap = (WIDTH - cw*3) // 4
        metrics = [
            ('1000+', 'CAR Farmers', 'Served across Benguet'),
            ('20+', 'Crop Varieties', 'Tomato, Cabbage, Potato...'),
            ('8 sec', 'From GPS to', 'Recommendations')
        ]
        
        cy = ys + 120
        for i, (num, l1, l2) in enumerate(metrics):
            x = gap + i*(cw+gap)
            self.shadow(x, cy, cw, ch, 18)
            self.draw.rounded_rectangle([x, cy, x+cw, cy+ch], radius=18, fill=COLORS['pure_white'], 
                                       outline=COLORS['medium_gray'], width=2)
            
            self.draw.text((x+cw//2, cy+75), num, fill=COLORS['rice_green'], font=get_font(80, True), anchor="mm")
            self.draw.text((x+cw//2, cy+155), l1, fill=COLORS['pure_black'], font=get_font(30, True), anchor="mm")
            self.draw.text((x+cw//2, cy+205), l2, fill=COLORS['clay_dark'], font=get_font(22), anchor="mm")
        
        self.y = ys + h

    def section7_tech(self):
        h = int(HEIGHT * 0.07)
        ys = self.y
        
        # Fill background
        arr = np.array(self.img)
        arr[ys:ys+h] = np.array(COLORS['light_gray'])
        self.img = Image.fromarray(arr)
        self.draw = ImageDraw.Draw(self.img)
        
        self.draw.text((WIDTH//2, ys+50), "Powered by Advanced Technology", 
                      fill=COLORS['pure_black'], font=get_font(36, True), anchor="mm")
        
        badges = ['Sentinel-2 Satellite', 'Machine Learning AI', 'CAR Region Data', 'Philippine Fertilizers']
        bw = 400
        sx = (WIDTH - len(badges)*bw) // 2 + bw//2
        by = ys + 130
        
        for i, b in enumerate(badges):
            x = sx + i*bw
            self.draw.rounded_rectangle([x-bw//2+15, by-32, x+bw//2-15, by+32], radius=20, fill=COLORS['pure_white'])
            self.draw.text((x, by-3), b, fill=COLORS['clay_dark'], font=get_font(22), anchor="mm")
        
        self.y = ys + h

    def section8_footer(self):
        ys = self.y
        h = HEIGHT - ys
        
        # Gradient
        arr = np.array(self.img)
        c1, c2 = np.array(COLORS['deep_green']), np.array(COLORS['clay_dark'])
        for y in range(h):
            r = y / h if h > 0 else 0
            arr[ys + y] = (c1 * (1-r) + c2 * r).astype(np.uint8)
        self.img = Image.fromarray(arr)
        self.draw = ImageDraw.Draw(self.img)
        
        # QR
        qs = 400
        qx, qy = 300, ys + (h-qs)//2
        self.draw.rounded_rectangle([qx, qy, qx+qs, qy+qs], radius=16, fill=COLORS['pure_white'])
        
        cs = 19
        for row in range(qs//cs):
            for col in range(qs//cs):
                corner = row < 3 or row > qs//cs-4 or col < 3 or col > qs//cs-4
                center = 8 < row < 15 and 8 < col < 15
                if corner or center:
                    if (row+col) % 2 == 0:
                        self.draw.rectangle([qx+col*cs+2, qy+row*cs+2, qx+(col+1)*cs-2, qy+(row+1)*cs-2], 
                                           fill=COLORS['pure_black'])
                elif ((row*7+col*13) % 7) > 2:
                    self.draw.rectangle([qx+col*cs+2, qy+row*cs+2, qx+(col+1)*cs-2, qy+(row+1)*cs-2], 
                                       fill=COLORS['pure_black'])
        
        # CTA
        tx = qx + qs + 90
        ty = ys + 120
        self.draw.text((tx, ty), "Try LupAI Free Today", fill=COLORS['pure_white'], font=get_font(62, True))
        self.draw.text((tx, ty+95), "Scan to access the web app — No download required", 
                      fill=(255,255,255), font=get_font(32))
        self.draw.text((tx, ty+190), "lupai.app", fill=COLORS['emerald'], font=get_font(48, True))
        
        # Support
        sx = WIDTH - 480
        self.draw.text((sx, ys+130), "Supported by:", fill=(255,255,255), font=get_font(22))
        self.draw.text((sx, ys+175), "CAR Agricultural", fill=COLORS['pure_white'], font=get_font(28, True))
        self.draw.text((sx, ys+220), "Research Center", fill=COLORS['pure_white'], font=get_font(28, True))
        
        self.y = HEIGHT

    def generate(self):
        print("Generating LupAI Poster...")
        self.section1_hero()
        self.section2_phones()
        self.section3_benefits()
        self.section4_steps()
        self.section5_compare()
        self.section6_metrics()
        self.section7_tech()
        self.section8_footer()
        return self.img

def main():
    poster = Poster().generate()
    
    poster.save("LupAI_Poster_A0.png", "PNG", dpi=(300, 300))
    print("\n[OK] LupAI_Poster_A0.png saved")
    print(f"   Resolution: {poster.size[0]} x {poster.size[1]} px")
    print(f"   Print size: A0 (841 x 1189mm) @ 300 DPI")
    
    preview = poster.resize((1987, 2809), Image.Resampling.LANCZOS)
    preview.save("LupAI_Poster_Preview.png", "PNG")
    print("[OK] Preview saved")

if __name__ == "__main__":
    main()
