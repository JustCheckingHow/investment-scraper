from typing import Dict, List
from elasticsearch.client import Elasticsearch
from fastapi import FastAPI, HTTPException
from es_feeds import simple_query, create_and_feed
import re

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
            "source": res["_source"]["fund_source"]
        })

    return transformed_result


@app.get("/search/{value}")
def search(value: str):
    PKD_query = value
    # if len(value) == 9:
    #     # NIP
    #     pass
    # elif len(value) == 10:
    #     # REGON 10
    #     pass
    # elif len(value) == 13:
    #     # REGON 13
    #     pass
    # elif pkd_re.match(value) != None:
    #     # PKD
    #     pass
    # else:
    #     raise HTTPException(status_code=304, detail="Unknown input code!")

    results = simple_query(es, PKD_query)
    results = transform_es_search_results(results)
    return {
        "search_results": results,
        "parsedQuery": PKD_query
    }
