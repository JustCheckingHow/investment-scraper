from bs4 import BeautifulSoup
from collections import defaultdict
import os
import pandas as pd
from w3lib.html import remove_tags

CORE_URL = "https://www.funduszeeuropejskie.gov.pl/wyszukiwarka/mikro-male-i-srednie-przedsiebiorstwa/#/3757=716/3757=716%2523765/3757=716%2523718/3757=716%2523728/3757=716%2523731/3756=Mikro,%20małe%20i%20średnie%20przedsiębiorstwa"

headers = {
    'User-Agent': 'Mozilla/5.0 (X11; OpenBSD i386) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
}

os.makedirs("euro", exist_ok=True)


def basic_strip(x):
    x = x.strip().replace("\n", " ").replace(
        "\t", " ").replace("    ", "")
    return x


def parse_euro():
    euro_grants = defaultdict(list)
    for i in range(1, 3):
        with open(f"./EURO/euro{i}.html", 'r') as f:
            txt = f.read()
            soup = BeautifulSoup(txt, features="html.parser")
            grants = soup.find_all("li", id="grants-list-skip")
            for grant in grants:

                name = grant.find("h3").text
                names = basic_strip(name)
                desc = grant.find("div", class_="content-list").text
                additional = grant.find_all("div", class_='content-more-list')
                additional = [remove_tags(a.text)
                              for a in additional if a.text]
                additional = " ".join([basic_strip(a) for a in additional])
                desc = basic_strip(desc)
                href = grant.find_all("a", href=True)[1].get("href")
                euro_grants['Name'].append(name)
                euro_grants['FullDesc'].append(desc)
                euro_grants['URL'].append(href)

    df = pd.DataFrame.from_dict(euro_grants)
    df.to_pickle("EURO.pkl")


parse_euro()
