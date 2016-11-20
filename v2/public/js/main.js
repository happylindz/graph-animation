$(document).ready(function() {
	
  $(".topnav").accordion({
    speed: 1000,
    closedSign: '[+]',
    openedSign: '[-]'
  });
  
  $("#nav").click(function(){
  	hideNav();
  });

  $(document.body).on("click", ".traversal", function(){
		let beginNode = $('#begin').val();
		let data = JSON.stringify({
						name: beginNode,
						method: $(this).attr("data-method")
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
				let callback = graph.displayTraversal(res.data);
				setTimeout(function(){
					let message = data[0];
					for(let i = 1, len = data.length; i < len; i++){
						message += " --> " + data[i];
					}
					alertBootbox(message, "导游路线图", callback);
				}, data.length * 1000);
			}else{
				alertBootbox(res.message);
			}				
		}).catch(function(error){
			let message = "服务器发生故障";
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
				let result = graph.outputMatrix(res.data);
				alertBootbox(result, "");		
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
			
			return false;
		});
});


