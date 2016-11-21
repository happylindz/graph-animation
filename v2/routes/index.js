var express = require('express');
var router = express.Router();
var fsp = require("fs-promise");
var fs = require("fs");

router.post("/nodes", function(req, res) {
	fsp.readFile("./test/nodes_data.json", {encoding: "utf8"})
		 .then(function (contents) {
				res.send({
					code: 0,
					message: "Read node successful.",
					data: JSON.parse(contents)
				});
		 }).catch(function(err){
		 	res.send({
				code: 1,
				mesages: "The server has failed and can not get data."
			});
		});
});

router.post("/edges", function(req, res) {
	fsp.readFile("./test/edges_data.json", {encoding: "utf8"})
			.then(function (contents) {
				res.send({
					code: 0,
					message: "The read edge was successful.",
					data: JSON.parse(contents)
				});
			}).catch(function (err) {
				res.send({
					code: 1,
					mesages: "The server has failed and can not get data."
				});
			});
});

router.post("/traversal", function(req, res) {
	let method = req.body.method;
	let name = req.body.name;
	let result;
	let message;
	let code;

	if (method == "dfs") {
		result = g.createTourSortGraphByDFS(name);
	} else {
		result = g.createTourSortGraphByBFS(name);
	}

	if (result.length > 0) {
		code = 0;
		message = "";
	} else {
		code = 1;
		message = "Input is wrong, find the starting point.";
	}

	res.send({
		code: code,
		message: message,
		data: result
	});
});



router.post("/edge", function(req, res) {

	let method = req.body.method;
	let begin = req.body.data.begin;
	let end = req.body.data.end;
	let dist = req.body.data.dist;
	let code;
	let message;
	fsp.readFile("./test/edges_data.json", {encoding: "utf8"})
			.then(function (content) {
				let edges = JSON.parse(content).edges;
				let index = -1;
				for(let i = 0, len = edges.length; i < len; i++){
					if ((edges[i].source == begin && edges[i].target == end) || (edges[i].source == end && edges[i].target == begin)) {
						index = i;
					}
				}
				if(method == "add"){
					if(index == -1){
						edges.push({
							source: begin,
							target: end,
							dist: dist
						})
						code = 0;
						message = "Added edge successfully.";
					}else{
						code = 2;
						message = "The edge already exists, do not add it again.";
					}
				}else if(method == "delete"){
					if(index == -1){
						code = 3;
						message = "The edge could not be found.";
					}else {
						edges.splice(index, 1);
						code = 0;
						message = "The edge was successfully deleted.";
					}
				}else{
					code = 4;
					message = "The input command is incorrect.";
				}
				return edges;
			}).then(function(edges){
				if(code == 0){
					let content = {
						edges: edges
					};
					fsp.writeFile("./test/edges_data.json", JSON.stringify(content)).then(function(){
						g = initData();
					}).then(function(){
						res.send({
							code: code,
							message: message,
							method: method
						});
					})
				}else{
					res.send({
						code: code,
						message: message,
						method: method
					});
				}
			})
			.catch(function (err) {
				res.send({
					code: 1,
					message: "The server has failed and can not get data",
					method: method
				});
			});
});

router.post("/node", function(req, res) {

	let method = req.body.method;
	let name = req.body.data.name;
	let desc = req.body.data.desc;
	let popularity = req.body.data.popularity;
	let code;
	let message;
	let edges;
	let removed_edges = [];

	fsp.readFile("./test/nodes_data.json", {encoding: "utf8"}).
	then(function(content){
		let nodes = JSON.parse(content).nodes;
		let index = -1;
		for(let i = 0, len = nodes.length; i < len; i++){
			if(nodes[i].name == name){
				index = i;
				break;
			}
		}
		if(method == "add"){
			if(index == -1){
				nodes.push({
					name: name,
					desc: desc,
					popularity: popularity
				})
				code = 0;
				message = "Node was successfully added";
			}else{
				code = 2;
				message = "The node already exists, do not add it again.";
			}
		}else if(method == "delete"){
			if (index == -1) {
				code = 3;
				message = "The node was not found";
			} else {
				console.log(nodes[index]);
				nodes.splice(index, 1);
				code = 0;
				message = "The node was successfully deleted";
				let content = fs.readFileSync("./test/edges_data.json");
				edges = JSON.parse(content).edges;
				for(let i = 0, len = edges.length; i < len; i++){
					if(edges[i].source == name || edges[i].target == name){
						removed_edges.unshift(i);
					}
				}
				for(let i = 0, len = removed_edges.length; i < len; i++){
					edges.splice(removed_edges[i], 1);
				}

			}
		}else{
			code = 4;
			message = "The input command is incorrect";
		}
		return nodes;
	}).then(function(nodes){
		if(code == 0){
			let content = {
				nodes: nodes
			};
			if(method == "add"){
				fsp.writeFile("./test/nodes_data.json", JSON.stringify(content)).then(function(){
					g = initData();
				});
			}else if(method == "delete"){
				fsp.writeFile("./test/nodes_data.json", JSON.stringify(content)).then(function(){
					content = {
						edges: edges
					}
					return content;
				}).then(function(content){
					return fsp.writeFile("./test/edges_data.json", JSON.stringify(content));
				}).then(function(){
					g = initData();
				})
			}		
		}
		res.send({
			code: code,
			message: message,
			method: method
		});
	}).catch(function (err) {
		res.send({
			code: 1,
			message: "The server has failed and can not get data",
			method: method
		});
	});	
});

router.all("/matrix", function(req, res){
	let map = g.getAdjMatrix();
	res.send({
		code: 0,
		message: "Get adjacency matrix success",
		data: map
	});
});

router.post("/dijkstra", function(req, res){
	let nodeName = req.body.nodeName;
	let data = g.shortestPath(nodeName);
	res.send({
		code: 0,
		message: "Get data success",
		data: data
	});
});

router.get("/kruskal", function(req, res){
	let data = g.outputKruskal();
	res.send({
		code: 0,
		message: "Get data success",
		data: data
	});
});

router.get("/prim", function (req, res) {
	let data = g.outputPrim();
	res.send({
		code: 0,
		message: "Get data success",
		data: data
	});
});

router.get("/sort", function(req, res){
	let data = g.sortByPopularity();
		res.send({
		code: 0,
		data: data
	});
});

router.post("/search", function(req, res){
	let data = g.searchKeyword(req.body.keyword);
	res.send({
		code: 0,
		data: data
	});
});

module.exports = router;
