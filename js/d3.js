loadData();

d3.select("#school-type").on("change", updateVisualization)
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

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 450 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart-area")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = [" 0", "1.0", "2.0", "3.0", "4.0", "5.0", "6.0", "7.0", "8.0"]
var myVars = [" 0", "1.0", "2.0", "3.0", "4.0", "5.0", "6.0", "7.0", "8.0"]

// Build X scales and axis:
var x = d3.scaleBand()
  .range([0, width])
  .domain(myGroups)
  .padding(0.01);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// Build X scales and axis:
var y = d3.scaleBand()
  .range([height, 0])
  .domain(myVars)
  .padding(0.01);
svg.append("g")
  .call(d3.axisLeft(y));

// Build color scale
var myColor = d3.scaleLinear()
  .range(["#FFE8F4", "#78204C"])
  .domain([1,9]);

updateVisualization();

//Read the data
function loadData(){
  var schoolOption = document.getElementById("school-type").value;
  var selectionOption = document.getElementById("ranking-type").value;
  d3.json("data/datamatch2021-huiwen2.json", function(error, data){
    // console.log(data)
    var schoolFilter = data[schoolOption]
    console.log(schoolOption)
    var selectionFilter = schoolFilter[selectionOption]
    console.log(selectionOption)
    window._data = selectionFilter
});}

function updateVisualization() {
  loadData();
  var visual = svg.selectAll("rect");
  console.log(window.data)
  visual.data(window.data, function(d) {
        // console.log(d)
        return d.x+':'+d.y;
      })
      .enter()
      .append("rect")
      .merge(visual)
      .attr("x", function(d) {
        return x(d.x);
       })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.count)} );
    visual.exit().remove();
}