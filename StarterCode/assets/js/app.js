var svgWidth = 1000;
var svgHeight = 800;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
        d3.max(censusData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
};

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  };

// function used for updating circles group with a transition to new circles
function renderXCircles(circlesXGroup, newXScale, chosenXAxis, ) {

  circlesXGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    

  return circlesXGroup;
};

// function renderXCircles(elemXEnter, newXScale, chosenXAxis) {

//     elemXEnter.selectAll("circle")
//       .transition()
//       .duration(1000)
//       .attr("cx", d => newXScale(d[chosenXAxis]));
//     elemXEnter.selectAll("text")
//       .transition()
//       .duration(1000)
//       .attr("x", d => newXScale(d[chosenXAxis]));
  
//     return elemXEnter;
//   }

// function used for updating circles group with a transition to new circles
function renderYCircles(circlesYGroup, newYScale, chosenYAxis) {

    circlesYGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesYGroup;
  };

// function renderYCircles(elemYEnter, newYScale, chosenYAxis) {

//     elemYEnter.selectAll("circle")
//       .transition()
//       .duration(1000)
//       .attr("cx", d => newYScale(d[chosenYAxis]));
//     elemYEnter.selectAll("text")
//       .transition()
//       .duration(1000)
//       .attr("x", d => newXScale(d[chosenYAxis]));
  
//     return elemYEnter;
//   }

// function used for updating circles group with new tooltip
function updateXToolTip(chosenXAxis, chosenYAxis, circlesXGroup) {

  if (chosenXAxis === "poverty") {
    var xLabel = "In Poverty (%):";
  }
  else if (chosenXAxis === "smokes"){
    var xLabel = "Age (Median)";
  } else {
      var xLabel = "Household Income (Median):"
  }

  if (chosenYAxis === "obesity") {
    var yLabel = "Obesity (%)";
  }
  else if (chosenYAxis === "smokes"){
    var yLabel = "Smokes (%)";
  } else {
      var yLabel = "Lacks Healthcare (%)"
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`State ${d.state}<br>${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}`);
    });

  svg.call(toolTip);

  // Assign hover events
  circlesXGroup
  .classed("active inactive", true)
  .on('mouseover', toolTip.show)
  .on('mouseout', toolTip.hide);

  return circlesXGroup;

}

// function used for updating circles group with new tooltip
function updateYToolTip(chosenXAxis, chosenYAxis, circlesYGroup) {

  if (chosenXAxis === "poverty") {
    var xLabel = "In Poverty (%)";
  }
  else if (chosenXAxis === "smokes"){
    var xLabel = "Age (Median)";
  } else {
      var xLabel = "Household Income (Median):"
  }

  if (chosenYAxis === "obesity") {
    var yLabel = "Obesity (%)";
  }
  else if (chosenYAxis === "smokes"){
    var yLabel = "Smokes (%)";
  } else {
      var yLabel = "Lacks Healthcare (%)"
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
      return (`State: ${d.state}<br>${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}`);
    });

  svg.call(toolTip);

  // Assign hover events
  circlesYGroup
  .classed("active inactive", true)
  .on('mouseover', toolTip.show)
  .on('mouseout', toolTip.hide);

  return circlesYGroup;

}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData, err) {

    console.log(censusData);

    if (err) throw err;


  // parse data
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
  });

//   var elemXEnter = renderXCircles(elemXEnter, xLinearScale, chosenXAxis);
//   var elemYEnter = renderYCircles(elemYEnter, yLinearScale, chosenYAxis);

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesXGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("style", "fill: #89bdd3")
    .attr("opacity", ".5");
    // .append("text")
    // .attr("x", d => xLinearScale(d[chosenXAxis]))
    // .attr("y", d => yLinearScale(d[chosenYAxis]))
    // .attr("color", "black")
    // .text(function(d) { return d.abbr; });


  var circlesYGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("style", "fill: #89bdd3")
    .attr("opacity", ".5");
    // .append("text")
    // .attr("x", d => xLinearScale(d[chosenXAxis]))
    // .attr("y", d => yLinearScale(d[chosenYAxis]))
    // .attr("color", "black")
    // .text(function(d) { return d.abbr; });

  // Create group for  3 x- axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("xValue", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("xValue", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");

  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("xValue", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axis
  // Create group for  3 y- axis labels
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    .attr("dy", "1em")
    .classed("axis-text", true);

  var obesityLabel = yLabelsGroup
    .append("text")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - (height / 2))
    .attr("yValue", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obesity (%)");

  var smokesLabel = yLabelsGroup
    .append("text")
    .attr("y", 0 - margin.left + 25)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("yValue", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  var healthcareLabel = yLabelsGroup
    .append("text")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - (height / 2))
    .attr("yValue", "healthcareLow")
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesXGroup = updateXToolTip(chosenXAxis, chosenYAxis, circlesXGroup);
  var circlesYGroup = updateYToolTip(chosenXAxis, chosenYAxis, circlesYGroup);
  

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xValue = d3.select(this).attr("xValue");
      if (xValue !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = xValue;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesXGroup = renderXCircles(circlesXGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesXGroup = updateXToolTip(chosenXAxis, chosenYAxis, circlesXGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if (chosenXAxis === "age"){
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if (chosenXAxis === "income") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    })

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
    var yValue = d3.select(this).attr("yValue");
      if (yValue !== chosenYAxis) {

        // replaces chosenYaxis with value
        chosenYAxis = yValue;

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxis(yLinearScale, yAxis);

        // updates circles with new y values
        circlesYGroup = renderYCircles(circlesYGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesYGroup = updateYToolTip(chosenXAxis, chosenYAxis, circlesYGroup);

        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if (chosenYAxis === "smokes"){
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if (chosenYAxis === "healthcare"){
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    })

});
