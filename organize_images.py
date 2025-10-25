import os
import shutil
from PIL import Image

extracted_dir = "frontend/images/extracted"
sponsors_dir = "frontend/images/sponsors"
speakers_dir = "frontend/images/speakers"

os.makedirs(sponsors_dir, exist_ok=True)
os.makedirs(speakers_dir, exist_ok=True)

# Check image sizes to identify logos vs photos
for i in range(1, 76):
    for ext in ['jpeg', 'png', 'jpg']:
        img_path = f"{extracted_dir}/image_{i}.{ext}"
        if os.path.exists(img_path):
            try:
                img = Image.open(img_path)
                width, height = img.size
                aspect = width / height if height > 0 else 0
                
                # Logos are typically wider (aspect > 1.5) and smaller
                # Photos are typically square-ish or portrait
                if width < 500 and aspect > 1.3:
                    print(f"Logo candidate: image_{i}.{ext} - {width}x{height} (aspect: {aspect:.2f})")
                elif 80 < width < 300 and 80 < height < 300:
                    print(f"Photo candidate: image_{i}.{ext} - {width}x{height} (aspect: {aspect:.2f})")
                    
            except Exception as e:
                print(f"Error reading image_{i}.{ext}: {e}")
            break
