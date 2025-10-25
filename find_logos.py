import os
from PIL import Image

extracted_dir = "frontend/images/extracted"

print("Looking for logo candidates (wide aspect ratio):\n")

for i in range(1, 76):
    for ext in ['jpeg', 'png', 'jpg']:
        img_path = f"{extracted_dir}/image_{i}.{ext}"
        if os.path.exists(img_path):
            try:
                img = Image.open(img_path)
                width, height = img.size
                aspect = width / height if height > 0 else 0
                
                # Logos: wider than tall, reasonable size
                if aspect > 1.2 and width > 50 and width < 800:
                    print(f"image_{i}.{ext}: {width}x{height} (aspect: {aspect:.2f})")
                    
            except Exception as e:
                pass
            break
