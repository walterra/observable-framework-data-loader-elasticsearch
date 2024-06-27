# Elasticsearch data loader

View live: <https://walterra.observablehq.cloud/framework-example-loader-elasticsearch/>

This Observable Framework example demonstrates how to write a TypeScript data loader that runs a query on Elasticsearch using the [Elasticsearch Node.js client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html). The data loader lives in [`src/data/kibana_sample_data_logs.csv.ts`](./src/data/kibana_logs_daily.csv.ts) and uses the helper [`src/data/es_client.ts`](./src/data/es_client.ts).
