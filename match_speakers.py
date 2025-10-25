import fitz
import os
from PIL import Image

# 从PDF提取图片和位置信息
doc = fitz.open("GIIP3-Brochure-0515.pdf")
extracted_dir = "frontend/images/extracted"

# 已知的speaker照片
known_photos = {
    28: "speaker_1.jpeg",
    38: "speaker_2.jpeg", 
    44: "speaker_3.jpeg",
    59: "speaker_4.png",
    62: "speaker_5.jpeg",
    63: "speaker_6.jpeg",
    64: "speaker_7.jpeg"
}

# 查找所有页面的文本和图片
for page_num in range(min(10, len(doc))):  # 只看前10页
    page = doc[page_num]
    text = page.get_text()
    
    # 查找包含speaker信息的页面
    if any(keyword in text.lower() for keyword in ["keynote", "speaker", "professor", "dr.", "prof."]):
        print(f"\n{'='*60}")
        print(f"Page {page_num + 1}")
        print('='*60)
        
        # 提取文本块
        blocks = page.get_text("blocks")
        for block in blocks:
            block_text = block[4].strip()
            if block_text and len(block_text) > 10:
                # 查找可能的姓名和职位
                if any(title in block_text for title in ["Professor", "Prof.", "Dr.", "Director"]):
                    print(block_text)
                    print("-" * 40)

doc.close()
