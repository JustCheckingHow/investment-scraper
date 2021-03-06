from sys import version_info
from bs4 import BeautifulSoup
from collections import defaultdict
import requests
import os
import html
import pandas as pd
from tqdm import tqdm
import re

BASE_URL = 'https://www.parp.gov.pl/component/grants/grantss?grants={}'
COMPONENT_URL = 'https://www.parp.gov.pl{}'
headers = {
    'User-Agent': 'Mozilla/5.0 (X11; OpenBSD i386) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
}

os.makedirs("PFR", exist_ok=True)


def basic_strip(x):
    x = x.strip().replace("\n", " ").replace(
        "\t", " ").replace("    ", "")
    return x


def download_website(savename: str, addr: str):
    r = requests.get(addr, headers=headers, verify=False)
    p = html.unescape(r.text)
    return p


def download_page(addr: str):
    r = requests.get(addr, headers=headers, verify=False)
    p = html.unescape(r.text)
    return p


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
            if '/attachment' in pot_doc_link:
                print("ALERT")
                # doc_links.append("https://www.gov.pl/{}".format(pot_doc_link))
    return doc_links


def follow_origin_href(href):
    parsed = download_page(href)
    soup = BeautifulSoup(parsed, features="html.parser")
    doc_links = find_file_reference(soup)
    return doc_links


def parse_PFR():
    free_text_data = defaultdict(list)
    df = pd.read_csv("PFR_granty.csv")
    print(df['name'])
    for i, (url, fund_name) in enumerate(zip(tqdm(df['url']), df['name'].tolist())):
        try:
            p = download_website(str(i), url)
            soup = BeautifulSoup(p, features="html.parser")
            for script in soup(["script", "style"]):
                script.extract()    # rip it out

            text = soup.get_text()
            # break into lines and remove leading and trailing space on each
            lines = (line.strip() for line in text.splitlines())
            # break multi-headlines into a line each
            chunks = (phrase.strip()
                      for line in lines for phrase in line.split("  "))
            # drop blank lines
            free_text = '\n'.join(chunk for chunk in chunks if chunk)
            free_text_data['FullDesc'].append(free_text)
            free_text_data['Name'].append(fund_name)
            free_text_data['URL'].append(url)
            print(url)
            doc_links = follow_origin_href(url)
            print(doc_links)
            return
            if doc_links:
                doc_links = list(set(doc_links))
                # print(doc_links)
                free_text_data['Files'].append(doc_links)
            else:
                free_text_data["Files"].append([])
        # except (requests.exceptions.SSLError, requests.exceptions.InvalidURL,
                # requests.exceptions.MissingSchema):
        # except:
        #     print("Failed", url)
    # tdf = pd.DataFrame.from_dict(free_text_data)
    # tdf.to_pickle("PARP.pkl")


def download_PFR():
    os.makedirs("PFR", exist_ok=True)
    for grants in range(3):
        x = BASE_URL.format(grants)
        print(x)
        r = requests.get(x, headers=headers, verify=False)
        p = html.unescape(r.text)
        with open(f"PFR/{grants}.html", 'w') as f:
            f.write(p)


def extract_funds():
    funds = defaultdict(list)
    with open(f"PFR/grants0.html", 'r') as f:
        x = BeautifulSoup(f, "html.parser")
        res = x.find_all(
            name='div', class_="card"
        )
        for card in res[2:]:
            parent_href = card.parent.get('href')
            if parent_href.startswith('/component'):
                parent_href = COMPONENT_URL.format(parent_href)
            name = card.find("h2", class_="text-black").text
            desc = card.find("p", class_="text-black").text
            print(parent_href.strip())
            funds['url'].append(parent_href.strip())
            funds['name'].append(basic_strip(name))
            funds['desc'].append(basic_strip(desc))

    df = pd.DataFrame.from_dict(funds)
    df.to_csv(" .csv", index=False)


if __name__ == "__main__":
    parse_PFR()
