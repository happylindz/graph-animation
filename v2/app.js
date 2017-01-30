let express = require('express');
let path = require('path');
let fs = require('fs');
let queryString = require('querystring')
let bodyParser = require('body-parser');
let app = express();
let ALGraph = require('./ALGraph.js');
let routes = require("./routes/index.js");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

global.initData = function() {

	let nodes = JSON.parse(fs.readFileSync("./test/nodes_data.json")).nodes;
	let g = new ALGraph();
	nodes.forEach(function(node) {
		g.insertNode(node.name, node.desc, node.popularity);
	})

	let edges = JSON.parse(fs.readFileSync("./test/edges_data.json")).edges;
	edges.forEach(function(edge) {
		g.insertUndirectedEdge(edge.source, edge.target, edge.dist);
	});
	return g;
}

global.g = initData();
g.outputPrim();

app.use("/", routes);
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});
