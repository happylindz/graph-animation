function Graph(nodes, edges){
		this.width = $("body").width();
		this.height = $("body").height();
		this.init(nodes, edges);
}

Graph.prototype.init = function(nodes, edges) {

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
Graph.prototype.findNodeName = function(index){
	return this.nodes_data[index].name;
}


Graph.prototype.transform = function(d){
	return "translate(" + (d.x) + "," + (d.y) + ")";
};


Graph.prototype.tick = function(){
	this.force.on("tick", function(){
		this.svg_edges.attr("d", function(d) {
			return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
		});
		this.svg_nodes.attr("transform", this.transform);
		this.svg_nodes_texts.attr("transform", this.transform);
		if(this.svg_path_texts){
			this.svg_path_texts.attr("transform", this.transform);
		}
	}.bind(this));
}

Graph.prototype.updateNode = function(){

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
									if(node.desc != ""){
										alertBootbox(node.desc, "Node Description:", null);
									}
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

Graph.prototype.updateEdge = function(){

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
														return dist / 2 + 30;
												 	}.bind(this)
											 });
	this.svg_edges_texts.select("textPath")
											.attr("xlink:href", function(d, i){
												return "#edgepath" + i;
											})
											.style("pointer-events", "none")
											.text(function (d) {
												return d.dist;
											});
	this.force.start();

}


