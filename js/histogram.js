(function() {
	if (!("Serviz" in window)) {
        return;
    }
					  
    window.Serviz.loadHistogram = function(timeStart, timeEnd) {
    	$("#slider svg").remove();
    	
    	var margin = {top: 20, right: 80, bottom: 30, left: 50},
	    width = 560 - margin.left - margin.right,
    	height = 200 - margin.top - margin.bottom;

		var parseDate = d3.time.format("%a, %d %b %Y %X GMT").parse;
		
		var x = d3.time.scale()
		    .range([0, width]);
		
		var y = d3.scale.linear()
		    .range([height, 0]);
		
		var color = d3.scale.category10();
		
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");
		
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left").ticks(4);
		    
		
		
		var line = d3.svg.line()
		    .interpolate("basis")
		    .x(function(d) { return x(d.timestamp); })
		    .y(function(d) { return y(d.count); });
		
		// var svg = d3.select("#slider").append("svg")
		    // .attr("width", width + margin.left + margin.right)
		    // .attr("height", height + margin.top + margin.bottom)
		  // .append("g")
		    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var doneServices = [];
		
		for (var service in window.Serviz.availableServices) {
		    
		
			service = service.slice(0,-6);
			
			if (doneServices.indexOf(service) != -1) continue;
			
			doneServices.push(service);
			
			d3.csv(window.location.origin+"/logdump/logdump?timestart="+timeStart.getTime()+"&timeend="+timeEnd.getTime()+"&graph=true&services="+service, function(error, data) {
			  var svg = d3.select("#slider")
			    .append("svg:svg")
			    .attr("width", "100%")
			    .attr("height", "300px")
			    .attr("viewBox", "180 -30 140 240");
			    
			  data.forEach(function(d) {
			    //d.timestamp = parseDate(new Date(d.timestamp));
			    d.timestamp = parseDate(new Date(parseInt(d.timestamp)).toUTCString());
			    //d.price = +d.price;
			  });
			
			  var dataInverted = [];
			  var keys = [];
			  
			  data.forEach(function(element, index, array) {
			  	var exists = false;
			  	for (var i = 0; i < dataInverted.length; i++) {
				    if (dataInverted[i].name == element.service) {
				    	exists = true;
				    	dataInverted[i].values.push({timestamp:element.timestamp,count:element.count});
				    	break;
				    }
				}
				
				if (!exists) {
					keys.push(element.service);
					dataInverted.push({name:element.service, values:[{timestamp:element.timestamp,count:element.count}]});
				}
			  });
			  
			  
			  color.domain(keys);
			  
			  x.domain(d3.extent(data, function(d) { return d.timestamp; }));
			
			  y.domain([
			    0,
			    d3.max(dataInverted, function(c) { return d3.max(c.values, function(v) { return v.count; }); })
			  ]);
			
			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis);
			
			  svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)
			    .append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", ".71em")
			      .style("text-anchor", "end")
			      .text("Number of calls");
			
			  var city = svg.selectAll(".city")
			      .data(dataInverted)
			    .enter().append("g")
			      .attr("class", "city");
			
			  city.append("path")
			      .attr("class", "line")
			      .attr("d", function(d) { return line(d.values); })
			      .style("stroke", function(d) { return color(d.name); });
				
			// var area = d3.svg.area()
			    // .x(function(d) { return x(d.timestamp); })
			    // .y1(function(d) { return line(d.values); });
			//     
			  // svg.append("path")
			      // .datum(dataInverted)
			      // .attr("class", "area")
			      // .attr("d", area);
			  // city.append("text")
			      // .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
			      // .attr("transform", function(d) { return "translate(" + x(d.value.timestamp) + "," + y(d.value.count) + ")"; })
			      // .attr("x", 3)
			      // .attr("dy", ".35em")
			      // .text(function(d) { return d.name; });
			      
			  var legend = svg.selectAll(".legend")
			      .data(color.domain().slice().reverse())
			    .enter().append("g")
			      .attr("class", "legend")
			      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
			
			  legend.append("rect")
			      .attr("x", width - 18)
			      .attr("width", 18)
			      .attr("height", 18)
			      .style("fill", color);
			
			  legend.append("text")
			      .attr("x", width - 24)
			      .attr("y", 9)
			      .attr("dy", ".35em")
			      .style("text-anchor", "end")
			      .text(function(d) { return d; });
			});

    	}
	};
})();
