var Podcast = function(slug) {
	this.DB = require("./DB");
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
			return callback(null, rows);
		});
	});
};

module.exports = Podcast;