import glob
import os
from typing import Any, Dict, Iterable, List

import pandas as pd
from dotenv.main import find_dotenv
import ujson as json
from dotenv import load_dotenv
from elasticsearch import Elasticsearch
from elasticsearch.helpers import streaming_bulk
from tqdm import tqdm


def create_fund_indx(es: Elasticsearch, doc_dims: int = 256):
    """Create fund index"""
    dense_funds = {
        "settings": {
            "analysis": {
                "analyzer": {
                    "pl_analyzer": {
                        "type": "standard",
                        "filter": ["lowercase", "polish_stop", "polish_stem"],
                        "char_filter": ["html_strip"]
                    },
                },
                "filter": {
                    "polish_stop": {
                        "type": "stop",
                                "ignore_case": True,
                                "stopwords": ["_polish_"]  # plugin required
                    }
                }
            },
        },
        "mappings": {
            "properties": {
                """ 
                This is in case we roll out doc2vec
                """
                # "text_vector": {
                #     "type": "dense_vector",
                #     "dims": doc_dims
                # },
                "description": {
                    "type": "text",
                    "analyzer": "polish"
                },
                "name": {
                    "type": "text"
                },
                "url": {
                    "type": "text"
                },
                "fund_source": {
                    "type": "keyword"
                }
            }
        }
    }
    es.indices.delete("funds", ignore=[400, 404])
    es.indices.create(index="funds", body=dense_funds)


def strip_extra_tags(txt):
    for tag in ('\n',
                r'<em>', r'</em>', "\t"
                ):
        txt = txt.replace(tag, "")
    txt = txt.replace(u'\xa0', u' ')
    return txt


def stream_fund_docs(src: str, src_df: pd.DataFrame) -> Iterable[Dict[str, Any]]:
    """Stream funds to the ES stack"""
    records = src_df.to_dict('records')
    for record in records:
        yield {
            "_index": "funds",
            "_source": {
                'description': strip_extra_tags(record['FullDesc']),
                'name': record['Name'],
                'URL': record['URL'],
                'fund_source': src
            }
        }


def upload_datasets(es: Elasticsearch, dataset_ext="*.pkl"):
    """Uploads all datasets to ES"""
    create_fund_indx(es)
    for src_itm in glob.glob(os.path.join(os.curdir, 'data', dataset_ext)):
        df = pd.read_pickle(src_itm)
        print(src_itm, df.columns)
        bsn = os.path.basename(src_itm).replace(".pkl", "").upper()
        stream = stream_fund_docs(src=bsn, src_df=df)
        for ok, response in streaming_bulk(es, actions=stream):
            if not ok:
                print(response)


def create_es_instance() -> Elasticsearch:
    load_dotenv(find_dotenv())
    user = os.environ.get("USER")
    password = os.environ.get("PASS")
    addr = os.environ.get("ADDR")
    es = Elasticsearch(
        hosts=[
            f"http://{user}:{password}@{addr}:9200"
        ]
    )
    return es


def create_and_feed() -> Elasticsearch:
    es = create_es_instance()
    upload_datasets(es)
    return es


def multiple_term_search(PKD: List[str]):
    query = {
        'query': {
            'query_string': {
                'query': " OR ".join([f"({q})" for q in PKD]),
                "fields": ["description"]
            }
        },
        "highlight": {
            "fields": {
                "description": {}  # highlight here
            }
        }
    }

    results = es.search(index='test', body=query)
    return results['hits']['hits']


def simple_query(es: Elasticsearch, PKD: str):
    query = {
        'query': {
            'simple_query_string': {
                'query': PKD,
                "fields": ["description"]
            }
        },
        "highlight": {
            "fields": {
                "description": {}  # highlight here
            }
        }
    }

    results = es.search(index='funds', body=query)
    return results['hits']['hits']
