# https://www.bgk.pl/pozyczki-unijne/oferta-pozyczek-unijnych/
#%%
from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
from w3lib import html

#%%
base_url = 'https://www.bgk.pl'
url = "https://www.bgk.pl/programy-i-fundusze/programy/"
checked = []

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

def crawl_single(url, res):
    if url.startswith('http'):
        suburl = url
    else:
        suburl = base_url + url

    if suburl in checked:
        return

    r = requests.get(suburl)
    r.encoding = "utf-8"

    soup = BeautifulSoup(r.text, 'html.parser')
    if "tabs__nav" not in str(soup):
        links = get_links(soup)
        for link in links:
            crawl_single(link, res)
    else:
        name = soup.find('h1').text
        soup = BeautifulSoup(r.text, 'html.parser', from_encoding='utf-8')
        text = sanitize(str(soup))
        res.append({'name': name, 'text': text, 'url': suburl})
        checked.append(suburl)
        pd.DataFrame(res).to_csv('bgk_funds.tsv', index=False, sep='\t')

def get_links(soup):
    links = soup.find_all('a')
    res = []
    for link in links:
        if 'Dowiedz się więcej' in link.text.replace('ź', 'z'):
            res.append(link['href'])
    return res

    
#%%
res = []
url = "https://www.bgk.pl/programy-i-fundusze/fundusze/"
results = crawl_single(url, res)
df = pd.DataFrame(results)

# %%
df