let express = require('express');
let path = require('path');
let fs = require('fs');
let queryString = require('querystring')
let bodyParser = require('body-parser');
let app = express();
let ALGraph = require('./ALGraph.js');

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(express.static(__dirname + '/public'));

function initData(){

	let nodes = JSON.parse(fs.readFileSync("nodes_data.json")).nodes;
	let g = new ALGraph(nodes.length);
	nodes.forEach(function(node){
		g.insertNode(node.name, node.desc, node.popularity);
	})

	let edges = JSON.parse(fs.readFileSync("edges_data.json")).edges;
	edges.forEach(function(edge){
		g.insertUndirectedEdge(edge.source, edge.target, edge.dist);
	});

	g.createGraph();
	return g;	
	
}

let g = initData();

app.post("/traversal", function (req, res) {
	let method = req.body.method;
	let result;
	if(method == "dfs"){
		result = g.createTourSortGraphByDFS(req.body.name);
	}else{
		result = g.createTourSortGraphByBFS(req.body.name);
	}
	let code;
	if(result.length > 0){
		code = 0;
	}else{
		code = 1;
	}
	res.send({
		code: code,
		data: result
	});
});

app.post("/nodes", function (req, res) {
	fs.readFile("./nodes_data.json", "utf-8", function (err, data) {
		if(err){
			res.send({
				code: 1,
				data: ""
			});
		}
		res.send(JSON.parse(data));
	})
})

app.post("/edges", function (req, res) {
	fs.readFile("./edges_data.json", "utf-8",function (err, data) {
		if(err){
			res.send({
				code: 1,
				data: ""
			});
		}
		res.send(JSON.parse(data));
	})
})

app.listen(3000, function(){
	console.log("Server listening on port 3000");
});