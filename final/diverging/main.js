var data;
var barHeight = 20, barWidth = 380, centerOffset = 70;

var distrustScale = d3.scaleLinear().domain([0, 1600]).range([0, -barWidth]);
var trustScale = d3.scaleLinear().domain([0, 1600]).range([0, barWidth]);

/* Data handling */
function initializeData(csv) {
  data = csv.map(function(d) {
    return {
      //year: +d.year,
      brand: d.brand,
      trust_count: +d.trust_count,
      distrust_count: +d.distrust_count,
      trust_perc: +d.trust_perc,
      distrust_perc: +d.distrust_perc
    }
  });

  data = data.filter(function(d) {
    return d.brand;
  });
  data.sort(function(a, b){
    return a.trust_count - b.trust_count;
  })
}


function initializeAxes() {
  let tickSize = 310;

  var axis = d3.axisBottom()
    .scale(trustScale)
    .tickSize(tickSize)
    .tickFormat(function(d) {
      return d;
    });

  d3.select(".trust.axis")
    .call(axis);

  axis.scale(distrustScale);
  d3.select(".distrust.axis")
    .call(axis);
}

/* D3 code */
function initBarGroup(d) {
  d3.select(this)
    .append("rect")
    .attr("transform", "translate(-" + centerOffset + ",0)")
    .attr("height", barHeight - 1)
    .classed("distrust", true)
    .style("fill", "#F15F36");

  d3.select(this)
    .append("text")
    .attr("class", "distrust-label")
    .attr("transform", "translate(-" + centerOffset + ",0)")
    .attr("y", barHeight / 2)
    .attr("text-anchor", "end")
    .attr("dy", ".35em")
    .text(function(d) { return d.distrust_count });

  d3.select(this)
    .append("rect")
    .attr("transform", "translate(" + centerOffset + ",0)")
    .attr("height", barHeight - 1)
    .classed("trust", true)
    .style("fill", "#41b6c4");

  d3.select(this)
    .append("text")
    .attr("class", "trust-label")
    .attr("transform", "translate(" + centerOffset + ",0)")
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d.trust_count });

  d3.select(this)
    .append("text")
    .attr("y", 14)
    .classed("brand label", true)
    .text(function(d) {
      return d.brand
    });
}

function updateBarGroup(d) {
  d3.select(this)
    .select(".distrust")
    .attr("x", distrustScale(d.distrust_count))
    .attr("width", -distrustScale(d.distrust_count));

  d3.select(this)
    .select(".distrust-label")
    .attr("x", distrustScale(d.distrust_count));

  d3.select(this)
    .select(".trust")
    .attr("width", trustScale(d.trust_count));

  d3.select(this)
    .select(".trust-label")
    .attr("x", trustScale(d.trust_count));
}

function updateChart() {
  var u = d3.select(".bars")
    .selectAll("g.bar-group")
    .data(data);

  u.enter()
    .append("g")
    .classed("bar-group", true)
    .attr("transform", function(d, i) {
      return "translate(0," + i * barHeight + ")";
    })
    .each(initBarGroup)
    .merge(u)
    .each(updateBarGroup);

  u.exit()
    .remove();
}

d3.csv("data/diverge-brands.csv", function(err, csv) {
  initializeData(csv);
  updateChart();
  initializeAxes();
});
