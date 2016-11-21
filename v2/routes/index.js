var express = require('express');
var router = express.Router();
var fsp = require("fs-promise");
var fs = require("fs");

router.post("/nodes", function(req, res) {
	fsp.readFile("./test/nodes_data.json", {encoding: "utf8"})
		 .then(function (contents) {
				res.send({
					code: 0,
					message: "读取节点成功",
					data: JSON.parse(contents)
				});
		 }).catch(function(err){
		 	res.send({
				code: 1,
				mesages: "服务器发生故障，无法获取数据"
			});
		});
});

router.post("/edges", function(req, res) {
	fsp.readFile("./test/edges_data.json", {encoding: "utf8"})
			.then(function (contents) {
				res.send({
					code: 0,
					message: "读取边成功",
					data: JSON.parse(contents)
				});
			}).catch(function (err) {
				res.send({
					code: 1,
					mesages: "服务器发生故障，无法获取数据"
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
		message = "输入有误，找到起点。";
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
						message = "成功添加边";
					}else{
						code = 2;
						message = "该边已存在，请勿重复添加";
					}
				}else if(method == "delete"){
					if(index == -1){
						code = 3;
						message = "找不到该边";
					}else {
						edges.splice(index, 1);
						code = 0;
						message = "成功删除该边";
					}
				}else{
					code = 4;
					message = "输入指令有误";
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
					message: "服务器发生故障，无法获取数据",
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
				message = "成功添加节点";
			}else{
				code = 2;
				message = "该节点已经存在， 请勿重复添加。";
			}
		}else if(method == "delete"){
			if (index == -1) {
				code = 3;
				message = "找不到该节点";
			} else {
				console.log(nodes[index]);
				nodes.splice(index, 1);
				code = 0;
				message = "成功删除节点";
				let content = fs.readFileSync("./test/edges_data.json");
				edges = JSON.parse(content).edges;
				for(let i = 0, len = edges.length; i < len; i++){
					if(edges[i].source == name || edges[i].target == name){
						removed_edges.unshift(i);
					}
				}
				console.log(removed_edges);
				for(let i = 0, len = removed_edges.length; i < len; i++){
					edges.splice(removed_edges[i], 1);
				}

			}
		}else{
			code = 4;
			message = "输入指令有误";
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
			message: "服务器发生故障，无法获取数据",
			method: method
		});
	});	
});

router.all("/matrix", function(req, res){
	let map = g.getAdjMatrix();
	res.send({
		code: 0,
		message: "获取邻接矩阵成功",
		data: map
	});
});

router.post("/dijkstra", function(req, res){
	let nodeName = req.body.nodeName;
	let data = g.shortestPath(nodeName);
	res.send({
		code: 0,
		message: "获取数据成功",
		data: data
	});
});

router.get("/kruskal", function(req, res){
	let data = g.outputKruskal();
	res.send({
		code: 0,
		message: "获取数据成功",
		data: data
	});
});

router.get("/prim", function (req, res) {
	let data = g.outputPrim();
	res.send({
		code: 0,
		message: "获取数据成功",
		data: data
	});
});



module.exports = router;
