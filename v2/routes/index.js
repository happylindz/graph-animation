var express = require('express');
var router = express.Router();
var fsp = require("fs-promise");
var fs = require("fs");

router.post("/nodes", function(req, res) {
	let data = g.getNodes();
	res.send({
		code: 0,
		message: "Read nodes successful.",
		data: data
	});
});

router.post("/edges", function(req, res) {
	let data = g.getEdges();
	res.send({
		code: 0,
		message: "Read edges successful.",
		data: data
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
		data: result,
		method: method
	});
});


router.post("/loop", function(req, res){
	let name = req.body.name;
	let data = g.getMaximumLoop(name);
	res.send({
		code: 0,
		data: data,
		message: "Get loop successfully."
	});
});




router.post("/edge", function(req, res) {

	let method = req.body.method;
	let begin = req.body.data.begin;
	let end = req.body.data.end;
	let dist = req.body.data.dist;
	
	let code;
	let message;

	let bIndex = g.findNodeIndex(begin);
	let eIndex = g.findNodeIndex(end);

	if(bIndex == -1 || eIndex == -1){
		code = 1;
		message = "Node cannot found."
	}else{

		if(method == "add"){
			if(!g.findEdge(bIndex, eIndex)){
				code = 0;
				message = "Added edge successfully.";
				g.insertUndirectedEdge(begin, end, dist);
			}else{
				code = 1;
				message = "The edge already exists, do not add it again.";		
			}
		}else{
			if(g.findEdge(bIndex, eIndex)){
				code = 0;
				message = "Deleted edge successfully.";
				g.deleteUndirectedEdge(begin, end);
			}else{
				code = 1;
				message = "The edge cannot found.";
			}
		}
	}
	res.send({
		code: code,
		message: message,
		method: method
	});

});

router.post("/node", function(req, res) {

	let method = req.body.method;
	let name = req.body.data.name;
	let desc = req.body.data.desc;
	let popularity = req.body.data.popularity;

	let code;
	let message;

	let index = g.findNodeIndex(name);
	if(method == "add"){
		if(index == -1){
			g.insertNode(name, desc, popularity);
			code = 0;
			message = "Node was successfully added";
		}else{
			code = 2;
			message = "The node already exists, do not add it again.";
		}
	}else{
		if(index == -1){
			code = 3;
			message = "The node was not found";
		}else{
			g.deleteNode(name);
			code = 0;
			message = "Node was successfully deleted";
		}
	}

	res.send({
		code: code,
		message: message,
		method: method
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


// router.post("/save", function(req, res){
// 	let nodes = g.getNodes();
// 	let edges = g.getEdges();
// 	fsp.writeFile('./test/nodes_data.json', JSON.stringify({
// 		nodes: nodes
// 	}))
// 	.then(fsp.writeFile('./test/edges_data.json', JSON.stringify({
// 		edges: edges
// 	})))
// 	.then(function(){
// 		res.send({
// 			code: 0,
// 			message: "Save data successfully"
// 		})
// 	});
// });

module.exports = router;
