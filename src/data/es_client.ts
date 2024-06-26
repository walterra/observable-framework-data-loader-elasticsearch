import "dotenv/config";
import { Client } from "@elastic/elasticsearch";

const { ELASTICSEARCH_NODE } = process.env;

if (!ELASTICSEARCH_NODE) throw new Error("missing ELASTICSEARCH_NODE");

// Warning: you may wish to specify a self-signed certificate rather than
// disabling certificate verification via rejectUnauthorized: false as below.
// See https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html#auth-tls for more.
export const esClient = new Client({
  node: ELASTICSEARCH_NODE,
  tls: {
    rejectUnauthorized: false,
  },
});
