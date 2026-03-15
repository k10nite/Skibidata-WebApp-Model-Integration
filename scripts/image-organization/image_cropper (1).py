import tkinter as tk
from tkinter import filedialog, ttk, messagebox
from PIL import Image, ImageTk, ImageDraw
from tkinterdnd2 import DND_FILES, TkinterDnD
import os

NAMING_PREFIXES = [
    "5R", "7.5R", "10R", "2.5YR", "5YR", "7.5YR", "10YR", 
    "2.5Y", "5Y", "10Y-5GY", "gley1", "gley2", "WHITE"
]

PREFIX_MAPPINGS = {
    "5R": {"rows": ["8", "7", "6", "5", "4", "3", "2.5"], "cols": ["1", "2", "3", "4", "6", "8"]},
    "7.5R": {"rows": ["8", "7", "6", "5", "4", "3", "2.5"], "cols": ["1", "2", "3", "4", "6", "8"]},
    "10R": {"rows": ["8", "7", "6", "5", "4", "3", "2.5"], "cols": ["1", "2", "3", "4", "6", "8"]},
    "2.5YR": {"rows": ["8", "7", "6", "5", "4", "3", "2.5"], "cols": ["1", "2", "3", "4", "6", "8"]},
    "5YR": {"rows": ["8", "7", "6", "5", "4", "3", "2.5"], "cols": ["1", "2", "3", "4", "6", "8"]},
    "7.5YR": {"rows": ["8", "7", "6", "5", "4", "3", "2.5"], "cols": ["1", "2", "3", "4", "6", "8"]},
    "10YR": {"rows": ["8", "7", "6", "5", "4", "3", "2.5"], "cols": ["1", "2", "3", "4", "6", "8"]},
    "2.5Y": {"rows": ["8", "7", "6", "5", "4", "3", "2.5"], "cols": ["1", "2", "3", "4", "6", "8"]},
    "5Y": {"rows": ["8", "7", "6", "5", "4", "3", "2.5"], "cols": ["1", "2", "3", "4", "6", "8"]},
    "10Y-5GY": {"rows": ["6", "5", "4", "3"], "cols": ["10Y-2", "10Y-4", "5GY-2", "5GY-4"]}, # Note: duplicate col values as per user spec
    "gley1": {"rows": ["8", "7", "6", "5", "4", "3", "2.5"], "cols": ["N", "10Y", "5GY", "10GY", "5G_1", "5G_2"]},
    "gley2": {"rows": ["8", "7", "6", "5", "4", "3", "2.5"], "cols": ["10G", "5BG", "10BG", "5B", "10B", "5PB"]},
    "WHITE": {"rows": ["N", "7.5YR_1", "7.5YR_2", "10YR_1", "10YR_2", "2.5Y_1", "2.5Y_2"], "cols": ["9.5", "9", "8.5", "8"]}
}

