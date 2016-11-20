function SVGGraph(nodes, edges){
		this.width = $("body").width();
		this.height = $("body").height();
		this.init(nodes, edges);
}

SVGGraph.prototype.init = function(nodes, edges) {

	edges.forEach(function (edge) {
		for(let i = 0, len = nodes.length; i < len; i++){
			if(nodes[i].name == edge.source){
				edge.source = nodes[i];
			} 
			if(nodes[i].name == edge.target){
				edge.target = nodes[i];
			}
		}
	});

	this.nodes_data = nodes;
	this.edges_data = edges;

	let force = d3.layout.force()
								.nodes(this.nodes_data)
								.links(this.edges_data)
								.size([this.width, this.height])
								.linkDistance(function (data) {
									return data.dist * 25;
								})
								.friction(0.8)
								.charge(-3000);
	force.start();

	this.force = force;

}


SVGGraph.prototype.transform = function(d){
	return "translate(" + (d.x) + "," + (d.y) + ")";
};


SVGGraph.prototype.tick = function(){
	this.force.on("tick", function(){
		this.svg_edges.attr("d", function(d) {
			return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
		});
		this.svg_nodes.attr("transform", this.transform);
		this.svg_nodes_texts.attr("transform", this.transform);
	}.bind(this));
}

SVGGraph.prototype.updateNode = function(){

	this.svg_nodes.enter().append("circle");
	this.svg_nodes.exit().remove();

	this.svg_nodes.attr({
									"r": function(node) {
										return node.popularity * 4;
									}
								})
								.style({
									"fill": "#F6E8E9",
									"stroke": "#A254A2"
								})
								.on("click", function(node){
									if (d3.event.defaultPrevented) return;
									alertBootbox(node.desc, "节点简介", null);
								})
								.call(this.force.drag);

	this.svg_nodes_texts.enter().append("text");
	this.svg_nodes_texts.exit().remove();

	this.svg_nodes_texts.attr({
												"dy": ".35em",
												"text-anchor": "middle",
												"x": function(d){
													let tspan =  d3.select(this).select("tspan");
													if(tspan.size() == 0){
														d3.select(this).append('tspan')
														.attr({
															"x": 0,
															"y": 0
														})
														.text(function (d) {
															return d.name;
														})
													}else{
														tspan.attr({
															"x": 0,
															"y": 0
														})
														.text(function (d) {
															return d.name;
														})
													}
												}
											})
											.style({
												"fill": "#A254A2"
											});

	this.force.start();
};

SVGGraph.prototype.updateEdge = function(){

	this.svg_edges.enter().append("path");
	this.svg_edges.exit().remove();
	this.svg_edges.style({
									"stroke": "#B43232",
									"stroke-width": 0.5
								})
								.attr({
									"id": function (d, i) {
										return "edgepath" + i;
									}
								}).attr("d", function(d) {
									return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
								});

	svg_edge_texts = this.svg_edges_texts.enter().append("text");
	this.svg_edges_texts.exit().remove();
	svg_edge_texts.append("textPath");
	this.svg_edges_texts.style({
											 	"fill": "black",
											 	"pointer-events": "none"
											 })
											 .attr({
										 		"dx": function(edge, i){
												 		let radius = [];
												 		this.nodes_data.forEach(function(node){
												 			if(node.name == edge.source.name || node.name == edge.target.name){
												 				radius.push(node.popularity * 4);
												 			}
												 		});
												 		let dist = edge.dist * 25;
												 		radius.forEach(function(r){
												 			dist -= r / 2;
												 		})
														return dist / 2 + 15;
												 	}.bind(this)
											 });
	this.svg_edges_texts.select("textPath")
											.attr("xlink:href", function(d, i){
												return "#edgepath" + i;
											})
											.style("pointer-events", "none")
											.text(function (d) {
												return d.dist + "00m";
											});
	this.force.start();

}


SVGGraph.prototype.drawing = function () {

	let svg = d3.select("body")
							.append("svg")
							.attr("width", this.width)
							.attr("height", this.height);

	this.svg_edges       = svg.append("g").attr("id", "svg_edges").selectAll("path").data(this.force.links());
	this.svg_nodes       = svg.append("g").attr("id", "svg_nodes").selectAll("circle").data(this.force.nodes())
 	this.svg_nodes_texts = svg.append("g").attr("id", "svg_nodes_texts").selectAll("text").data(this.force.nodes());
 	this.svg_edges_texts = svg.append("g").attr("id", "svg_edges_texts").selectAll("text").data(this.force.links());

	this.updateEdge();
	this.updateNode();
	this.svg = svg;
	this.tick();

}

