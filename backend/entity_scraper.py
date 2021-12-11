from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
from bs4 import BeautifulSoup

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
    
    driver = webdriver.Chrome(executable_path="/app/chromedriver", options=options)
    driver.get('https://wyszukiwarkaregon.stat.gov.pl/appBIR/index.aspx')
    time.sleep(1)
    input_field = driver.find_element(By.XPATH, path)
    search_btn = driver.find_element(By.XPATH, '//*[@id="btnSzukaj"]')
    
    regon_input.send_keys("357126121")
    
    search_btn.click()
    time.sleep(1)
    try:
        regon_btn = driver.find_element(By.XPATH, '//*[@id="divListaJednostek"]/table/tbody/tr/td[1]/a')
        regon_btn.click()
        time.sleep(1)
        pkd_list_btn = driver.find_element(By.XPATH, '//*[@id="praw_butLinkDzial"]')
        pkd_list_btn.click()
        time.sleep(1)
        
        pkd_tables = driver.find_elements(By.CLASS_NAME, "tabelaZbiorczaPKD")
    except Exception as e:
        print(exception)
        return None, None
    
    primary_pkds = []
    secondary_pkds = [] 
    
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
        
    except Exception as e:
        print(e)
    finally: 
        driver.close()

    return primary_pkds, secondary_pkds

    #print(primary_pkds, secondary_pkds)







