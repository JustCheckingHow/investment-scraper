from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import re
import redis
import pickle
import json

pkd_re = re.compile("PKD [0-9]{2}\.[0-9]{2}\.Z")

app = FastAPI()
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
    r = redis.Redis(host='backend_redis_1', port=6379, db=0)

    with open("pkds.pkl", "rb") as f:
        r.set('pkds', json.dumps(pickle.load(f)).encode())

@app.get("/search/{value}")
def search(value: str):
    if len(value) == 9:
        # NIP
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

@app.options("/")
def options(request):
    return {}