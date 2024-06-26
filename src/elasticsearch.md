---
theme: dashboard
toc: false
---

# Elasticsearch

```js
const dslData = FileAttachment("./data/es_query_kibana_sample_data_logs.arrow").arrow();
```

```js
display(dslData)
```

```js
const esqlData = FileAttachment("./data/es_esql.arrow").arrow();
```

```js
const esPlot = ({data,x,y,stroke,width}) => Plot.plot({
  grid:true,
  width,
  x: {
    type: "utc" // treat x-values as dates, not numbers
  },
  marks: [
    Plot.ruleY([0]),
    Plot.line(data, {x, y, stroke, r:.2, tip: true})
  ],
  // color: { legend: true},
})
```

```html
<div class="grid grid-cols-1">
  <div class="card">${resize((width) => esPlot({data:dslData,x:"key",y:"doc_count",width}))}</div>
</div>

<!--
<div class="grid grid-cols-1">
  <div class="card">${resize((width) => esPlot({data:esqlData,x:"date",y:"bytes",stroke:"url",width}))}</div>
</div>
//-->
```