class ImageCropper(TkinterDnD.Tk):
    def __init__(self):
        super().__init__()
        self.title("Direct Image Cropper")
        self.geometry("1000x800")

        self.image_path = None
        self.original_image = None
        self.tk_image = None
        self.crop_rect_id = None
        
        self.selected_prefix = tk.StringVar(value=NAMING_PREFIXES[0])
        self.target_cell_row = tk.StringVar()
        self.target_cell_col = tk.StringVar()
        
        self.output_dir = "output_crops"
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

        self.disp_w = 0 
        self.disp_h = 0 
        self.scale_x = 0.0 
        self.scale_y = 0.0 

        controls_frame = ttk.Frame(self, padding=10)
        controls_frame.pack(side=tk.TOP, fill=tk.X)

        ttk.Button(controls_frame, text="Load Image", command=self.load_image_dialog).pack(side=tk.LEFT, padx=5)
        
        ttk.Label(controls_frame, text="Prefix:").pack(side=tk.LEFT, padx=5)
        self.prefix_menu = ttk.Combobox(controls_frame, textvariable=self.selected_prefix, values=NAMING_PREFIXES, width=10, state="readonly")
        self.prefix_menu.pack(side=tk.LEFT, padx=(0, 10))
        self.prefix_menu.bind('<<ComboboxSelected>>', self.update_cell_name_options)

        ttk.Label(controls_frame, text="Cell Row (Name):").pack(side=tk.LEFT, padx=5)
        self.cell_row_combobox = ttk.Combobox(controls_frame, textvariable=self.target_cell_row, width=12, state="readonly") 
        self.cell_row_combobox.pack(side=tk.LEFT, padx=(0, 5))
        
        ttk.Label(controls_frame, text="Cell Col (Name):").pack(side=tk.LEFT, padx=5)
        self.cell_col_combobox = ttk.Combobox(controls_frame, textvariable=self.target_cell_col, width=12, state="readonly") 
        self.cell_col_combobox.pack(side=tk.LEFT, padx=(0, 10))

        self.canvas = tk.Canvas(self, bg="lightgrey")
        self.canvas.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        self.canvas.drop_target_register(DND_FILES)
        self.canvas.dnd_bind('<<Drop>>', self.drop_image)

        self.status_label = ttk.Label(self, text="Load an image. Fill Prefix/Cell Row/Col, then drag on image to crop & save.", padding=5)
        self.status_label.pack(side=tk.BOTTOM, fill=tk.X)

        self.clear_state_button = ttk.Button(controls_frame, text="Clear Image/State", command=self.reset_all_state)
        self.clear_state_button.pack(side=tk.LEFT, padx=10)

        self._start_x = None
        self._start_y = None
        self._is_drawing_rect = False

        self.update_cell_name_options() 

    def update_cell_name_options(self, event=None):
        selected_prefix_val = self.selected_prefix.get()
        mapping = PREFIX_MAPPINGS.get(selected_prefix_val)

        if mapping:
            row_options = mapping.get("rows", [])
            col_options = mapping.get("cols", [])

            self.cell_row_combobox['values'] = row_options
            if row_options:
                self.target_cell_row.set(row_options[0])
            else:
                self.target_cell_row.set("")
                self.cell_row_combobox['values'] = [] 

            self.cell_col_combobox['values'] = col_options
            if col_options:
                self.target_cell_col.set(col_options[0])
            else:
                self.target_cell_col.set("")
                self.cell_col_combobox['values'] = [] 
        else: 
            self.cell_row_combobox['values'] = []
            self.target_cell_row.set("")
            self.cell_col_combobox['values'] = []
            self.target_cell_col.set("")
        print(f"[DEBUG] Updated Cell Row/Col options for prefix: {selected_prefix_val}")

    def drop_image(self, event):
        filepath = event.data.strip('{}') 
        if filepath:
            self.load_image(filepath)

    def load_image_dialog(self):
        filepath = filedialog.askopenfilename(
            title="Select an image",
            filetypes=(("Image files", "*.jpg *.jpeg *.png *.bmp *.gif"), ("All files", "*.*"))
        )
        if filepath:
            self.load_image(filepath)

    def load_image(self, filepath):
        try:
            self.image_path = filepath
            self.original_image = Image.open(filepath)
            self.display_image()
            self.status_label.config(text=f"Loaded: {os.path.basename(filepath)}. Fill Prefix/Cell Row/Col, then drag on image to crop & save.")
            self.canvas.bind("<ButtonPress-1>", self.on_press_rect)
            self.canvas.bind("<B1-Motion>", self.on_drag_rect)
            self.canvas.bind("<ButtonRelease-1>", self.on_release_rect)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load image: {e}")
            self.image_path = None
            self.original_image = None

    def display_image(self):
        if not self.original_image: return
        
        self.canvas.delete("all") 
        self.crop_rect_id = None

        canvas_width = self.canvas.winfo_width()
        canvas_height = self.canvas.winfo_height()
        if canvas_width <= 1 or canvas_height <= 1: 
            canvas_width, canvas_height = 800, 600 

        img_w, img_h = self.original_image.size
        aspect_ratio = img_w / img_h

        if canvas_width / aspect_ratio <= canvas_height:
            self.disp_w = canvas_width
            self.disp_h = int(canvas_width / aspect_ratio)
        else:
            self.disp_h = canvas_height
            self.disp_w = int(canvas_height * aspect_ratio)
        
        self.display_pil_image = self.original_image.resize((self.disp_w, self.disp_h), Image.Resampling.LANCZOS)
        self.tk_image = ImageTk.PhotoImage(self.display_pil_image)
        self.canvas.create_image(canvas_width//2, canvas_height//2, anchor=tk.CENTER, image=self.tk_image)
        self.canvas.config(scrollregion=self.canvas.bbox(tk.ALL))

        if self.disp_w > 0 and self.original_image:
            self.scale_x = self.original_image.width / self.disp_w
        else: 
            self.scale_x = 0.0 
            print("[WARN] self.disp_w is zero or invalid in display_image. scale_x set to 0.0")

        if self.disp_h > 0 and self.original_image:
            self.scale_y = self.original_image.height / self.disp_h
        else: 
            self.scale_y = 0.0 
            print("[WARN] self.disp_h is zero or invalid in display_image. scale_y set to 0.0")

    def on_press_rect(self, event):
        if not self.original_image: 
            return
        
        if self.scale_x == 0.0 or self.scale_y == 0.0:
            messagebox.showwarning("Image Not Ready", "Image scaling factors not properly set. Please reload the image or ensure the window is properly sized and the image is visible.")
            return
        
        if not (self.target_cell_row.get().strip() and self.target_cell_col.get().strip() and self.selected_prefix.get().strip()):
            messagebox.showwarning("Input Missing", "Please provide Prefix, Cell Row (Name), and Cell Col (Name) before selecting an area.")
            self._is_drawing_rect = False 
            return

        self._is_drawing_rect = True
        self._start_x = self.canvas.canvasx(event.x)
        self._start_y = self.canvas.canvasy(event.y)
        if self.crop_rect_id:
            self.canvas.delete(self.crop_rect_id)
        self.crop_rect_id = self.canvas.create_rectangle(self._start_x, self._start_y, self._start_x, self._start_y, outline="red", width=2)

    def on_drag_rect(self, event):
        if not self._is_drawing_rect: return
        cur_x = self.canvas.canvasx(event.x)
        cur_y = self.canvas.canvasy(event.y)
        self.canvas.coords(self.crop_rect_id, self._start_x, self._start_y, cur_x, cur_y)

    def on_release_rect(self, event):
        if not self._is_drawing_rect or not self.original_image or self.disp_w <= 0 or self.disp_h <= 0:
            self._is_drawing_rect = False 
            if self.crop_rect_id: 
                self.canvas.delete(self.crop_rect_id)
                self.crop_rect_id = None
            return
        
        self._is_drawing_rect = False 
        end_x = self.canvas.canvasx(event.x)
        end_y = self.canvas.canvasy(event.y)
        
        disp_x1 = min(self._start_x, end_x)
        disp_y1 = min(self._start_y, end_y)
        disp_x2 = max(self._start_x, end_x)
        disp_y2 = max(self._start_y, end_y)

        img_canvas_offset_x = (self.canvas.winfo_width() - self.disp_w) / 2
        img_canvas_offset_y = (self.canvas.winfo_height() - self.disp_h) / 2

        disp_x1 = max(disp_x1, img_canvas_offset_x)
        disp_y1 = max(disp_y1, img_canvas_offset_y)
        disp_x2 = min(disp_x2, img_canvas_offset_x + self.disp_w)
        disp_y2 = min(disp_y2, img_canvas_offset_y + self.disp_h)
        
        if self.crop_rect_id: 
             self.canvas.coords(self.crop_rect_id, disp_x1, disp_y1, disp_x2, disp_y2)
        
        self.save_defined_crop(disp_x1, disp_y1, disp_x2, disp_y2)

    def save_defined_crop(self, disp_x1, disp_y1, disp_x2, disp_y2):
        if not self.original_image or self.scale_x == 0.0 or self.scale_y == 0.0 or self.disp_w <= 0 or self.disp_h <= 0:
            messagebox.showerror("Save Error", "Image scaling not initialized or invalid. Cannot save crop. Please reload image.")
            if self.crop_rect_id: self.canvas.delete(self.crop_rect_id); self.crop_rect_id = None
            print("[DEBUG] Save Error: Image scaling not initialized or invalid (scale_x/y or disp_w/h is zero).")
            return
        
        prefix = self.selected_prefix.get().strip()
        row_name = self.target_cell_row.get().strip()
        col_name = self.target_cell_col.get().strip()

        if not (prefix and row_name and col_name):
            messagebox.showerror("Naming Error", "Prefix, Cell Row (Name), or Cell Col (Name) is missing or became empty.")
            if self.crop_rect_id: self.canvas.delete(self.crop_rect_id); self.crop_rect_id = None
            print("[DEBUG] Naming error triggered in save_defined_crop.") 
            return

        # Create prefix-specific subdirectory if it doesn't exist
        prefix_specific_dir = os.path.join(self.output_dir, prefix)
        try:
            if not os.path.exists(prefix_specific_dir):
                os.makedirs(prefix_specific_dir)
                print(f"[INFO] Created directory: {prefix_specific_dir}")
        except OSError as e:
            messagebox.showerror("Directory Error", f"Could not create directory {prefix_specific_dir}: {e}")
            if self.crop_rect_id: self.canvas.delete(self.crop_rect_id); self.crop_rect_id = None
            print(f"[ERROR] Failed to create directory {prefix_specific_dir}: {e}")
            return

        img_canvas_offset_x = (self.canvas.winfo_width() - self.disp_w) / 2
        img_canvas_offset_y = (self.canvas.winfo_height() - self.disp_h) / 2

        orig_crop_x1 = (disp_x1 - img_canvas_offset_x) * self.scale_x
        orig_crop_y1 = (disp_y1 - img_canvas_offset_y) * self.scale_y
        orig_crop_x2 = (disp_x2 - img_canvas_offset_x) * self.scale_x
        orig_crop_y2 = (disp_y2 - img_canvas_offset_y) * self.scale_y
        
        orig_crop_x1 = max(0, orig_crop_x1)
        orig_crop_y1 = max(0, orig_crop_y1)
        orig_crop_x2 = min(self.original_image.width, orig_crop_x2)
        orig_crop_y2 = min(self.original_image.height, orig_crop_y2)

        print(f"[DEBUG] Original Coords: x1={orig_crop_x1}, y1={orig_crop_y1}, x2={orig_crop_x2}, y2={orig_crop_y2}") 

        if orig_crop_x1 >= orig_crop_x2 or orig_crop_y1 >= orig_crop_y2:
            messagebox.showwarning("Crop Error", "Selected crop area is invalid or results in zero size. Try drawing a larger area.")
            if self.crop_rect_id: self.canvas.delete(self.crop_rect_id); self.crop_rect_id = None
            print(f"[DEBUG] Invalid crop area: x1={orig_crop_x1}, y1={orig_crop_y1}, x2={orig_crop_x2}, y2={orig_crop_y2}") 
            return

        try:
            crop_box = (int(orig_crop_x1), int(orig_crop_y1), int(orig_crop_x2), int(orig_crop_y2))
            print(f"[DEBUG] Crop Box: {crop_box}") 
            
            cropped_img = self.original_image.crop(crop_box)
            resized_img = cropped_img.resize((150, 150), Image.Resampling.LANCZOS) 
            
            filename = "" # Initialize filename
            if prefix == "10Y-5GY":
                try:
                    col_parts = col_name.split('-')
                    if len(col_parts) == 2:
                        specific_prefix_part = col_parts[0]  # e.g., "10Y" or "5GY"
                        col_number = col_parts[1]            # e.g., "2" or "4"
                        filename = f"{specific_prefix_part}-{row_name}-{col_number}.png"
                    else:
                        # Fallback if col_name is not in the expected format "PART-NUMBER"
                        print(f"[WARN] Unexpected col_name format for '10Y-5GY': {col_name}. Using default filename format.")
                        filename = f"{prefix}-{row_name}-{col_name}.png"
                except Exception as e:
                    print(f"[ERROR] Error parsing col_name '{col_name}' for '10Y-5GY': {e}. Using default filename format.")
                    filename = f"{prefix}-{row_name}-{col_name}.png"
            else:
                # Default filename format for other prefixes
                filename = f"{prefix}-{row_name}-{col_name}.png"
            
            save_path = os.path.join(prefix_specific_dir, filename)
            print(f"[DEBUG] Attempting to save to: {save_path}") 
            
            resized_img.save(save_path)
            
            print(f"Saved: {save_path} (150x150)") 
            self.status_label.config(text=f"Saved: {filename} (150x150)")

            try:
                current_col_val = self.target_cell_col.get()
                available_cols = list(self.cell_col_combobox['values'])
                if current_col_val in available_cols:
                    current_index = available_cols.index(current_col_val)
                    if current_index < len(available_cols) - 1:
                        next_col_val = available_cols[current_index + 1]
                        self.target_cell_col.set(next_col_val)
                        print(f"[DEBUG] Auto-incremented Cell Col to: {next_col_val}")
                    else:
                        print(f"[DEBUG] Cell Col '{current_col_val}' is the last option, not auto-incrementing further.")
                elif available_cols: 
                    self.target_cell_col.set(available_cols[0])
                    print(f"[DEBUG] Current Cell Col was invalid, reset to first option: {available_cols[0]}")
                else:
                    print(f"[DEBUG] No available columns to auto-increment to.")
            except Exception as e_inc: 
                print(f"[DEBUG] Error during Cell Col auto-increment: {type(e_inc).__name__} - {e_inc}")

        except Exception as e:
            filename_placeholder = f"{prefix}-{row_name}-{col_name}.png"
            print(f"[DEBUG] Exception in save_defined_crop for {filename_placeholder}: {type(e).__name__} - {e}") 
            import traceback 
            traceback.print_exc() 
            messagebox.showerror("Save Error", f"Failed to save {filename_placeholder}: {e}")
            self.status_label.config(text=f"Error saving {filename_placeholder}. Check console.")
        finally:
            if self.crop_rect_id: 
                self.canvas.delete(self.crop_rect_id)
                self.crop_rect_id = None

    def reset_all_state(self): 
        self.image_path = None
        self.original_image = None
        self.tk_image = None
        self.canvas.delete("all")
        if self.crop_rect_id:
            self.crop_rect_id = None
        
        self.canvas.unbind("<ButtonPress-1>")
        self.canvas.unbind("<B1-Motion>")
        self.canvas.unbind("<ButtonRelease-1>")

        self.target_cell_row.set("")
        self.target_cell_col.set("")
        
        self.status_label.config(text="Load an image. Fill Prefix/Cell Row/Col, then drag on image to crop & save.")
        self._is_drawing_rect = False

if __name__ == "__main__":
    app = ImageCropper()
    app.after(100, app.display_image) 
    app.mainloop()
