from typing import Dict, List
from elasticsearch.client import Elasticsearch
from fastapi import FastAPI, HTTPException
from es_feeds import simple_query, create_and_feed, multiple_term_search, add_company_to_index
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import re
from numpy import add
import redis
import pickle
import json
from entity_scraper import get_info_by_regon, get_info_by_nip


pkd_re = re.compile("PKD [0-9]{2}\.[0-9]{2}\.Z")

app = FastAPI()
es: Elasticsearch = create_and_feed()


def transform_es_search_results(es_result):
    transformed_result: List[Dict[str, str]] = []
    for res in es_result:
        transformed_result.append({
            "score": res['_score'],
            "summary": res['highlight']['description'][0],
            "name": res["_source"]['name'],
            "URL": res["_source"]['URL'],
            "source": res["_source"]["fund_source"],
            "money": res['_source']["financing_type"],
            "documents": res["_source"]["files"]
        })

    return transformed_result


@app.get("/search/{value}")
def search(value: str):
    print(value)
    additional_info = {}
    if len(value) == 9:
        # NIP
        # primary PKD
        primary_pkd, secondary_pkd, additional_info = get_info_by_nip(value)
        query = [*primary_pkd, *secondary_pkd]
        add_company_to_index(
            es,
            company_dict={
                "pkd": query,
                "nip": additional_info["nip"],
                "regon": additional_info["regon"],
                "type_of_entity": additional_info["type_of_entity"],
                'name': additional_info["name"]
            }
        )

    elif len(value) == 10:
        # REGON 10
        primary_pkd, secondary_pkd, additional_info = get_info_by_regon(value)
        query = [*primary_pkd, *secondary_pkd]

        add_company_to_index(
            es,
            company_dict={
                "pkd": query,
                "nip": additional_info["nip"],
                "regon": additional_info["regon"],
                "type_of_entity": additional_info["type_of_entity"],
                'name': additional_info["name"]
            }
        )

    else:
        # PKD
        # m = pkd_re.match(value)
        m = value.split("-")
        if len(m) < 2:
            raise HTTPException(status_code=304, detail="Invalid PKD request")
        query = m[1]

    if not isinstance(query, list):
        results = simple_query(es, query)
    else:
        results = multiple_term_search(es, query)
    results = transform_es_search_results(results)
    return {
        "search_results": results,
        "parsedQuery": query,
        "additional_info": additional_info
    }


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    global r
    r = redis.Redis(host='investment_redis_1', port=6379, db=0)

    with open("pkds.pkl", "rb") as f:
        r.set('pkds', json.dumps(pickle.load(f)).encode())


@app.get("/pkd/{value}")
def pkd(value: str):
    print(value)
    value = value.lower()
    global r
    pkds = json.loads(r.get('pkds').decode())
    propositions = []
    for item in pkds:
        if value in item[0].lower():
            propositions.append(item)

    if len(propositions) != 0:
        return propositions

    for item in pkds:
        if value in item[1].lower():
            propositions.append(item)

    return propositions
