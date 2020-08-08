var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top:50,
    right:50,
    bottom:50,
    left: 50
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

d3.csv("assets/data/data.csv", function(err, censusRecord){
  if(err) throw err;
      censusRecord.forEach(function(record){
          record.income = +record.income;
          record.smokes = +record.smokes;
      });

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusRecord, d=>d["income"]-1),
      d3.max(censusRecord,d=>d["income"])])
      .range([0,chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusRecord, d=>d["smokes"]-1),
      d3.max(censusRecord, d=>d["smokes"])])
      .range([chartHeight,0]);
    
      var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xLinearScale));
    
      chartGroup.append("g")
      .call(d3.axisLeft(yLinearScale));

    var state =  chartGroup.selectAll("g.dot")
      .data(censusRecord)
      .enter()
      .append('g');

      state.append("circle")
      .attr("cx", d => xLinearScale(d["income"]))
      .attr("cy", d => yLinearScale(d["smokes"]))
      .attr("r", 12)
      .attr("fill", "green")
      .attr("opacity", ".3");

      state.append("text").text(d=>d.abbr)
      .attr("x", d => xLinearScale(d.income)-4)
      .attr("y", d => yLinearScale(d.smokes)+2)
      .style("font-size",".4em")
      .classed("fill-text", true);

    var Chartlabels = chartGroup.append("g")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var Data = Chartlabels.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "income") 
      .classed("active", true)
      .text("Income ($)");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .classed("active", true)
      .text("Smoking (%)");
});