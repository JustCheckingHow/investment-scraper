from bs4 import BeautifulSoup
from collections import defaultdict
import requests
import os
import html
import pandas as pd

BASE_URL = 'https://www.parp.gov.pl/component/grants/grantss?grants={}'
COMPONENT_URL = 'https://www.parp.gov.pl{}'
headers = {
    'User-Agent': 'Mozilla/5.0 (X11; OpenBSD i386) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
}


# os.makedirs("PFR", exist_ok=True)
# for grants in range(3):
#     x = BASE_URL.format(grants)
#     print(x)
#     r = requests.get(x, headers=headers, verify=False)
#     p = html.unescape(r.text)
#     with open(f"PFR/{grants}.html", 'w') as f:
#         f.write(p)

def basic_strip(x):
    x = x.strip().replace("\n", " ").replace(
        "\t", " ").replace("    ", "")
    return x


fundusze = defaultdict(list)
with open(f"PFR/grants0.html", 'r') as f:
    x = BeautifulSoup(f, "html.parser")
    res = x.find_all(
        name='div', class_="card"
    )
    for card in res[2:]:
        href = card.parent.find_all(href=True)
        parent_href = card.parent.get('href')
        if parent_href.startswith('/component'):
            parent_href = COMPONENT_URL.format(parent_href)
        name = card.find("h2", class_="text-black").text
        desc = card.find("p", class_="text-black").text
        fundusze['url'].append(parent_href.strip())
        fundusze['name'].append(basic_strip(name))
        fundusze['desc'].append(basic_strip(desc))

df = pd.DataFrame.from_dict(fundusze)
df.to_csv("PFR_granty.csv", index=False)