Graph.prototype.drawing = function () {

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

Graph.prototype.insertNode = function (name, desc, popularity) {

	this.nodes_data.push({
		name: name,
		desc: desc, 
		popularity: popularity
	});

	this.svg_nodes       = this.svg_nodes.data(this.force.nodes())
	this.svg_nodes_texts = this.svg_nodes_texts.data(this.force.nodes())
	this.updateNode();							
	
}

Graph.prototype.deleteNode = function (nodeName){
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

Graph.prototype.insertEdge = function (begin, end, dist) {

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

Graph.prototype.deleteEdge = function(begin, end){
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

Graph.prototype.displayDFSTraversal = function(data){

	for(let i = 0, len = data.length; i < len; i++){

		setTimeout(function(){
			this.svg_nodes.transition().duration(600).ease("linear").style("fill",function(node){
				if(node.name == data[i].name){
					node.isVisited = true;
					return "#A254A2";
				}else if(node.isVisited == true){
					return "#A95";
				}else{
					return "#F6E8E9";
				}
			})
		}.bind(this), i * 1200);

		setTimeout(function(){
			this.svg_edges.transition().duration(600).ease("linear").style("stroke-width", function(line){
				if((line.source.name == data[i].name && line.target.name == data[i + 1].name) || (line.source.name == data[i + 1].name && line.target.name == data[i].name)){
					return 3;
				}else{
					return 0.5;
				}
			})
		}.bind(this), i * 1200 + 600);

	}

}

Graph.prototype.displayBFSTraversal = function(data){

	for(let i = 0, index = 0, len = data.length; i < len; i++){
		let name = data[i].name;
		setTimeout(function(){
			this.svg_nodes.transition().duration(600).ease("linear")
					.style("fill", function(node){
						if(node.name == name){
							node.isVisited = true;
							return "#A254A2";
						}else if(node.isVisited == true){
							return "#A95";
						}else{
							return "#F6E8E9";
						}
					})
		}.bind(this), i * 1200);

		if(data[i].selected == true){
			index = i;
		}

		setTimeout(function(){
			this.svg_edges.transition().duration(600).ease("linear").style("stroke-width", function(line){
				if(i + 1 >= data.length || data[i + 1].selected == true){
					return 0.5;
				}
				if((line.source.name == data[index].name && line.target.name == data[i + 1].name) || (line.source.name == data[i + 1].name && line.target.name == data[index].name)){
					return 3;
				}else{
					return 0.5;
				}
			});
		}.bind(this), i * 1200 + 600);	

	}
}

Graph.prototype.outputMatrix = function(matrix){
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

Graph.prototype.outputDijkstra = function(data){
	this.svg_path_texts = this.svg.append("g")
														.attr("id", "svg_path_texts")
														.selectAll("text")
														.data(this.force.nodes())
														.enter()
														.append("text")
														.attr({
															"dy": ".35em",
															"text-anchor": "middle",
															"x": function(node){
																return node.popularity * 4 + 5;
															},
															"y": function(node){
																return node.popularity * 4 + 5;
															}
														})
														.text(function(node){
															return node.path;
														})
														.attr("transform", this.transform);
	
	for(let i = 0, index = 0, len = data.length; i < len; i++){

		let name = data[i].node;
		let dist = data[i].dist;
		let selected = data[i].selected;
		setTimeout(function(){
			this.svg_nodes.transition().duration(600).ease("linear")
					.style("fill", function(node){
						if(selected == true && node.name == name){
							node.isVisited = true;
							return "#233142";
						}
						if(node.name == name){
							return "#A254A2";
						}else if(node.isVisited == true){
							return "#A95";
						}else{
							return "#F6E8E9";
						}
					})
		}.bind(this), i * 1800);
		if(data[i].selected == true){
			index = i;
		}
		setTimeout(function(){
			this.svg_edges.transition().duration(600).ease("linear").style("stroke-width", function(line){
				if(i + 1 >= data.length || data[i + 1].selected == true){
					return 0.5;
				}
				if((line.source.name == data[index].node && line.target.name == data[i + 1].node) || (line.source.name == data[i + 1].node && line.target.name == data[index].node)){
					return 3;
				}else{
					return 0.5;
				}
			});
		}.bind(this), i * 1800 + 600);		
		
		setTimeout(function(){
			this.svg_path_texts.transition().duration(600).ease("linear")
					.text(function(node){
						if(node.name == name){
							node.path = dist;
						}
						return node.path;
					});
		}.bind(this), i * 1800 + 1200);

	}
	setTimeout(function(){
		this.svg_nodes.transition().duration(600).ease("linear")
				.style("fill", function(node){
					if(node.isVisited == true){
						return "#A95";
					}else{
						return "#F6E8E9";
					}
				})
	}.bind(this), data.length * 1800);
	let distObj = {};
	data.forEach(function(item){
		if(!distObj[item.node]){
			distObj[item.node] = item.dist;
		}else{
			distObj[item.node] = item.dist < distObj[item.node] ? item.dist : distObj[item.node];
		}
	});
	let res = "<table class='table table-striped'>";
	res += "<thead><tr><th>#</th>";
	for(var key in distObj){
		res += "<th>" + key + "</th>";
	}
	res += "</tr></thead><tbody><tr><th>" + data[0].node + "</th>";
	for(var key in distObj){
		res += "<th>" + distObj[key] + "</th>";
	}
	res += "</tr></tbody></table>";
	return res;
}

Graph.prototype.resetStyle = function(){
	this.nodes_data.forEach(function(data){
		data.isVisited = false;
	});
	this.edges_data.forEach(function(data){
		data.isVisited = false;
	});
	this.svg_edges.style("stroke-width", function(line){
		return 0.5;
	});
	this.svg_nodes.style("fill", "#F6E8E9");
	if(this.svg_path_texts){
		this.svg.select("#svg_path_texts").remove();
		this.svg_path_texts = null;
	}
}
Graph.prototype.outputRoads = function(edges){
	let message = "<table class='table table-striped'>";
	message += "<thead><tr><th>Roads:</th></tr></thead>";
	message += "<tbody>"
	for(let i = 0, len = edges.length; i < len; i++){
		message += "<tr><th>" + (i + 1) + ". from " + edges[i].begin + " to " + edges[i].end + ' repair a road.' + "</th></tr>";
	}
	message += "</tbody></table>";
	return message;
}

Graph.prototype.outputKruskal = function(edges){
	for(let i = 0, len = edges.length; i < len; i++){
		let edge = edges[i];
		setTimeout(function(){	
			this.svg_edges.transition().duration(1000).ease("linear").style("stroke-width", function(line){
				if((line.source.name == edge.begin && line.target.name == edge.end) || (line.source.name == edge.end && line.target.name == edge.begin)){
					line.isVisited = true;
					return 3;
				}else if(line.isVisited){
					return 3;
				}else{
					return 0.5;
				}
			});
			this.svg_nodes.transition().duration(1000).ease("linear")
					.style("fill", function(node){
						if(edge.begin == node.name || edge.end == node.name){
							node.isVisited = true;
							return "#A254A2";
						}else if(node.isVisited == true){
							return "#A95";
						}else{
							return "#F6E8E9";
						}
					})
		}.bind(this), 1500 * i);
	}
	setTimeout(function(){
		this.svg_nodes.transition().duration(1000).ease("linear")
					.style("fill", function(node){
						if(node.isVisited == true){
							return "#A95";
						}else{
							return "#F6E8E9";
						}
					});
	}.bind(this), 1500 * edges.length);
	return this.outputRoads(edges);
}

Graph.prototype.outputPrim = function(edges){

	for(let i = 0, len = edges.length; i < len; i++){
		let edge = edges[i];
		setTimeout(function(){
			this.svg_nodes.transition().duration(600).ease("linear")
					.style("fill", function(node){
						if(edge.begin == node.name){
							node.isVisited = true;
							return "#A254A2";
						}else if(node.isVisited == true){
							return "#A95";
						}else{
							return "#F6E8E9";
						}
					});
		}.bind(this), i * 2000);
		setTimeout(function(){
			this.svg_edges.transition().duration(700).ease("linear").style("stroke-width", function(line){
				if((line.source.name == edge.begin && line.target.name == edge.end) || (line.source.name == edge.end && line.target.name == edge.begin)){
					line.isVisited = true;
					return 3;
				}else if(line.isVisited){
					return 3;
				}else{
					return 0.5;
				}
			});
		}.bind(this), i * 2000 + 600);
		setTimeout(function(){
			this.svg_nodes.transition().duration(600).ease("linear")
					.style("fill", function(node){
						if(edge.end == node.name){
							node.isVisited = true;
							return "#A254A2";
						}else if(node.isVisited == true){
							return "#A95";
						}else{
							return "#F6E8E9";
						}
					});
		}.bind(this), i * 2000 + 1300);
	}
	setTimeout(function(){
		this.svg_nodes.transition().duration(600).ease("linear")
					.style("fill", function(node){
						if(node.isVisited == true){
							return "#A95";
						}else{
							return "#F6E8E9";
						}
					});
	}.bind(this), edges.length * 2000);
	return this.outputRoads(edges);
}

Graph.prototype.outputSortResult = function(data){
	if(data.length == 0){
		return "Failed to find related nodes";
	}
	let message = "<table class='table table-striped'>";
	message += "<thead><tr><th>Ranking</th><th>Name</th><th>Popularity</th></thead><tbody>";
	for(let i = 0, len = data.length; i < len; i++){
		message += "<tr><th>" + (i + 1) + "</th><th>" + data[i].name + "</th><th>" + data[i].popularity + "</th></tr>";
	}
	message += "</tbody></table>";
	return message;
}
Graph.prototype.searchKeyword = function(data){
	if(data.length == 0){
		return "The keyword could not be found";
	}
	let message = "<div>";
	for(let i = 0; i < data.length; i++){
		message += "<div><h3>" + data[i].name + "</h3>";
		message += "<p>Popularity: " + data[i].popularity + "</p>";
		message += "<p>Description: " + data[i].desc  + "</p></div>";
	}
	message += "</div>";
	return message;
}
