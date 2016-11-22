$(document).ready(function() {
	
  $(".topnav").accordion({
    speed: 1000,
    closedSign: '[+]',
    openedSign: '[-]'
  });
  
  $("#nav").click(function(){
  	hideNav();
  });

  $(document.body).on("click", "#clear_style", function(){
  	graph.resetStyle();
  	return false;
  });

  $(document.body).on("click", ".traversal", function(){
		let beginNode = $('#begin').val();
		let method = $(this).attr("data-method")
		let data = JSON.stringify({
						name: beginNode,
						method: method
					});
		new Promise(function(resolve, reject){
				$.ajax({
					url: '/traversal',
					type: "post",
					dataType: "json",
					contentType: "application/json",
					data: data
				})
				.done(function(res) {
					resolve(res);
				})
				.fail(function(error) {
					console.log(error);
					reject(error);
				});	
		}).then(function(res){
			showNav();	  
			if(res.code == 0){

				let data = res.data;
				if(res.method == "dfs"){
					graph.displayDFSTraversal(res.data);
				}else{
					graph.displayBFSTraversal(res.data);
				}

				setTimeout(function(){
					let message = data[0].name;
					for(let i = 1, len = data.length; i < len; i++){
						message += " --> " + data[i].name;
					}
					alertBootbox(message, "Node " + method.toUpperCase() + " Traversal:");
				}, data.length * 1200);

			}else{
				alertBootbox(res.message);
			}				
		}).catch(function(error){
			let message = "Server Error";
			alertBootbox(message);
		});
	});

	$(document.body).on("click", ".node_operation", function () {
		let method = $(this).attr("data-method");
		let name = $("#node_name").val();
		let desc = $("#node_desc").val();
		let popularity = $('#node_popularity').val();
		let data = {
			method: method,
			data: {
				name: name,
				desc: desc,
				popularity: popularity
			}
		};
		$.ajax({
			url: '/node',
			type: 'post',
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: "application/json"
		})
		.done(function(res) {
			showNav();	  
			let callback = null;
			if(res.code == 0){
				if(res.method =="add"){
					callback = function(){
						graph.insertNode(name, desc, popularity);
					}
				}else if(res.method == "delete"){
					callback = function(){
						graph.deleteNode(name);
					}
				}
				$("#node_name").val("");
				$("#node_desc").val("");
				$('#node_popularity').val("");
			}
			alertBootbox(res.message, "", callback);
		})
		.fail(function(err) {
			console.log("error" + err);
		});		
	});

	$(document.body).on("click", ".edge_operation", function(){
		let method = $(this).attr("data-method");
		let begin = $('#edge_begin').val();
		let end = $('#edge_end').val();
		let dist = $("#edge_dist").val();
		let data = {
			method: method,
			data: {
				begin: begin,
				end: end,
				dist: dist
			}
		};
		$.ajax({
			url: '/edge',
			type: 'post',
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: "application/json"
		})
		.done(function(res) {
			showNav();	  
			let callback = null;
			if(res.code == 0){
				if(res.method == "add"){
					callback = function(){
						graph.insertEdge(begin, end, dist);
					}
				}else if(res.method == "delete") {
					callback = function(){
						graph.deleteEdge(begin, end);
					}
				}
				$('#edge_begin').val("");
				$('#edge_end').val("");
				$("#edge_dist").val("");
			}
			alertBootbox(res.message, "",callback);
		})
		.fail(function(err) {
			console.log("error" + err);
		});		
	});
	$(document.body).on("click", "#graph_matrix", function(){
		$.ajax({
			url: "/matrix",
			type: "get",
			contentType: "application/json"
		})
		.done(function(res) {
			showNav();	  
			let result = graph.outputMatrix(res.data);
			alertBootbox(result, "");		
		})
		.fail(function() {
			console.log("error");
		})		
		return false;
	});

	$(document.body).on("click", "#dijkstrabtn", function(){
		let data = {
			nodeName: $("#beginNode").val()
		}
		$.ajax({
			url: '/dijkstra',
			type: 'post',
			dataType: 'json',
			data: JSON.stringify(data),		
			contentType: "application/json"
		})
		.done(function(res) {
			showNav();
			let message;
			if(res.code == 0){
				 message = graph.outputDijkstra(res.data);
			};
			let time = res.data.length * 1800;
			setTimeout(function(){
				alertBootbox(message, "Dijkstra Result:");
			}, time);
		})
		.fail(function() {
			console.log("error");
		})
	});
	$(document.body).on("click", "#kruskalbtn", function(){
		$.ajax({
			url: '/kruskal',
			type: 'get',
			contentType: "application/json"
		})
		.done(function(res) {
			showNav();	  
			let message;
			if(res.code == 0){
				message = graph.outputKruskal(res.data);
			}
			let time = res.data.length * 1500 + 1000;
			setTimeout(function(){
				alertBootbox(message, "Kruskal Result:");
			}, time);
		})
		.fail(function(err) {
			console.log("error" + err);
		});
	});
	$(document.body).on("click", "#primbtn", function(){
		$.ajax({
			url: '/prim',
			type: "get",
			contentType: "application/json"
		})
		.done(function(res) {
			showNav();	
			let message;  
			if(res.code == 0){
				message = graph.outputPrim(res.data);
			}
			let time = res.data.length * 2000 + 1000;
			setTimeout(function(){
				alertBootbox(message, "Prim Result:");
			}, time);
		})
		.fail(function(err) {
			console.log("error" + err);
		});
	});
	$(document.body).on("click", "#searchbtn", function(){
		let data = {
			keyword: $('#keyword').val()
		}
		$.ajax({
			url: '/search',
			type: "post",
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: "application/json"
		})
		.done(function(res) {
			showNav();	
			let message = "";
			if(res.code == 0){
				message = graph.searchKeyword(res.data);
			}
			alertBootbox(message, "Search Result:");
		})
		.fail(function(err) {
			console.log("error" + err);
		});
	});

	$(document.body).on("click", "#sortbtn", function(){
		$.ajax({
			url: '/sort',
			type: "get",
			contentType: "application/json"
		})
		.done(function(res) {
			showNav();	
			let message;
			if(res.code == 0){
				message = graph.outputSortResult(res.data);
			}
			alertBootbox(message, "Popularity Sort Result:");

		})
		.fail(function(err) {
			console.log("error" + err);
		});
	});
	$(window).bind('beforeunload', function(){
		$.ajax({
			url: '/save',
			type: 'post',
		})
		.done(function() {
			console.log("success");
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		
	});

});


