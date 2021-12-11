# Elasticsearch 
### Basic EN version 
Running ES is simply:

```bash
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.13.4
```

### Polish custom build
Contains PL-analyzer plugin for stemming and stopwords analysis
```bash
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" lemurpwned/elastic713-pl
```

