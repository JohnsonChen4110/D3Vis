

var mapwidth = 800,
    mapheight = 420;

var projection = d3.geoAlbersUsa()
                    .translate([mapwidth/2,mapheight/2])
                    .scale(800)


var path = d3.geoPath()
	.projection(projection);

var mapsvg = d3.select("#map").append("svg")
    .attr("width", mapwidth)
    .attr("height", mapheight);

var dataset;
var arr = [];

var tip = d3.select("body").append("div")
  .attr('class', 'toolTip')
  .style("opacity",0)
  

// load up the json files, and when we're done, call ready
d3.queue()
    .defer(d3_request.json, "states.json")
    .defer(function(name,callback){
        d3.csv(name, function(error,data){
            data.forEach(function(d){
                d["Alcohol-Impaired"] = +d["Alcohol-Impaired"];
                d["CarInsurancePremiums"] = +d["CarInsurancePremiums"];
                d["InsuranceIncurredPerDriver"] = +d["InsuranceIncurredPerDriver"];
                d["NoPreviousAccidents"] = +d["NoPreviousAccidents"];
                d["NotDistracted"] = +d["NotDistracted"];
                d["Speeding"] = +d["Speeding"];
                d["fatalPerBillionMiles"] = +d["fatalPerBillionMiles"];
                d["Longtitude"] = +d["Longtitude"];
                d["Langtitude"] = +d["Langtitude"];
            })
            callback(error,data)
            dataset = data;

        })
    }, "bad-drivers1.csv")
    .await(ready);


// d3.queue()
//     .await(change);
// keep these around for later
var us,centroid;
var data;
var l;
var minf = 0, maxf = 1;


function ready(error, jsonData, dataset) {


            minf = d3.min(dataset,function(d){return d.fatalPerBillionMiles})
            maxf = d3.max(dataset,function(d){return d.fatalPerBillionMiles})
            mini = d3.min(dataset,function(d){return d.InsuranceIncurredPerDriver})
            maxi = d3.max(dataset,function(d){return d.InsuranceIncurredPerDriver})
            
            colormap = d3.scaleLinear()
                 .domain([minf,(minf+maxf)/2,maxf])
                 
                 .range(["green","white","red"])
            
            sizemap = d3.scalePow()
                .domain([mini,maxi])
                .exponent(1.5)
                .range([2,20])
            
        var c1 = d3.scaleOrdinal()
        .domain(["cw","ne","s","w"])
        .range(["#efedf5","#fee6ce","#deebf7","#e5f5e0"])


  // store the values so we can use them later
  states = jsonData
   
  var circle = mapsvg.selectAll(".symbol")
      		.data(dataset)

  // draw the states
  mapsvg.append("path")
      .attr("class", "states")
      .datum(topojson.feature(states, states.objects.usStates))
      .attr("d", path)
      .attr("fill",function(d){return c1(d.geotype)});


var legend1 = mapsvg.append("rect")
                    .attr("x",40)
                    .attr("y",310)
                    .attr("width",15)
                    .attr("height",15)
                    .attr("fill",colormap(minf))
                    .attr("stroke","#000")
var legend1 = mapsvg.append("rect")
                    .attr("x",40)
                    .attr("y",330)
                    .attr("width",15)
                    .attr("height",15)
                    .attr("fill",colormap(((minf+maxf)/2+minf)/2))
                    .attr("stroke","#000")                    
var legend1 = mapsvg.append("rect")
                    .attr("x",40)
                    .attr("y",350)
                    .attr("width",15)
                    .attr("height",15)
                    .attr("fill",colormap((minf+maxf)/2))
                    .attr("stroke","#000") 
var legend1 = mapsvg.append("rect")
                    .attr("x",40)
                    .attr("y",370)
                    .attr("width",15)
                    .attr("height",15)
                    .attr("fill",colormap(((minf+maxf)/2+maxf)/2))
                    .attr("stroke","#000")                   
var legend1 = mapsvg.append("rect")
                    .attr("x",40)
                    .attr("y",390)
                    .attr("width",15)
                    .attr("height",15)
                    .attr("fill",colormap(maxf))
                    .attr("stroke","#000")

var legend1 = mapsvg.append("text")
                    .attr("x",60)
                    .attr("y",322.5)
                    .text("5.9 (Minimun)")
                    .attr("font-size",10)
var legend1 = mapsvg.append("text")
                    .attr("x",60)
                    .attr("y",342.5)
                    .text("10.4")
                    .attr("font-size",10)
var legend1 = mapsvg.append("text")
                    .attr("x",60)
                    .attr("y",362.5)
                    .text("14.9 (Average)")
                    .attr("font-size",10)
var legend1 = mapsvg.append("text")
                    .attr("x",60)
                    .attr("y",382.5)
                    .text("19.4")
                    .attr("font-size",10)
var legend1 = mapsvg.append("text")
                    .attr("x",60)
                    .attr("y",402.5)
                    .text("23.9 (Maximun)")
                    .attr("font-size",10)
var legend1 = mapsvg.append("text")
                    .attr("x",20)
                    .attr("y",295)
                    .text("Number of Fatal Collisions/per billion miles")
                    .attr("font-size",10)




  circle.exit().remove();

  // draw the symbols on top
  circle
            .enter().append("circle",".symbol")
      		.attr("class", function(d){return 'symbol map-' + d.State.replace('/ /g', '-')})
      		.attr("fill",function(d){return colormap(d.fatalPerBillionMiles)})
            .on("mouseover",function(d){
                d3.select(this)
                .attr("fill","black")
                tip
                .style("opacity",0.9)
                .html("["+d.State+"]"+ "<br>"+"Number of fatals Per Billion Miles: " + d.fatalPerBillionMiles
                                    +"<br>"+ "Insurance Incurred Per Driver: $" + d.InsuranceIncurredPerDriver)
                .style("left", (d3.event.pageX -50) + "px")
                .style("top", (d3.event.pageY - 70) + "px");

            })
            .on("mouseout",function(){
                d3.select(this).attr("fill",function(d){return colormap(d.fatalPerBillionMiles)})
                tip
                .style("opacity",0)
                
                
            })
            .on('click', function(d){
                curSelect = d3.selectAll('.bar-' + d.State.replace('/ /g', '-'));
                ifSelect = curSelect.classed('selectedName') == false;
                d3.selectAll('.name').classed('selectedName', false);
                curSelect.classed('selectedName', ifSelect);

            })
      		.attr("r", function(d){return sizemap(d.InsuranceIncurredPerDriver)})
            .attr("transform", function(d){return "translate(" + projection([d.Longtitude,d.Langtitude]) + ")";})
            // .append("svg:title")
            //     .text(function(d){return d.State + "\nNumber of fatals Per Billion Miles: " + d.fatalPerBillionMiles
            //                         + "\nInsurance Incurred Per Driver: " + d.InsuranceIncurredPerDriver});   

}




