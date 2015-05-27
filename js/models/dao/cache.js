(function() {
	'use strict';

	var cacheDAO = function() {
		this.db = app.databaseController.getDB();
	};

	cacheDAO.prototype = {
		create: function(model, callback) {
			var self = this;
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM cache WHERE account_id = "' + model.get('account_id') + '";';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 0) {
						var fields = ['account_id', 'availables', 'count', 'dates', 'objects'];
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

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM cache WHERE account_id = "' + model.account_id + '";';
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
				var sql = 'UPDATE cache SET availables = ?, count = ?, dates = ?, objects = ? WHERE account_id = "' + model.account_id + '";';
				tx.executeSql(sql, [model.availables, model.count, model.dates, model.objects]);
				callback();
			});
		}
	};

	app.DAOs.cache = cacheDAO;
})();
