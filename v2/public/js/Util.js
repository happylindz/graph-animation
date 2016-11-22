$(document).ready(function(){
	$.fn.extend({
		accordion: function(options){
			var defaults = {
	      speed: 300,
	      closedSign: '[+]',
	      openedSign: '[-]'
			};
			var opts = $.extend(defaults, options);
			var $this = $(this);
			$this.find("li").each(function(){
				if($(this).find("ul").length != 0){
					$(this).find("a:first").append("<span>" + opts.closedSign + "</span>");
				}
			});
			$this.find("a").click(function(e){
				if(!$(this).parent().find("ul").is(":visible")){
					$this.find("ul").slideUp(opts.speed);
					$this.find("a").find("span").html(opts.closedSign);
					$(this).parent().find("ul").slideDown(opts.speed);
					$(this).find("span:first").html(opts.openedSign);
				}else{
					$this.find("ul").slideUp(opts.speed);
					$this.find("a").find("span").html(opts.closedSign);
				}
				e.preventDefault();
			})
		}
	});
});

function hideNav(){
	$("#nav").delay(200).animate({"width": "0"}, 600, function () {
		$(".topnav").delay(200).animate({"height": "toggle"}, 600);
	});
}

function showNav(){
	$(".topnav").delay(200).animate({height:'toggle'}, 600, function(){
		$("#nav").delay(200).animate({width:'250px'}, 600);
	});
}

function alertBootbox(message, title, callback){
	title = title || "Result:";
	callback = callback || null;
	let box = bootbox.alert({
		title: title,
		message: message,
		buttons:{
			ok:{
				label: "确认",
				className: "btn-primary"
			}
		},
		callback: callback,
		backdrop: true,
		animate: true,
	});	
}