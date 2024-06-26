import { esClient } from "./es_client.js";
import * as Arrow from "apache-arrow";

async function run() {
  const resp = await esClient.esql.query({
    query: `
    FROM kibana_sample_data_logs
    | STATS count = COUNT(*), bytes = AVG(bytes) BY url,date = BUCKET(@timestamp, 1 minute)
    | SORT url,date
    | LIMIT 10000000
    `,
    format: "json",
    columnar: false,
  });

  // console.warn(resp);

  const wrap = resp.values.map((row) =>
    row.reduce((p, c, i) => {
      p[resp.columns[i].name] = c;
      return p;
    }, {}),
  );

  // console.warn(wrap);

  const table = Arrow.tableFromJSON(wrap);
  process.stdout.write(Arrow.tableToIPC(table));
}

run().catch(console.warn);