SVGGraph.prototype.insertNode = function (name, desc, popularity) {

	this.nodes_data.push({
		name: name,
		desc: desc, 
		popularity: popularity
	});

	this.svg_nodes       = this.svg_nodes.data(this.force.nodes())
	this.svg_nodes_texts = this.svg_nodes_texts.data(this.force.nodes())
	this.updateNode();							
	
}

SVGGraph.prototype.deleteNode = function (nodeName){
	let index = -1;
	for(let i = 0, len = this.nodes_data.length; i < len; i++){
		if(this.nodes_data[i].name == nodeName){
			index = i;
			break;
		}
	}
	let removed = [];
	this.nodes_data.splice(index, 1);
	for(let i = 0, len = this.edges_data.length; i < len; i++){
		if(this.edges_data[i].source.name == nodeName || this.edges_data[i].target.name == nodeName){
			removed.unshift(i);
		}	
	}
	for(let i = 0, len = removed.length; i < len; i++){
		this.edges_data.splice(removed[i], 1);
	}

	this.svg_nodes       = this.svg_nodes.data(this.force.nodes())
	this.svg_nodes_texts = this.svg_nodes_texts.data(this.force.nodes())
	this.updateNode();		

	this.svg_edges       = this.svg_edges.data(this.force.links());
	this.svg_edges_texts = this.svg_edges_texts.data(this.force.links());
	this.updateEdge();

}

SVGGraph.prototype.insertEdge = function (begin, end, dist) {

 	let beginNode, endNode;
	this.nodes_data.forEach(function (node) {
		if(node.name == begin){
    	beginNode = node;
		}
		if(node.name == end){
			endNode = node;
		}
	}); 	

	this.edges_data.push({
		"source": beginNode,
		"target": endNode,
		"dist": parseInt(dist)
	});

	this.svg_edges       = this.svg_edges.data(this.force.links());
	this.svg_edges_texts = this.svg_edges_texts.data(this.force.links());
	this.updateEdge();

}

SVGGraph.prototype.deleteEdge = function(begin, end){
	let index = -1;
	for(let i = 0, len = this.edges_data.length; i < len; i++){
		if((this.edges_data[i].source.name == begin && this.edges_data[i].target.name == end) || (this.edges_data[i].source.name == end && this.edges_data[i].target.name == begin)){		index = i;
			break;
		}
	}
	this.edges_data.splice(index, 1);
	this.svg_edges       = this.svg_edges.data(this.force.links());
	this.svg_edges_texts = this.svg_edges_texts.data(this.force.links());
	this.updateEdge();
}

SVGGraph.prototype.displayTraversal = function(res){
	for(let i = 0; i < res.length; i++){
		setTimeout(function(){
			this.svg_nodes.transition().duration(500).ease("linear").style("fill",function(node){
				if(node.name == res[i]){
					node.isVisited = true;
					return "#A254A2";
				}else if(node.isVisited == true){
					return "#A95";
				}else{
					return "#F6E8E9";
				}
			})
		}.bind(this), i * 1000);
		setTimeout(function(){
			this.svg_edges.transition().duration(500).ease("linear").style("stroke-width", function(line){
				if((line.source.name == res[i] && line.target.name==res[i + 1]) || (line.source.name == res[i + 1] && line.target.name==res[i])){
					return 3;
				}else{
					return 0.5;
				}
			})
		}.bind(this), i * 1000 + 500);
	}
	return function(){
		this.nodes_data.forEach(function(data){
			data.isVisited = false;
		});
		this.svg_nodes.style("fill", "#F6E8E9");
	}.bind(this);
}

SVGGraph.prototype.outputMatrix = function(matrix){
	let res = "<table class='table table-striped'>";
	res += "<thead><tr><th>#</th>";
	for(let i = 0, len = this.nodes_data.length; i < len; i++){
		res += "<th>" + this.nodes_data[i].name + "</th>";
	}
	res += "</tr></thead><tbody>";
	for(let i = 0, len = this.nodes_data.length; i < len; i++){
		res += "<tr><td>" + this.nodes_data[i].name + "</td>";
		for(let j = 0, len = matrix.length; j < len ; j++){
			res += "<td>" + matrix[i][j] + "</td>";
		}
		res += "</tr>";
	}
	res += "</tbody></table>";
	return res;
}

 