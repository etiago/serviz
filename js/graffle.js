Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);

    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3,"arrow-end": "classic"}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};
//
//
//Raphael.fn.boxWithText = function(x, y, width, height, text) {
//	//var group = this.set();
//	 //   group.push(this.text(x, y, "Hello"));
//
//    //group.push(this.rect(x, y, width, height));
//	var rect = this.rect(x, y, width, height)
//	
//	rect.elements = [this.rect(x, y, width, height),
//					this.text(x, y, "Hello")]
//	
//	rect.type = "boxWithText"
//	
//	return rect;
//}
//
//Raphael.fn.boxWithText.type = function() {
//	return "boxWithText";	
//}
//
//var el;
//window.onload = function () {
//    var dragger = function () {
//		alert(this.type)
//        this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
//        this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
//        this.animate({"fill-opacity": .2}, 500);
//    },
//        move = function (dx, dy) {
//			//alert(this.type)
//            var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
//            this.attr(att);
//            for (var i = connections.length; i--;) {
//                r.connection(connections[i]);
//            }
//            r.safari();
//        },
//		groupMove = function(dx, dy) {
//			for(var i = this.elements.length; i--;) {
//				alert(this.elements)
//				var att = this.elements[i].type == "rect" ? {x: this.elements[i].ox + dx, y: this.elements[i].oy + dy} : {cx: this.elements[i].ox + dx, cy: this.elements[i].oy + dy};
//				elements[i].attr(att);
//				for (var i = connections.length; i--;) {
//					r.connection(connections[i]);
//				}
//				r.safari();
//			}
//		},
//        up = function () {
//            this.animate({"fill-opacity": 0}, 500);
//        },
//        r = Raphael("holder", 640, 480),
//        connections = [],
//        shapes = [  r.ellipse(190, 100, 30, 20),
//                    r.boxWithText(290, 80, 60, 40, 10),
//                    r.rect(290, 180, 60, 40, 2),
//                    r.ellipse(450, 100, 20, 20)
//                ];
//    for (var i = 0, ii = shapes.length; i < ii; i++) {
//        var color = Raphael.getColor();
//        
//		if (shapes[i].type == "boxWithText") {
//			shapes[i].elements[0].drag(groupMove, dragger, up);
//			shapes[i].elements[0].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
//		} else {
//			shapes[i].drag(move, dragger, up);
//			shapes[i].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
//		}
//        
//    }
//    connections.push(r.connection(shapes[0], shapes[1], "#fff"));
//    connections.push(r.connection(shapes[1], shapes[2], "#fff", "#fff|5"));
//    connections.push(r.connection(shapes[1], shapes[3], "#000", "#fff"));
//};
connections = [];

onstart = function (obj) {
	if (obj==null || obj.type != 'rect' ) obj = this;
	
	obj.xBox = obj.attr("x");
	obj.yBox = obj.attr("y");
	
	obj.xText = obj.text.attr("x");
	obj.yText = obj.text.attr("y");
	
	obj.animate({"fill-opacity": .8}, 500);
};

gMove = function (dx,dy,obj) {
	if (obj==null || obj.type != 'rect' ) obj = this;
	//alert("a");
	//this.x = this.ox + dx;
	//this.y = this.oy + dy;
	obj.attr({x: obj.xBox + dx, y: obj.yBox + dy});
	
	obj.text.attr({x: obj.xText + dx, y: obj.yText + dy});
	for (var i = connections.length; i--;) {
		paper.connection(connections[i]);
	}			
	
	var i = 0;
	for(var p in obj.methods) {
		var x = obj.xBox +10+ dx;
		var y = obj.yBox + obj.attr("height") + i*20 + 5 + dy;
		obj.methods[p].attr({x:x, y:y});
		
		var centerX = ((obj.methods[p].attr("width") - obj.methods[p].text.attr("width")) / 2)+x;
		var centerY = ((obj.methods[p].attr("height") - obj.methods[p].text.attr("height")) / 2)+y;
		obj.methods[p].text.attr({x:centerX, y:centerY});	
		i++;
	}
	
	paper.safari();
}

onmove = function (dx, dy) {
	gMove(dx,dy,this);
};

onend = function (obj) {
	if (obj==null || obj.type != 'rect' ) obj = this;

	obj.animate({"fill-opacity": 100}, 500);
};

