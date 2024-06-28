---
sql:
  logs: ./data/es_esql.arrow
---

# Elasticsearch + Apache Arrow

Native support for Apache Arrow as a response format for Elasticsearch is currently under development here: https://github.com/elastic/elasticsearch/pull/109873

In the meantime, we can work around it using data loaders that convert the ES response to Apache Arrow.

```js echo
const logs = FileAttachment("./data/es_esql.arrow").arrow();
```

```js echo
Inputs.table(logs)
```

This example is not really about "big data" but good enough to demonstrate the potential. The full index in Elasticsearch is about 6.9 Mbyte. The arrow file with just the data we need brings that down to 148 Kbyte. You can think of the ES|QL query as a kind of rollup that gets us all the data we need on the client at a certain granularity. But as you will see, using that trimmed down data will still enable us to create some exploratory, interactive visualizations.

```sql id=logsByDay echo
SELECT date, COUNT(*) as count FROM logs GROUP BY date ORDER BY date
```

```js echo
Inputs.table(logsByDay)
```

```js echo
Plot.plot({
  x: { type: 'utc' },
  y: { grid: true },
  marks: [
    Plot.ruleY([0]),
    Plot.line(
      logsByDay,
      {x: "date", y: "count", tip: true}
    )
  ]
})
```

Now let's get interactive!

```js
const $click = vg.Selection.single();
const $colors = vg.Param.array(["#e7ba52", "#a7a7a7", "#aec7e8", "#1f77b4", "#9467bd"]);
const $range = vg.Selection.intersect();
```

```js
vg.vconcat(
  vg.hconcat(
    vg.plot(
      vg.dot(
        vg.from("logs", {filterBy: $click}),
        {
          x: "date",
          y: "count",
          fill: "response",
          r: "bytes",
          fillOpacity: 0.7
        }
      ),
      vg.intervalX({as: $range, brush: {fill: "none", stroke: "#888"}}),
      vg.highlight({by: $range, fill: "#ccc", fillOpacity: 0.2}),
      vg.colorLegend({as: $click, columns: 1}),
      vg.xyDomain(vg.Fixed),
      vg.xScale("utc"),
      vg.xTickFormat("%b"),
      vg.colorDomain(vg.Fixed),
      vg.colorRange($colors),
      vg.rDomain(vg.Fixed),
      vg.rRange([2, 6]),
      vg.marginLeft(45),
      vg.width(660),
      vg.height(300)
    )
  ),
  vg.plot(
    vg.barX(
      vg.from("logs"),
      {x: vg.count(), y: "response", fill: "#ccc", fillOpacity: 0.2}
    ),
    vg.barX(
      vg.from("logs", {filterBy: $range}),
      {x: vg.count(), y: "response", fill: "response"}
    ),
    vg.toggleY({as: $click}),
    vg.highlight({by: $click}),
    vg.xDomain(vg.Fixed),
    vg.yDomain(vg.Fixed),
    vg.yLabel(null),
    vg.colorDomain(vg.Fixed),
    vg.colorRange($colors),
    vg.marginLeft(45),
    vg.width(660)
  )
)
```
