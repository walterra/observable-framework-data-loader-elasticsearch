import {
  SearchRequest,
  SearchResponse,
} from "@elastic/elasticsearch/lib/api/typesWithBodyKey.js";
import * as Arrow from "apache-arrow";
import get from "lodash/get";

import { esClient } from "./es_client.js";

export async function run(query: SearchRequest, resultPath: string) {
  let resp: SearchResponse;

  try {
    resp = await esClient.search(query);
  } catch (e) {
    throw new Error(e);
  } finally {
    esClient.close();
  }

  if (!get(resp, resultPath)) {
    throw new Error("resultPath not defined");
  }

  const table = Arrow.tableFromJSON(get(resp, resultPath));
  return Arrow.tableToIPC(table);
}
