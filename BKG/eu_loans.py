# https://www.bgk.pl/pozyczki-unijne/oferta-pozyczek-unijnych/
#%%
from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
from w3lib import html

#%%
base_url = 'https://www.bgk.pl'
url = "https://www.bgk.pl/pozyczki-unijne/oferta-pozyczek-unijnych/"

def sanitize(text):
    text = html.remove_tags_with_content(text, which_ones=('script', 'style'))
    text = html.replace_tags(text, " ")
    text = html.replace_escape_chars(text)
    text = html.remove_comments(text)

    text = text.replace("  ", " ")
    for _ in range(30):
        text = text.replace("  ", " ")
    text = text.replace("  ", " ")
    text = text.replace("\xa0", " ")
    return text

r = requests.get(url)
r.encoding = "utf-8"

soup = BeautifulSoup(r.text, 'html.parser', from_encoding='utf-8')
items = soup.find_all('div', class_='jeremie-listing__item')
results = []
for item in items:
    name = item.h3.text

    if item.a['href'].startswith('http'):
        suburl = item.a['href']
    else:
        suburl = base_url + item.a['href']

    r = requests.get(suburl)
    r.encoding = "utf-8"
    soup = BeautifulSoup(r.text, 'html.parser', from_encoding='utf-8')
    text = sanitize(str(soup.find('div', class_='page-content')))
    results.append({'name': name, 'text': text, 'url': suburl})

#%%
df = pd.DataFrame(results)
df.to_csv('bgk_loans.tsv', index=False, sep='\t')

# %%
