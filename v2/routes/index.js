module.exports = function (app) {
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
};