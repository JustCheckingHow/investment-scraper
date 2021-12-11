from fastapi import FastAPI
import re
from entity_scrapper import get_info_by_regon, get_info_by_nip

pkd_re = re.compile("PKD [0-9]{2}\.[0-9]{2}\.Z")

app = FastAPI()

@app.get("/search/{value}")
def search(value: str):
    
    if len(value) == 9:
        pass
    elif len(value) == 10:
        # REGON 10
        pass
    elif len(value) == 13:
        #REGON 13
        pass
    elif pkd_re.match(value) != None:
        #PKD
        pass

    output = {
        "offers": []
    }

    #return {"item_id": item_id, "q": q}
