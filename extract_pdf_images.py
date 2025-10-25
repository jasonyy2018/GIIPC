import fitz  # PyMuPDF
import os
from PIL import Image
import io

pdf_path = "GIIP3-Brochure-0515.pdf"
output_dir = "frontend/images/extracted"

os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
img_count = 0

for page_num in range(len(doc)):
    page = doc[page_num]
    images = page.get_images()
    
    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        img_count += 1
        img_filename = f"{output_dir}/image_{img_count}.{image_ext}"
        
        with open(img_filename, "wb") as img_file:
            img_file.write(image_bytes)
        
        print(f"Extracted: {img_filename}")

doc.close()
print(f"\nTotal images extracted: {img_count}")
