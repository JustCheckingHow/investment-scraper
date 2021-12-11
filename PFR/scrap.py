#%%
from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
from w3lib import html
from tqdm import tqdm

# %%
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

def scrap_single(url):
    r = requests.get(url)
    r.encoding = "utf-8"
    soup = BeautifulSoup(r.text, "html.parser")
    # title = soup.find("h1", {"class": "product__title"}).text
    # if title == "":
    #     title = soup.find("h1", {"class": "post-header__heading"}).text
    title = soup.title.text
    for i in soup.find_all("section", {"class": "section similar-items"}):
        i.decompose()
    text = sanitize(str(soup))
    return {"name": title, "text": text, "url": url}

scrap_single("https://pfr.pl/oferta/gwarancja-splaty-leasingu-pozyczki.html")

# %%
r = requests.get("https://pfr.pl/.rest/api/products?need=Finansowanie&productGroups=PFR,VENTURE_FOF,SMART-CITY-FINANSOWANIE")
r.encoding = "utf-8"
json = r.json()

res = []
for item in tqdm(json):
    res.append(scrap_single(item["location"]))

#%%
df = pd.DataFrame(res)
df.to_csv("pfr.tsv", index=False, sep='\t')