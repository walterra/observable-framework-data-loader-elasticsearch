import { run } from "./es_query.js";

const query = {
  index: "kibana_sample_data_logs",
  size: 0,
  aggs: {
    my_histogram: {
      date_histogram: {
        field: "@timestamp",
        calendar_interval: "1d",
      },
    },
  },
};

const resultPath = "aggregations.my_histogram.buckets";

process.stdout.write(await run(query, resultPath));
