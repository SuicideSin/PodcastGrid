var Podcast = function(slug) {
	this.DB = require("./DB");
	this.Php = require("../util/Php");
	this.Moment = require("moment");
	this.db = new this.DB();
	this.slug = slug;
};

Podcast.prototype.getEpisodes = function(callback) {
	var query = "SELECT `title`, `description`, `url`, `eid` `id`, `pubdate` FROM `episodes` WHERE `podcast` = $slug ORDER BY `eid` DESC;";
	var that = this;
	this.db.getConnection(function(err, connection) {
		if(err) {
			if (typeof(connection) !== "undefined")
				connection.release();
			return callback(err);
		}
		query = query.replace("$slug", connection.escape(that.slug));
		connection.query(query, function (err, rows) {
			if (err) {
				connection.release();
				return callback(err);
			}
			connection.release();
			return callback(null, rows);
		});
	});
};

Podcast.prototype.getInfo = function(callback) {
	var query = "SELECT `title`, `description`, `icon_180`, `rss`, `itunes`, `contact` FROM `podcasts` WHERE slug = $slug;";
	var that = this;
	this.db.getConnection(function(err, connection) {
		if(err) {
			if (typeof(connection) !== "undefined")
				connection.release();
			return callback(err);
		}
		query = query.replace("$slug", connection.escape(that.slug));
		connection.query(query, function (err, rows) {
			if (err) {
				connection.release();
				return callback(err);
			}
			connection.release();
			return callback(null, rows[0]);
		});
	});
};

Podcast.prototype.getPodcasts = function(callback) {
	var query = "SELECT `title`, `slug`, `description`, `icon_180` FROM `podcasts`;";
	this.db.getConnection(function(err, connection) {
		if(err) {
			if (typeof(connection) !== "undefined")
				connection.release();
			return callback(err);
		}
		connection.query(query, function (err, rows) {
			if (err) {
				connection.release();
				return callback(err);
			}
			connection.release();
			return callback(null, rows);
		});
	});
};

Podcast.prototype.getFeed = function(callback) {
	var that  = this;
	this.getInfo(function(err, info) {
		that.getEpisodes(function(err, episodes) {
			var xml ="<?xml version=\"1.0\" encoding=\"utf-8\"?>"
				+ "<rss version=\"2.0\">"
				+ "<channel>"
				+ "<title>$title</title>".replace("$title", info.title)
				+ "<link>$url/$slug/</link>".replace("$slug", that.slug).replace("$url", process.env.URL)
				+ "<description>$description</description>".replace("$description", info.description);
			episodes.forEach(function(episode) {
				xml += "<item>"
					+ "<title>$title</title>".replace("$title", episode.title)
					+ "<link>$link/$slug/$id/</link>".replace("$link", process.env.URL)
						.replace("$id", episode.id).replace("$slug", that.slug)
					+ "<guid>$guid</guid>".replace("$guid", episode.url)
					+ "<description>$description</description>".replace("$description",
						"<![CDATA[" +
						that.Php.stripslashes(that.Php.nl2br(episode.description.autoLink()))
						+ "]]>")
					+ "<pubDate>$pubdate</pubDate>".replace("$pubdate", 
						new that.Moment(episode.pubdate).utc(-7).format("ddd, DD MMM YYYY HH:mm:ss ZZ"))
					+ "</item>";
			});
			xml += "</channel>"
				+ "</rss>";
			return callback(null, xml);
		});
	});
};

Podcast.prototype.addEpisode = function(title, description, url, callback) {
	var query = "INSERT INTO `episodes` (`uid`, `eid`, `title`, `description`, `url`, `podcast`, `pubdate`)"
		+ "VALUES (NULL, $eid, $title, $description, $url, $slug, CURRENT_TIMESTAMP);";
	var eidQuery = "SELECT `eid` FROM `episodes` WHERE `podcast` = $slug ORDER BY `eid` DESC";
	var that =this;
	this.db.getConnection(function(err, connection) {
		if(err) {
			if (typeof(connection) !== "undefined")
				connection.release();
			return callback(err);
		}
		connection.query(eidQuery.replace("$slug", connection.escape(that.slug)), function(err, eids) {
			if (err) {
				connection.release();
				return callback(err);
			}
			if (eids.length == 0) {
				connection.release();
				return callback(new Error("No slug found"));
			}
			query = query
				.replace("$eid", connection.escape(eids[0].eid + 1))
				.replace("$title", connection.escape(title))
				.replace("$description", connection.escape(description))
				.replace("$url", connection.escape(url))
				.replace("$slug", connection.escape(that.slug));
			connection.query(query, function (err) {
				if (err) {
					connection.release();
					return callback(err);
				}
				connection.release();
				return callback(null);
			});
		});
	});
};

// Auto Link https://github.com/bryanwoods/autolink-js
(function(){var h=[].slice;String.prototype.autoLink=function(){var b,f,d,a,e,g;a=1<=arguments.length?h.call(arguments,0):[];e=/(^|[\s\n]|<br\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;if(!(0<a.length))return this.replace(e,"$1<a href='$2'>$2</a>");d=a[0];f=function(){var c;c=[];for(b in d)g=d[b],"callback"!==b&&c.push(" "+b+"='"+g+"'");return c}().join("");return this.replace(e,function(c,b,a){c=("function"===typeof d.callback?d.callback(a):void 0)||"<a href='"+
a+"'"+f+">"+a+"</a>";return""+b+c})}}).call(this);

module.exports = Podcast;