// Prototype to create a boxWithText	
Raphael.fn.boxWithText = function(x, y, width, height, text) {
	
	var box = paper.rect(x, y, width, height,10);
		
	box.methods = [];
	box.addMethod = function(methodName, staticInfo) {
		if (this.methods[methodName]) return this.methods[methodName];
		
		var length = Object.keys(this.methods).length;
		
		var x = this.attr("x")+10;
		var y = this.attr("y") + this.attr("height") + (length)*20 + 5;
		
		this.methods[methodName] = paper.boxWithText(x,y,this.attr("width")-20,20,methodName);
		
		var color;
		if (staticInfo) {
			color = "#8CDBED";
			staticElements[methodName] = this.methods[methodName];
		} else {
			color = "#8CED8C";
		}
		
		this.methods[methodName].attr({fill:Raphael.getRGB(color)});
		
		return this.methods[methodName];
		// only works if directly dragged
		//this.methods[methodName].drag(onmove,onstart,onend);
		
	}
	
	box.move = function(dx,dy) {
		onstart(this);
		gMove(dx,dy,this);
		onend(this);
	}
	
	var text = paper.text(x + width/2,y + height/2, text);
	
	var newWidth = text.getBBox().width+10;
	
	if (box.attr("width") > newWidth) newWidth = box.attr("width");
	
	box.attr({width: newWidth});
	
	var realWidth = box.attr("width");
	
	text.attr({x:x+realWidth/2});
	
	box.text = text;
	
	return box;
	//box.toFront();
	
	//box.text.attr({cursor:"move"});
	//box.drag = function(onmove, onstart, onend) {
	//	this.box.drag(onmove, onstart, onend);
	//}	
}



function loadRaphael () {
	    
		
		paper = Raphael("holder", 1024, 768);		
// 		
// 		 
		// });
		
    	
		////var rect = r.rect(posX, posY, width, height, 2);
//		var rect = paper.boxWithText(posX, posY, width, height, "hello");
//		var rect2 = paper.boxWithText(posX+100, posY, width, height, "world");
//
//		//rect.children = [];
//		//rect.children[0] = r.text(posX + width/2,posY + height/2, "hello");
//		
//		var color = Raphael.getColor();
//		
//		rect.drag(onmove, onstart, onend);
//		rect.attr({fill: color, stroke: color, "fill-opacity": 100, "stroke-width": 2, cursor: "move"});
//		
//		rect2.drag(onmove, onstart, onend);
//		rect2.attr({fill: color, stroke: color, "fill-opacity": 100, "stroke-width": 2, cursor: "move"});
//		
//		connections.push(paper.connection(rect, rect2, "#fff", "#fff|2"));
}

var elements;
var staticElements;

function reloadGraph(dateStart, dateEnd) {
		var paperDom = paper.canvas;
    	paperDom.parentNode.removeChild(paperDom);
		paper = Raphael("holder", 1024, 768);		

		var posX = 290;
		var posY = 180;
		var width = 60;
		var height = 40;
		var url = window.location.origin+'/logdump/logdump?timestart='+dateStart.getTime()+'&timeend='+dateEnd.getTime();
		
		$.getJSON(url, function(doc) {
		  
		  elements = new Object();
		  staticElements = new Object();
		  
		  $.each(doc.data, function(key, pair) {
			  //var ratio = pair.CNT / doc.stats.totalCalls
			  //var red = (ratio * 255).toString(16).substr(0,2)
			  //var green = ((1-ratio) * 255).toString(16).substr(0,2)
			  var color = Raphael.getRGB("#098009");
			  
			  //alert(pair.CONSUMER+"=>"+pair.SERVICE);
			  
			  var consumer;
			  if (pair.CONSUMER in elements) {
			  	consumer = elements[pair.CONSUMER];
			  } else {
				  consumer = paper.boxWithText(posX, posY, width, height, pair.CONSUMER+"\nInvoked #"+pair.CNT+" times");
				  //consumer.move(100,100);
				  consumer.drag(onmove, onstart, onend);
				  consumer.attr({fill: color, "fill-opacity": 100, "stroke-width": 2, cursor: "move"});
				  
				  elements[pair.CONSUMER] = consumer;
			  }
			  
			  var consMeth = consumer.addMethod(pair.CONSUMER_METHOD);
			  
			  var service;
			  if (pair.SERVICE in elements) {
				service = elements[pair.SERVICE];  
			  } else {
				  service = paper.boxWithText(posX+150, posY, width, height, pair.SERVICE+"\nInvoked #"+pair.CNT+" times");
				  //service.move(100,100);

				  service.drag(onmove, onstart, onend);
				  service.attr({fill: color, "fill-opacity": 100, "stroke-width": 2, cursor: "move"});
				  
				  elements[pair.SERVICE] = service;
			  }
			  var servMeth = service.addMethod(pair.SERVICE_METHOD);
			  
			  var thickness = pair.CNT/doc.stats.totalCalls * 10;
			  connections.push(paper.connection(consMeth, servMeth, "#fff", "#fff|"+thickness));
		  });
	});
	
	$("#holder").qtip("destroy");
}
