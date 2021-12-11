FROM ubuntu:20.04

RUN apt-get update -y && apt-get install wget uvicorn python3 python3-pip unzip -y && \
	wget https://chromedriver.storage.googleapis.com/96.0.4664.45/chromedriver_linux64.zip && \
	unzip chromedriver_linux64.zip   && \
	wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y ./google-chrome-stable_current_amd64.deb

WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY main.py /app

CMD ["uvicorn",  "main:app", "--reload", "--host", "0.0.0.0"]
#ENTRYPOINT [ "python", "main.py" ]
