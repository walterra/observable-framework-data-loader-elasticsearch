import { esClient } from "./es_client.js";
import * as Arrow from "apache-arrow";
import * as Parquet from "parquet-wasm";

async function run() {
  const resp = await esClient.esql.query({
    query: `
    FROM kibana_sample_data_logs
    | STATS count = COUNT(*), bytes = AVG(bytes) BY machine.ram,geo.src,response,url,date = DATE_FORMAT("YYYY-MM-dd", BUCKET(@timestamp, 1 day))
    | SORT date
    | LIMIT 100000
    `,
    format: "json",
    columnar: true,
  });

  const arrays = resp.columns.reduce((p, c, i) => {
    p[c.name] =
      c.name === "date"
        ? resp.values[i].map((d) => new Date(d))
        : resp.values[i];
    return p;
  }, {});

  // Construct an Apache Arrow table from the parallel arrays.
  const table = Arrow.tableFromArrays(arrays);

  // Output the Apache Arrow table as a Parquet table to standard out.
  const parquetTable = Parquet.Table.fromIPCStream(
    Arrow.tableToIPC(table, "stream"),
  );
  const parquetBuilder = new Parquet.WriterPropertiesBuilder()
    .setCompression(Parquet.Compression.ZSTD)
    .build();
  const parquetData = Parquet.writeParquet(parquetTable, parquetBuilder);
  process.stdout.write(parquetData);
}

run().catch(console.warn);
