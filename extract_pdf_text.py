import fitz

doc = fitz.open("GIIP3-Brochure-0515.pdf")

for page_num in range(len(doc)):
    page = doc[page_num]
    text = page.get_text()
    if "speaker" in text.lower() or "professor" in text.lower() or "keynote" in text.lower():
        print(f"\n=== Page {page_num + 1} ===")
        print(text)
        print("\n" + "="*50)

doc.close()
