from urllib import parse
from bs4 import BeautifulSoup
from collections import defaultdict
import os
import pandas as pd
from w3lib.html import remove_tags
import requests
import html

CORE_URL = "https://www.funduszeeuropejskie.gov.pl/wyszukiwarka/mikro-male-i-srednie-przedsiebiorstwa/#/3757=716/3757=716%2523765/3757=716%2523718/3757=716%2523728/3757=716%2523731/3756=Mikro,%20małe%20i%20średnie%20przedsiębiorstwa"
COMPONENT_URL = "https://www.funduszeeuropejskie.gov.pl{}"
headers = {
    'User-Agent': 'Mozilla/5.0 (X11; OpenBSD i386) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
}

os.makedirs("euro", exist_ok=True)


def basic_strip(x):
    x = x.strip().replace("\n", " ").replace(
        "\t", " ").replace("    ", "")
    return x


def find_file_reference(bs4_tag):
    DOC_EXTENSIONS = (
        '.doc', '.xml', '.docx', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx',
        '.txt', ' .tar', '.tar.gz', '.zip', '.7zip', '.rarń'
    )
    doc_links = []
    hrefs = bs4_tag.find_all("a", href=True)
    for href in hrefs:
        pot_doc_link = href.get("href")
        for ext in DOC_EXTENSIONS:
            if pot_doc_link.endswith(ext):
                # TODO: check if the format is right
                doc_links.append(pot_doc_link)
    return doc_links


def download_website(savename: str, addr: str):
    r = requests.get(addr, headers=headers)
    p = html.unescape(r.text)
    return p
    # with open(savename, 'w') as f:
    # f.write(p)
    # return p


def follow_origin_href(href):
    parsed = download_website("none", href)
    soup = BeautifulSoup(parsed, features="html.parser")
    doc_links = find_file_reference(soup)
    return doc_links


def parse_euro():
    euro_grants = defaultdict(list)
    for i in range(1, 3):
        with open(f"./EURO/euro{i}.html", 'r') as f:
            txt = f.read()
            soup = BeautifulSoup(txt, features="html.parser")
            grants = soup.find_all("li", id="grants-list-skip")
            for grant in grants:

                name = grant.find("h3").text
                name = basic_strip(name)
                desc = grant.find("div", class_="content-list").text
                additional = grant.find_all("div", class_='content-more-list')
                additional = [remove_tags(a.text)
                              for a in additional if a.text]
                additional = " ".join([basic_strip(a) for a in additional])
                desc = basic_strip(desc)
                href = grant.find_all("a", href=True)[1].get("href")
                euro_grants['Name'].append(name)
                euro_grants['FullDesc'].append(desc)
                if href.startswith('/'):
                    href = COMPONENT_URL.format(href)
                euro_grants['URL'].append(href)
                try:
                    doc_links = follow_origin_href(href)
                    euro_grants["Files"].append(doc_links)
                except:
                    euro_grants["Files"].append([])

    df = pd.DataFrame.from_dict(euro_grants)
    df.to_pickle("EURO.pkl")


parse_euro()
