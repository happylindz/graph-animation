let express = require('express');
let path = require('path');
let fs = require('fs');
let queryString = require('querystring')
let bodyParser = require('body-parser');
let app = express();
let ALGraph = require('./ALGraph.js');
let routes = require("./routes/index.js");

app.use(bodyParser());
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

function initData() {

	let nodes = JSON.parse(fs.readFileSync("./test/nodes_data.json")).nodes;
	let g = new ALGraph(nodes.length);
	nodes.forEach(function(node) {
		g.insertNode(node.name, node.desc, node.popularity);
	})

	let edges = JSON.parse(fs.readFileSync("./test/edges_data.json")).edges;
	edges.forEach(function(edge) {
		g.insertUndirectedEdge(edge.source, edge.target, edge.dist);
	});

	g.createGraph();
	return g;

}

global.g = initData();

app.use("/", routes);
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});