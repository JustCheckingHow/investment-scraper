FROM docker.elastic.co/elasticsearch/elasticsearch:7.13.4

RUN bin/elasticsearch-plugin install analysis-stempel


# docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" es-pl