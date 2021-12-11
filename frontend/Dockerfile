FROM ubuntu:20.04

RUN apt-get update -y && apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_14.x -o setup_14.sh && \
    sh ./setup_14.sh && \
    apt-get update && \
    apt-get install nodejs -y

EXPOSE 3000

WORKDIR /app

CMD [ "sleep", "100000" ]
