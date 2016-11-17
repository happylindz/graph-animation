(function () {

	let nodes_fetch = new Promise(function (resolve, reject) {
			$.ajax({
				url: '/nodes',
				type: 'post',
				dataType: 'json'
			})
			.done(function(res) {
				resolve(res.nodes);
			})
			.fail(function(error) {
				reject(error);
			})
			.always(function() {
			});
	});

	let edges_fetch = new Promise(function (resolve, reject) {
			$.ajax({
				url: '/edges',
				type: 'post',
				dataType: 'json'
			})
			.done(function(res) {
				resolve(res.edges);
			})
			.fail(function(error) {
				reject(error);
			})
			.always(function() {
			});
	});

	Promise.all([nodes_fetch, edges_fetch]).then(function ([nodes, edges]){

		let graph = new SVGGraph(nodes, edges);
		window.graph = graph;
		graph.drawing();

	}).catch(function (error) {
		console.log(error);
	});

})();