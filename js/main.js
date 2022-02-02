// load data
loadData();
d3.select("#ranking-type").on("change", updateVisualization)

var _data = [];
Object.defineProperty(window, 'data', {
  get: function() { return _data; },
  // data setter
  set: function(value) {
      _data = value;
      updateVisualization()
  }
});

// Define the SVG
var padding = 10;
var margin = {top: 30, right: 30, bottom: 30, left: 30};
var width = 800 - margin.right - margin.left,
    height = 700 - margin.top - margin. bottom;

// append SVG
var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var jsonSVG = d3.select("#chart-area2")
// .append("svg")
// .attr("width", width + margin.right + margin.left)
// .attr("height", height + margin.top + margin.bottom)
// .append("g")
// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Prepare data
function loadData(){
  // d3.json("data/datamatch2021-huiwen2.json", function(error, data){
  //   console.log(data);
  // });
  // read csv file
  d3.csv("data/sol_relationship_sat.csv", function(error, csv){
    csv.forEach(function(d){
      school = d.school;
      relationship_status = d.relationship_status;
      have_ever_relationship = d3.have_ever_relationship;
      life_satisfaction = +d.life_satisfaction;
      relationship_satisfaction = +d.relationship_satisfaction;
      self_desirability = +d.self_desirability;
      num_relationships = +d.num_relationships;
    });
  //read json file
  // d3.json()

  var schoolOption = document.getElementById("school-type").value;
  console.log(schoolOption);
  var schoolFilter = csv.filter(function(d){

    return d['school'] === schoolOption;
  })
  console.log(schoolFilter)
  data = csv;
  });
}


var addLabel = svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)");

// var jsonLabel = jsonSVG.append("text")
//   .attr("class", "y label")
//   .attr("text-anchor", "end")
//   .attr("y", 6)
//   .attr("dy", ".75em")
//   .attr("transform", "rotate(-90)");
    

// // let padding = 20;
// let xScale = d3.scaleLinear()
// .domain(d3.extent(window.data, function(d){
//   return d.life_satisfaction;
// }))
// .range([0, 800])


// axes
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale)
// note: need to enter the scale here when it's added later
svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(20, 400") 
  .call(xAxis);

// JSON
// jsonSVG.append("g")
//   .attr("class", "x-axis")
//   .attr("transform", "translate(20, 400") 
//   .call(xAxis);

svg.append("g")
  .attr("class", "y-axis")
  .attr("transform", "translate(50, 0)")
  .call(yAxis)

// JSON
// jsonSVG.append("g")
//   .attr("class", "y-axis")
//   .attr("transform", "translate(50, 0)")
//   .call(yAxis)

// update visualization
function updateVisualization(){
  loadData();
  var option = document.getElementById("ranking-type").value;

  console.log(option);
  
  var data = window.data;

  // handle change in filters (quantitative -y axis optiosn)
  data.sort(function(x,y) {
    if(option === "relationshipSatisfaction") {
      console.log("This is Relationship Satisfaction")
      return d3.descending(x.relationship_satisfaction, y.relationship_satisfaction)
    } else {
      return d3.descending(x.self_desirability, y.self_desirability)
    }
  });
  console.log(data);

  // create 
  var xScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d){
      return d.life_satisfaction;
    }))
    .range([padding, width-padding]);

  var yScale = d3.scaleLinear()
    .range([height - padding, padding]);

  yScale.domain([0, d3.max(data, function(d){
    if (option === "relationshipSatisfaction") {
      return d.relationship_satisfaction;
    } else {
      console.log(d.self_desirability)
      return d.self_desirability;
    }
  })]);

    // label
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height)
    .attr("transform", "translate(0, 30)")
    .text("Life Satisfaction");
  
  
  addLabel.text(function(d) {
    if (option === "relationshipSatisfaction"){
      return "Relationship Satisfaction"
    } else {
      return "Self-Desirability"
    }
  });

   
  // label Json svg
  // jsonSVG.append("text")
  //   .attr("class", "x label")
  //   .attr("text-anchor", "end")
  //   .attr("x", width)
  //   .attr("y", height)
  //   .attr("transform", "translate(0, 30)")
  //   .text("Life Satisfaction");

  // jsonLabel.text(function(d) {
  //   if (option === "relationshipSatisfaction"){
  //     return "Relationship Satisfaction"
  //   } else {
  //     return "Self-Desirability"
  //   }
  // });

  // Append circles
  var circles = svg.selectAll("circle");
  circles.data(data)
      .enter()
      .append("circle")
      .merge(circles)
      .attr("cx", function(d) {
        return xScale(d.life_satisfaction)
      })
      .attr("cy", function(d){
        if (option === "relationshipSatisfaction"){
          return yScale(d.relationship_satisfaction);
        } else {
          return yScale(d.self_desirability);
        }
      })
      .attr("r", 5)
      .attr("fill", "green");
  circles.exit().remove();


}

