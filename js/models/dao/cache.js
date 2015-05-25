(function() {
	'use strict';

	var cacheDAO = function() {
		this.db = app.databaseController.getDB();
	};

	cacheDAO.prototype = {
		create: function(model, callback) {
			var self = this;
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM cache;';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 0) {
						var fields = ['availables', 'count', 'dates', 'objects'];
						var insert = app.databaseController.buildInsert('cache', fields, model);
						tx.executeSql(insert.sql, insert.parameters, function(tx, results) {
							callback();
						});
					} else {
						self.update(model, callback);
					}
				});
			});
		},

		findAll: function(callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM cache;';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 1) {
						var cache = results.rows.item(0);
						callback(cache);
					} else {
						callback();
					}
				});
			});
		},

		update: function(model, callback) {
			model = model.toJSON();
			this.db.transaction(function(tx) {
				var sql = 'UPDATE cache SET availables = ?, count = ?, dates = ?, objects = ? WHERE id = "1";';
				tx.executeSql(sql, [model.availables, model.count, model.dates, model.objects]);
				callback();
			});
		}
	};

	app.DAOs.cache = cacheDAO;
})();
