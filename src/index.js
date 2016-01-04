var Http = require("./web/Http");
var Podcast = require("./data/Podcast");

var port = process.env.PORT;
var  webServer = new Http(port);
// Home
webServer.addGet("/", function(req, res) {
	new Podcast().getPodcasts(function(err, podcasts) {
		res.render("pages/index", {
			title: "Podcasts",
			description: "Podcasts by Rolando Islas."
		});
	});
});
// Podcast Data
webServer.addGet("/ajax/list", function(req, res) {
	new Podcast(req.params.slug).getPodcasts(function(err, list) {
		if (err)
			return res.status(500);
		res.json(list);
	});
});
// Feed
webServer.addGet("/ajax/feed/:slug", function(req, res) {
	new Podcast(req.params.slug).getFeed(function(err, feed) {
		if (err)
			return res.status(500);
		res.type("xml");
		res.send(feed);
	});
});
// Episode Data
webServer.addGet("/ajax/episodes/:slug", function(req, res) {
	new Podcast(req.params.slug).getEpisodes(function(err, episodes) {
		if (err)
			return res.status(500);
		res.json(episodes);
	});
});
// Podcast Data
webServer.addGet("/ajax/info/:slug", function(req, res) {
	new Podcast(req.params.slug).getInfo(function(err, info) {
		if (err)
			return res.status(500);
		res.json(info);
	});
});
// Podcast page
webServer.addGet("/:slug/:episode?", function(req, res, next) {
	// Check if they are files (img, css)
	if (req.params.slug.indexOf(".") > -1 || 
		(typeof(req.params.episode) !== "undefined" && req.params.episode.indexOf(".") > -1))
		return next();
	new Podcast(req.params.slug).getInfo(function(err, info) {
		if (err)
			return res.render("pages/error");
		if (typeof(info) === "undefined")
			return next();
		res.render("pages/podcast", {
			title: info.title,
			description: info.description,
			slug: req.params.slug,
			episode: req.params.episode
		});
	});
});

webServer.run();

process.on("uncaughtException", function(err) {
    console.log("#########");
    console.log(err.stack);
});
