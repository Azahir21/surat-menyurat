import sys
import fitz
import pytesseract
from pytesseract import Output
import cv2
import math
import os

file_path = sys.argv[1]
search_text = sys.argv[2]
pages = sys.argv[3]

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def pdf_to_image(file_path, output_path):
    for i in range(int(pages)):
        pdffile = file_path
        doc = fitz.open(pdffile)
        page = doc.load_page(i)
        pix = page.get_pixmap(matrix=fitz.Matrix(3, 3))
        output = output_path + str(i) + ".png"
        pix.save(output)
        doc.close()
        detect_specific_text(output, search_text, i)


def detect_specific_text(image_path, text, page_number):
    image = cv2.imread(image_path)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    custom_config = r"--psm 6 "
    boxes = pytesseract.image_to_boxes(
        gray_image, config=custom_config, output_type=Output.DICT
    )

    flag = False
    x_position = 0
    y_position = 0

    for i in range(len(boxes["char"])):
        (x, y) = (
            boxes["left"][i],
            boxes["bottom"][i],
        )
        word = boxes["char"][i].strip()

        if word == "X" and "".join(boxes["char"][i : i + 4]) == text:
            flag = True
            x_position = math.floor(x / 3)
            y_position = math.floor(y / 3)
            break

    if flag == False:
        print(page_number)
        os.remove(image_path)
        return

    print(
        page_number,
        x_position,
        y_position,
    )
    os.remove(image_path)


pdf_to_image(file_path, file_path.replace(".pdf", ""))
