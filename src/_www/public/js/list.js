!function() {

function getPodcastData() {
	$.ajax({
		type: "GET",
		dataType:"json",
		url: "/ajax/list",
		success: function(data) {
			populateList(data);
		}  
	});
}

function populateList(data) {
	data.forEach(function(item) {
		var podcast = $("<div>", {
			"class": "podcastListItem"
		}).append($("<a>").append($("<div>", {
			"class": "podcastItemImage"
		}).css("background", "url(" + item.icon_180 + ")")).attr("href", "/"+item.slug))
		.append($("<a>", {
			"class": "podcastItemTitle"
		}).html(item.title).attr("href", "/"+item.slug))
		.append($("<div>", {
			"class": "podcastItemDescription"
		}).html(item.description));
		$("#list-chunk-container").append(podcast);
	});
}

$(document).ready(function(){
	getPodcastData();
});

}();