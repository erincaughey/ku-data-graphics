(function () {
var formatLabel = function(d) { return d3.format('.0f')(d); };

var margin = { top: 50, right: 10, bottom: 10, left: 65 },
    width = 600 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var graphicTwo = d3.select('#ss-graphic')
    .style('width', width + 'px');

var x = function(d) { return d.count; },
    xScale = d3.scaleLinear().domain([0, 420]),
    xValue = function(d) { return xScale(x(d)); };

var y = function(d) { return d.age; },
    yScale = d3.scaleBand().range([height, 0]).padding(0.1),
    yValue = function(d) { return yScale(y(d)); },
    yAxis = d3.axisLeft(yScale);

var columnNames = ["Strongly disagree", "Disagree", "Tend to disagree", "Neither agree nor disagree", "Tend to agree", "Agree", "Strongly agree"];

var column = function(d) { return d.agreement; },
    columnScale = d3.scaleBand().range([0, width]).paddingInner(0.075).domain(columnNames),
    columnValue = function(d) { return columnScale(column(d)); };

var colorRange = d3.schemeYlGnBu[columnScale.domain().length + 2];

var color = column,
    colorScale = d3.scaleOrdinal().range(colorRange)
    colorValue = function(d) { return colorScale(color(d)); };


function row(d) {
    return {
        agreement: d.agreement,
        age: d.age,
        count: +d.count
    };
}

function renderChart(id, dataFlat) {
    var svg = graphicTwo.select('svg.chart--' + id)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var data = d3.nest()
        .key(function(d) { return d.agreement; })
        .entries(dataFlat)
        .map(function(d) { return { agreement: d.key, values: d.values }; });

    yScale.domain(dataFlat.map(y).reverse());
    xScale.range([0, columnScale.bandwidth()]);


    // Excluding the light colors from the color scheme
    colorScale
        .domain(dataFlat.map(color));

    svg.append('g').attr('class', 'axis axis--y')
        .call(yAxis);

    var gColumn = svg.append('g').attr('class', 'columns')
            .selectAll('.column').data(data)
        .enter().append('g')
            .attr('class', 'column')
            .attr('transform', function(d) { return 'translate(' + columnValue(d) + ',0)'; });

    gColumn.append('text').attr('class', 'title')
        .attr('dy', '-0.34em')
        .attr('y', '-2.1em')
        .text(column)
        .call(wrap, columnScale.bandwidth());
    
    var bars = gColumn.append('g').attr('class', 'bars');

    bars.selectAll('.bar--underlying').data(function(d) { return d.values; })
        .enter().append('rect')
            .attr('class', 'bar bar--underlying')
            .attr('x', 0)
            .attr('y', function(d) { return yScale(y(d)); })
            .attr('width', xScale.range()[1])
            .attr('height', yScale.bandwidth());

    bars.selectAll('.bar--overlying').data(function(d) { return d.values; })
        .enter().append('rect')
            .attr('class', 'bar bar--overlying')
            .attr('x', 0)
            .attr('y', function(d) { return yScale(y(d)); })
            .attr('width', function(d) { return xScale(x(d)); })
            .attr('height', yScale.bandwidth())
            .style('fill', colorValue);

    function positionLabel(d) {
        var xValue = xScale(x(d));
        var xMax = xScale.range()[1];
        if (xValue < (0.35 * xMax)) {
            d3.select(this)
                .classed('label--white', false)
                .attr('x', xValue)
                .attr('dx', 12);
        } else {
            d3.select(this)
                .classed('label--white', true)
                .attr('x', 0)
                .attr('dx', 12);
        }
        d3.select(this)
            .attr('y', yScale(y(d)) + (yScale.bandwidth() / 2))
            .attr('dy', '0.33em');
    }

    gColumn.append('g').attr('class', 'labels')
            .selectAll('.label').data(function(d) { return d.values; })
        .enter().append('text') 
            .attr('class', 'label')
            .text(function(d) { return formatLabel(x(d)); })
            .each(positionLabel);
}

d3.csv('data/age-searchtrust-split.csv', row, function(error, dataFlat) {
    if (error) throw error;    
    renderChart('search', dataFlat);
});

d3.csv('data/age-socialtrust-split.csv', row, function(error, dataFlat) {
    if (error) throw error;    
    renderChart('social', dataFlat);
});

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
})();