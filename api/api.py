from PyPDF2 import PdfFileReader
import requests
import io
from bs4 import BeautifulSoup

url=requests.get('https://arxiv.org/list/stat.ML/recent')
soup = BeautifulSoup(url.content,"lxml")

for a in soup.find_all('a', href=True):
    if("pdf" in a):
        url = "https://arxiv.org" + a["href"] + ".pdf"
        print(url)
        response = requests.get(url)
        with io.BytesIO(response.content) as f:
            pdf = PdfFileReader(f)
            information = pdf.getDocumentInfo()
            number_of_pages = pdf.getNumPages()
            numpage=1
            page = pdf.getPage(numpage)
            page_content = page.extractText()
            print(page_content)