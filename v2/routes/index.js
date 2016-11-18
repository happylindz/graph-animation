var express = require('express');
var router = express.Router();
var fsp = require("fs-promise");

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

router.post("/edge", function(req, res) {

	let method = req.body.method;
	let begin = req.body.data.begin;
	let end = req.body.data.end;
	let dist = req.body.data.dist;
	let code;
	let message;

	fs.readFile("./test/edges_data.json", "utf-8", function(err, data) {
		let edges = JSON.parse(data).edges;
		if (err) {
			code = 1;
			message = "服务器发生故障，无法获取数据";
		} else {
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
		}

		if (code == 0) {
			let content = {
				edges: edges
			};
			fs.writeFile("./test/edges_data.json", JSON.stringify(content), function(err) {
				if (err) {
					code = 1;
					message = "服务器发生故障，无法获取数据";
				} else {
					g = initData();
				}
				res.send({
					code: code,
					message: message
				});
			})
		}else{
			res.send({
				code: code,
				message: message
			});
		}
	});
});

router.post("/node", function(req, res) {

	let method = req.body.method;
	let name = req.body.data.name;
	let desc = req.body.data.desc;
	let popularity = req.body.data.popularity;
	let code;
	let message;

	fs.readFile("./test/nodes_data.json", "utf-8", function(err, data) {
		let nodes = JSON.parse(data).nodes;
		if (err) {
			code = 1;
			message = "服务器发生故障，无法获取数据";
		} else {
			let index = -1;
			for (let i = 0, len = nodes.length; i < len; i++) {
				if (nodes[i].name == name) {
					index = i;
				}
			}
			if (method == "add") {
				if (index == -1) {
					nodes.push({
						name: req.body.data.name,
						desc: req.body.data.desc,
						popularity: req.body.data.popularity
					});
					code = 0;
					message = "成功添加节点";
				} else {
					code = 2;
					message = "该节点已经存在，请勿重复添加。";
				}
			} else if (method == "delete") {
				if (index == -1) {
					code = 3;
					message = "找不到该节点";
				} else {
					nodes.splice(index, 1);
					code = 0;
					message = "成功删除节点";
				}
			} else {
				code = 4;
				message = "输入指令有误";
			}
		}
		if (code == 0) {
			let content = {
				nodes: nodes
			};
			fs.writeFile("./test/nodes_data.json", JSON.stringify(content), function(err) {
				if (err) {
					code = 1;
					message = "服务器发生故障，无法获取数据";
				} else {
					g = initData();
				}
				res.send({
					code: code,
					message: message
				});
			})
		}else{
			res.send({
				code: code,
				message: message
			});
		}
	})
})


module.exports = router;
