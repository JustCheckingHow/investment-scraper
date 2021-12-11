from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
from bs4 import BeautifulSoup
import pandas as pd


def get_info_by_regon(regon):
    return get_info('//*[@id="txtRegon"]')


def get_info_by_nip(nip):
    return get_info('//*[@id="txtNip"]')


def get_info(path):
    options = Options()
    options.headless = True
    options.add_argument("--headless")
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')

    driver = webdriver.Chrome(
        executable_path="/app/chromedriver", options=options)
    driver.get('https://wyszukiwarkaregon.stat.gov.pl/appBIR/index.aspx')
    time.sleep(1)
    input_field = driver.find_element(By.XPATH, path)
    search_btn = driver.find_element(By.XPATH, '//*[@id="btnSzukaj"]')

    input_field.send_keys("357126121")

    search_btn.click()
    time.sleep(1)
    try:
        regon_btn = driver.find_element(
            By.XPATH, '//*[@id="divListaJednostek"]/table/tbody/tr/td[1]/a')
        regon_btn.click()
        time.sleep(1)
        pkd_list_btn = driver.find_element(
            By.XPATH, '//*[@id="praw_butLinkDzial"]')
        pkd_list_btn.click()
        time.sleep(1)

        pkd_tables = driver.find_elements(By.CLASS_NAME, "tabelaZbiorczaPKD")
    except Exception as e:
        print(e)
        return None, None

    primary_pkds = []
    secondary_pkds = []
    additional_info = None

    try:
        bsoup = BeautifulSoup(pkd_tables[0].get_attribute('innerHTML'))
        trs = bsoup.tbody.find_all('tr')
        for tr in trs:
            primary_pkds.append(tr.find_all('td')[1].text)

        if len(pkd_tables) > 1:
            bsoup = BeautifulSoup(pkd_tables[1].get_attribute('innerHTML'))
            trs = bsoup.tbody.find_all('tr')
            for tr in trs:
                secondary_pkds.append(tr.find_all('td')[1].text)

        additional_info = get_additional_info(driver) 
    except Exception as e:
        print(e)
    finally:
        driver.close()

    return primary_pkds, secondary_pkds, additional_info

def get_additional_info(driver):
    tables = driver.find_elements(By.CLASS_NAME, "tabelaRaportWewn") 
    additional_info = {
        "regon": driver.find_element(By.ID, 'praw_regon9').text,
        "nip": driver.find_element(By.ID, 'praw_nip').text,
        "name": driver.find_element(By.ID, 'praw_nazwa').text,
        "type_of_entity": driver.find_element(By.ID, 'praw_nazwaPodstawowejFormyPrawnej').text,
        "type_of_entity_exact": driver.find_element(By.ID, 'praw_nazwaSzczegolnejFormyPrawnej').text,
        "code_and_type": driver.find_element(By.ID, 'praw_nazwaFormyWlasnosci').text,
        "registering": driver.find_element(By.ID, 'praw_nazwaFormyWlasnosci').text,
    }

    return additional_info

    
