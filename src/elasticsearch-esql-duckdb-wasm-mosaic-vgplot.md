---
sql:
  logs: ./data/es_esql.parquet
---

# Elasticsearch ES|QL + DuckDB-wasm + Mosaic + VGPlot

This notebook demonstrates how to use the Elasticsearch data loader with DuckDB-wasm, mosaic and vgplot. The data loader will fetch data from Elasticsearch and convert it to the Parqeut format. We can then load that into client side DuckDB-WASM via Observable's markdown header just like this:

```
---
sql:
  logs: ./data/es_esql.parquet
---
```

In this case we're using ES|QL to rollup some data but keep a certain granularity. So while this is a single query, it will allow us to retain certain interactivity on the client side.

First, let's output the full ES|QL result in a table:

```js echo
Inputs.table(sql`SELECT * FROM logs`);
```

We can then run SQL queries on the client with the data we got from Elasticsearch:

```sql id=logsByDay echo
SELECT date, COUNT(*) as count, AVG(bytes) FROM logs GROUP BY date ORDER BY date
```

```js echo
Inputs.table(logsByDay);
```

And then just plot that data:

```js echo
Plot.plot({
  x: { type: "utc" },
  y: { grid: true },
  marks: [
    Plot.ruleY([0]),
    Plot.line(logsByDay, { x: "date", y: "count", tip: true }),
  ],
});
```

This example is not really about "big data" but good enough to demonstrate the potential. The full index in Elasticsearch is about 6.9 Mbyte. The arrow file with just the data we need brings that down to 59 Kbyte. You can think of the ES|QL query as a kind of rollup that gets us all the data we need on the client at a certain granularity. But as you will see, using that trimmed down data will still enable us to create some exploratory, interactive visualizations.

Now let's get interactive!

```js
const $filter = vg.Selection.crossfilter();
const $highlight = vg.Selection.intersect();
```

```js
vg.vconcat(
  vg.plot(
    vg.rectY(vg.from("logs", { filterBy: $filter }), {
      x: vg.bin("date"),
      y: vg.count(),
      fill: "steelblue",
      inset: 0.5,
    }),
    vg.intervalX({ as: $filter }),
    // vg.xTickFormat("s"),
    // why not working?
    vg.xDomain(vg.Fixed),
    vg.xScale("utc"),
    vg.xLabel("date"),
    vg.yLabel("count"),
    vg.width(600),
    vg.height(150)
  ),
  vg.plot(
    vg.rectY(vg.from("logs", { filterBy: $filter }), {
      x: vg.bin("bytes"),
      y: vg.sum("count"),
      fill: "steelblue",
      inset: 0.5,
    }),
    vg.intervalX({ as: $filter }),
    vg.xDomain(vg.Fixed),
    vg.yTickFormat("s"),
    vg.xLabel("bytes"),
    vg.yLabel("count"),
    vg.width(600),
    vg.height(150)
  ),
  vg.plot(
    vg.barX(vg.from("logs", { filterBy: $filter }), {
      x: vg.count(),
      y: "response",
      fill: "steelblue",
    }),
    vg.toggleY({ as: $filter }),
    vg.toggleY({ as: $highlight }),
    vg.highlight({ by: $highlight }),
    vg.marginLeft(50)
  ),
  vg.plot(
    vg.barX(vg.from("logs", { filterBy: $filter }), {
      x: vg.count(),
      y: "url",
      fill: "steelblue",
      sort: { y: "-x", limit: 10 },
    }),
    vg.toggleY({ as: $filter }),
    vg.toggleY({ as: $highlight }),
    vg.highlight({ by: $highlight }),
    vg.marginLeft(220)
  )
);
```
