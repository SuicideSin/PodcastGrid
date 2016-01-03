var DB = function() {
	this.Mysql = require("mysql");
	this.cache = require("../util/Cache");
	this.pool = getPoolFromCache(this);
};

function getPoolFromCache(that) {
	if (typeof(that.cache.get("dbPool")) !== "undefined")
		return that.cache.get("dbPool");
	var connectionLimit = process.env.DATABASE_CONNECTION_LIMIT;
	var pool = that.Mysql.createPool(process.env.DATABASE_URL + "?connectionLimit=" + connectionLimit + "&multipleStatements=true&debug=false&reconnect=true");
	that.cache.set("dbPool", pool);
	return pool;
}

DB.prototype.getPool = function() {
	return this.pool;
};

DB.prototype.getConnection = function(callback) {
	var that = this;
	this.getPool().getConnection(function(err, connection) {
		if (err) {
			if (typeof(connection) !== "undefined")
				connection.release();
			return callback(err);
		}
		return callback(null, connection);
	});
};

module.exports = DB;