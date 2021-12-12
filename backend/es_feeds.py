import glob
import os
import re
import string
from typing import Any, Dict, Iterable, List

import numpy as np
import pandas as pd
import ujson as json
from dotenv import load_dotenv
from dotenv.main import find_dotenv
from elasticsearch import Elasticsearch
from elasticsearch.helpers import streaming_bulk
from tqdm import tqdm

money_regex = r'([0-9]+\s?[0-9]*\s?[0-9]*\s?(EUR|PLN){1})'
three_zeros_regex = r'([0-9]*\s?[0-9]*\s?(000)\s?)'
tys_regex = r'([0-9]+\s?(tys\.))(\s?(zł|EUR))'
mrgx1 = re.compile(money_regex)
mrgx2 = re.compile(tys_regex)
pkd_vector_decoder = json.load(open('pkd_vector_decoder.json', 'r'))


def str_replacer(x, repls):
    for repl in repls:
        x = x.replace(repl, "")
    return x


def extract_fund_size(description):
    """Extract minimum and maximum funds"""
    m1 = mrgx1.findall(description)
    m2 = mrgx2.findall(description)
    if m2 or m1:
        if m1:
            ms = set([m[0] for m in m1])
            replaces = ('EURO', "EUR", "PLN", " ")
            ms_ = [int(str_replacer(m.strip(), replaces)) for m in ms]
            return min(ms_), max(ms_)
        else:
            replaces = ('tys.', 'PLN', "zł", " ")
            ms = set([m[0] for m in m2])
            ms_ = [int(str_replacer(m.strip(), replaces))*1000 for m in ms]
            return min(ms_), max(ms_)


additional_stopwords_list = ["działalność",
                             'produkcja',
                             'działalność', 'działalności',
                             "zakresie", "związanych", "związany", "związane",
                             'z',
                             'sprzedaż',
                             'wyrobów',
                             'w',
                             'pozostałych',
                             'hurtowa',
                             'detaliczna',
                             'prowadzona',
                             'sklepach',
                             'oraz',
                             'wyspecjalizowanych',
                             'związana',
                             'gdzie',
                             'indziej',
                             'do',
                             'pozostała',
                             'wyłączeniem',
                             'usługowa',
                             'dla',
                             'zakresie',
                             'urządzeń',
                             'na',
                             'niesklasyfikowana',
                             'pozostałe',
                             'artykułów',
                             'wspomagająca', 'towarów']


def create_fund_indx(es: Elasticsearch, doc_dims: int = 256):
    """Create fund index"""
    dense_funds = {
        "settings": {
            "analysis": {
                "analyzer": {
                    "pl_analyzer": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": ["lowercase", "polish_stop_filter",
                                   "polish_stem", "polish_stop_filter"],
                        "char_filter": ["html_strip"]
                    },
                },
                "filter": {
                    "polish_stop_filter": {
                        "type": "stop",
                        "ignore_case": True,
                        # plugin required
                        "stopwords": ["_polish_", *additional_stopwords_list]
                    }
                }
            },
        },
        "mappings": {
            "properties": {
                # "text_vector": {
                #     "type": "dense_vector",
                #     "dims": doc_dims
                # },
                "description": {
                    "type": "text",
                    "analyzer": "pl_analyzer"
                },
                "name": {
                    "type": "keyword"
                },
                "url": {
                    "type": "text"
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
        stripped_desc = strip_extra_tags(record['FullDesc'])
        min_funds, max_funds = extract_fund_size(stripped_desc)
        yield {
            "_index": "funds",
            "_source": {
                'description': stripped_desc,
                'name': record['Name'],
                'URL': record['URL'],
                "fund_range": min_funds if min_funds == max_funds else f'{min_funds}-{max_funds}',
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
    return es

def multiple_term_search(es: Elasticsearch, PKD: List[str]):
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

    results = es.search(index='funds', body=query)
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


def create_binary_pkd_vector(pkds):
    table = str.maketrans(dict.fromkeys(string.punctuation))
    vector = np.zeros((len(pkd_vector_decoder)), dtype=float)
    for pkd in pkds:
        key = pkd.strip().lower()
        key = key.translate(table)
        if key in pkd_vector_decoder:
            indx = pkd_vector_decoder[key]
            vector[indx] = 1
        else:
            print(f"failed: {pkd}")
    return vector.tolist()


def dense_query(es: Elasticsearch, query_vector: List[int]):
    query = {
        "query": {
            "script_score": {
                "query": {
                    "match_all": {}
                },
                "script": {
                    "source": "dotProduct(params.queryVector, doc['pkd_vector']);",
                    "params": {
                        "queryVector": query_vector
                    }
                }
            }
        }
    }
    results = es.search(
        index="company",
        body=query
    )
    return results["hits"]["hits"]


def company_correlation_search(es: Elasticsearch, pkds: List[str]):
    pkd_vector = create_binary_pkd_vector(pkds)
    return dense_query(es, pkd_vector)


def add_company_to_index(es: Elasticsearch, company_dict: Dict[str, Any]):
    pkds = company_dict['pkd']
    pkd_vector = create_binary_pkd_vector(pkds)
    doc = {
        "pkd_vector": pkd_vector,
        "nip": company_dict['nip'],
        'regon': company_dict['regon'],
        'name': company_dict['name'],
        'entity_type': company_dict["type_of_entity"],
        "pkd": company_dict['pkd']
    }
    nip = company_dict['nip']
    es.update(index="company", doc_type="_doc",
              id=nip,
              body={
                  "doc": doc,
                  'doc_as_upsert': True
              })
