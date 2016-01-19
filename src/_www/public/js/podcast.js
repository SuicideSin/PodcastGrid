!function(){
	
var episodeData;
var as;

function populateChunk() {
	for(var i = 0; i <= episodeData.length -1; i++){
		var thumb = $("<div>", {
			"class": "video-chunk"
		})
			.data("id", episodeData[i]['id'])
		.append($("<a>")
			.attr("href", "/" + getPodcastSlug() + "/" + episodeData[i].id + "#episode")
		.append($("<div>", {
			"class": "video-chunk-thumbnail"
		})
			.attr("title", episodeData[i].title)
			.css("background", "#ccc url(//data.rolandoislas.com/podcast/" + getPodcastSlug().replace("-", "_") + "/thumb/" + episodeData[i].id + ".jpg)")));
		$("#list-chunk-container").append(thumb);
	}
}

function getPodcastSlug() {
	var path = window.location.pathname.split( '/' );
	if(typeof path[1] != 'undefined' && path[1] != '')
		return path[1];
	return false;
}

function getEpisodeData() {
	$.ajax({  
		type: "GET",
		dataType:"json",
		url: "/ajax/episodes/" + getPodcastSlug(),
		success: function(data){
			episodeData = data;
			populateChunk();
			audiojs.events.ready(function() {
				checkEpisode();
			});
		}  
	});
}

function populateLinks(data) {
	$("#rss").attr("href", data.rss);
	$("#itunes").attr("href", data.itunes);
	$("#contact").attr("href", data.contact);
}

function populatePodcastInfo(data) {
	$("#episode-art").css("background", "url(" + data.icon_180 + ")");
	$("#episode-art-link").attr("href", "/" + getPodcastSlug());
}

function getPodcastData() {
	$.ajax({
		type: "GET",
		dataType:"json",
		url: "/ajax/info/" + getPodcastSlug(),
		success: function(data){
			populateLinks(data);
			populatePodcastInfo(data);
		}  
	});
}

function getEpisodeFromID(id) {
	for (var i = 0; i <= episodeData.length - 1; i++) {
		if (episodeData[i]['id'] == id) {
			return episodeData[i];
		}
	}
}

function changeURL(title, id) {
	history.pushState({}, title + " - Rolando Islas", "/" + getPodcastSlug() + "/" + id);
	document.title = title + " - Rolando Islas";
}

function loadEpisode(data, id) {
	hideComments();
	var id = typeof id !== 'undefined' ? id : $(this).data("id");
	var episode = getEpisodeFromID(id);
	$("#episode-title").html(episode.title);
	$(".audiojs").removeClass("error");
	as[0].pause();
	as[0].load(episode.url);
	$("#episode-notes").html(episode.description);
	$("#episode-notes").html($("#episode-notes").html().replace(/\\(.)/mg, "$1"));
	$("#episode-notes").html($("#episode-notes").html().replace(/\r\n|\r|\n/g, "<br>"));
	$("#episode-notes").html($("#episode-notes").html().autoLink());
	$("#episode").show();
	if (typeof data !== 'undefined') {
		changeURL(episode.title, id);
	}
	$("#disqus_thread").data("id", id);
}

function hideComments() {
	$(".load-comment").show();
	$("#disqus_thread").hide();
}

function loadComments() {
	var id = $("#disqus_thread").data("id");
	if (!isEpisode()) {
		changeURL(getEpisodeFromID(id).title, id);
	}
	$(".load-comment").hide();
	$("#disqus_thread").show();
	var disqus_shortname = 'rolandoislas';
	var disqus_identifier = "podcast-" + getPodcastSlug() + "-" + id;
	var disqus_url = "https://podcast.rolandoislas.com/" + getPodcastSlug() + "/" + id;
	(function() {
		var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	})();
}

function addEvents() {
	$("body").on("click", ".video-chunk", loadEpisode);
	$(".load-comment").click(loadComments);
}

function isEpisode() {
	var path = window.location.pathname.split( '/' );
	if(typeof path[2] != 'undefined' && path[2] != '' && $.isNumeric(path[2])) {
		return true;
	}
	return false;
}

function checkEpisode() {
	if (isEpisode()) {
		var path = window.location.pathname.split( '/' );
		loadEpisode({}, path[2]);
	} else {
		loadEpisode(undefined, episodeData[0]["id"]);
	}
}

function initializeAudioJS() {
	audiojs.events.ready(function() {
		as = audiojs.createAll();
	});
}

$(document).ready(function(){
	initializeAudioJS();
	getEpisodeData();
	getPodcastData();
	addEvents();
});

}()