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
	for (var i = window.Serviz.Graffle.connections.length; i--;) {
		window.Serviz.Graffle.paper.connection(window.Serviz.Graffle.connections[i]);
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
	
	window.Serviz.Graffle.paper.safari();
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
	
	var box = window.Serviz.Graffle.paper.rect(x, y, width, height,10);
		
	box.methods = [];
	box.addMethod = function(methodName, staticInfo) {
		if (this.methods[methodName]) return this.methods[methodName];
		
		var length = Object.keys(this.methods).length;
		
		var x = this.attr("x")+10;
		var y = this.attr("y") + this.attr("height") + (length)*20 + 5;
		
		this.methods[methodName] = window.Serviz.Graffle.paper.boxWithText(x,y,this.attr("width")-20,20,methodName);
		
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
	
	var text = window.Serviz.Graffle.paper.text(x + width/2,y + height/2, text).attr({ fill: 'white'});;
	
	var newWidth = text.getBBox().width+10;
	
	if (box.attr("width") > newWidth) newWidth = box.attr("width");
	
	box.attr({width: newWidth});
	
	var realWidth = box.attr("width");
	
	text.attr({x:x+realWidth/2});
	
	box.text = text;
	
	return box;
}