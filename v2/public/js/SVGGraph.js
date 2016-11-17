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


SVGGraph.prototype.drawing = function () {
	
	let svg = d3.select("body")
							.append("svg")
							.attr("width", this.width)
							.attr("height", this.height);

	let svg_edges = svg.append("g").attr("id", "svg_edges").selectAll("path")
											.data(this.force.links())
											.enter()
											.append("path")
											.style({
												"stroke": "#B43232",
												"stroke-width": 0.5
											})
											.attr({
												"id": function (d, i) {
													return "edgepath" + i;
												}
											})

	let svg_nodes = svg.append("g").attr("id", "svg_nodes").selectAll("circle")
											.data(this.force.nodes())
											.enter()
											.append("circle")
											.attr({
												"r": function(node) {
													return node.popularity * 4;
												}
											})
											.style({
												"fill": "#F6E8E9",
												"stroke": "#A254A2"
											})
											.on("click", function (node) {
												svg_edges.style("stroke-width", function (edge) {
													if(edge.source.name == node.name || edge.target.name == node.name){
														return 3;
													}else{
														return 0.5;
													}
												})
											})
											.call(this.force.drag);

 	let svg_nodes_texts = svg.append("g").attr("svg_nodes.texts").selectAll("text")
														.data(this.force.nodes())
														.enter()
														.append("text")
														.attr({
															"dy": ".35em",
															"text-anchor": "middle",
															"x": function(d){
																d3.select(this).append('tspan')
																	.attr({
																		"x": 0,
																		"y": 0
																	})
																	.text(function (d) {
																		return d.name;
																	})
															}
														})
														.style({
															"fill": "#A254A2"
														});
	let svg_edges_texts = svg.append("g").attr("id", "svg_edges_texts").selectAll("text")
													 .data(this.force.links())
													 .enter()
													 .append("text")
													 .style({
													 	"fill": "black",
													 	"pointer-events": "none"
													 })
													 .attr({
													 	"dx": function(edge, i){
													 		let radius = [];
													 		svg_nodes.attr("r", function(node){
													 			if(node.name == edge.source.name || node.name == edge.target.name){
													 				radius.push(node.popularity * 4);
													 			}
													 			return node.popularity * 4;
													 		})
													 		let dist = edge.dist * 25;
													 		radius.forEach(function (r) {
													 			dist -= r / 2;
													 		});
													 		return dist / 2 + 15;
													 	}
													 });
	svg_edges_texts.append("textPath")
									.attr("xlink:href", function(d, i){
										return "#edgepath" + i;
									})
									.style("pointer-events", "none")
									.text(function (d) {
										return d.dist + "00m";
									})
													 

	this.force.on("tick", function(){
		svg_edges.attr("d", function(d) {
			return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
		});
		svg_nodes.attr("transform", this.transform);
		svg_nodes_texts.attr("transform", this.transform);
	}.bind(this));

	this.svg = svg;
	this.svg_nodes = svg_nodes;
	this.svg_edges = svg_edges;
	this.svg_nodes_texts = svg_nodes_texts;
	this.svg_edges_texts = svg_edges_texts;

}

SVGGraph.prototype.insertNode = function (name, desc, popularity) {
	this.nodes_data.push({
		name: name,
		desc: desc, 
		popularity: popularity
	});
	this.svg_nodes.data(this.force.nodes())
									.enter()
									.append("circle")
									.attr({
										"r": function(node) {
											return node.popularity * 4;
										}
									})
									.style({
										"fill": "#F6E8E9",
										"stroke": "#A254A2"
									})
									.on("click", function (node) {
										svg_edges.style("stroke-width", function (edge) {
											if(edge.source.name == node.name || edge.target.name == node.name){
												return 3;
											}else{
												return 0.5;
											}
										})
									})
									.call(this.force.drag);
	this.svg_nodes_texts.data(this.force.nodes())
											.enter()
											.append("text")
											.attr({
												"dy": ".35em",
												"text-anchor": "middle",
												"x": function(d){
													d3.select(this).append('tspan')
														.attr({
															"x": 0,
															"y": 0
														})
														.text(function (d) {
															return d.name;
														})
												}
											})
											.style({
												"fill": "#A254A2"
											});

	this.force.start();
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
		"dist": dist
	});
	this.update();
	// this.svg_edges = this.svg_edges.data(this.force.links())
								
	// this.svg_edges.enter()
	// 							.append("path")
	// 							.style({
	// 								"stroke": "#B43232",
	// 								"stroke-width": 0.5
	// 							})
	// 							.attr({
	// 								"id": function (d, i) {
	// 									return "edgepath" + i;
	// 								}
	// 							});	
	// // this.svg_edges.exit().remove();
	// this.force.start();
	// console.log(this.svg_edges);
	// // console.log(this.svg_edges);
	// this.force.on("tick", function(){
	// 	this.svg_edges.attr("d", function(d) {
	// 		return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
	// 	});
	// 	this.svg_nodes.attr("transform", this.transform);
	// 	this.svg_nodes_texts.attr("transform", this.transform);
	// }.bind(this));

}


SVGGraph.prototype.update = function(){
	d3.select('#svg_edges').selectAll("path")
		.data(this.force.links())
		.enter()
		.append("path")
		.style({
			"stroke": "#B43232",
			"stroke-width": 0.5
		})
		.attr({
			"id": function (d, i) {
				return "edgepath" + i;
			}
		});
}
