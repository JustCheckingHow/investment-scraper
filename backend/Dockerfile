FROM ubuntu:20.04

RUN apt-get update -y && apt-get install uvicorn python3 python3-pip -y

WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY main.py /app

CMD ["uvicorn",  "main:app", "--reload"]
#ENTRYPOINT [ "python", "main.py" ]
