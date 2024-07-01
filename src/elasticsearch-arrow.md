# Elasticsearch ES|QL + Apache Arrow

Native support for Apache Arrow as a response format for Elasticsearch is currently under development here: https://github.com/elastic/elasticsearch/pull/109873

In the meantime, we can work around it using data loaders that convert the ES response to Apache Arrow. We can then load that into client side DuckDB-WASM via Observable's markdown header just like this:

```
---
sql:
  logs: ./data/es_esql.arrow
---
```
