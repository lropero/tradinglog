(function() {
	'use strict';

	var statsDAO = function() {
		this.db = app.databaseController.getDB();
	};

	statsDAO.prototype = {
		create: function(model, callback) {
			var self = this;
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM stats WHERE name = "' + model.get('name') + '";';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 0) {
						var fields = ['name', 'data', 'created_at'];
						sql = app.databaseController.buildInsert('stats', fields, model);
						tx.executeSql(sql, [], function(tx, results) {
							callback();
						});
					} else {
						self.update(model, callback);
					}
				});
			});
		},

		destroy: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'DELETE FROM stats WHERE name = "' + model.name + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM stats WHERE name = "' + model.name + '";';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 1) {
						var stats = results.rows.item(0);
						callback(stats);
					} else {
						callback();
					}
				});
			});
		},

		sweep: function() {
			var timestamp = (new Date()).getTime() - (100 * 24 * 60 * 60 * 1000);
			this.db.transaction(function(tx) {
				var sql = 'DELETE FROM stats WHERE created_at < "' + timestamp + '";';
				tx.executeSql(sql);
			});
		},

		update: function(model, callback) {
			model = model.toJSON();
			this.db.transaction(function(tx) {
				var sql = 'UPDATE stats SET data = "' + model.data + '", created_at = "' + model.created_at + '" WHERE name = "' + model.name + '";';
				tx.executeSql(sql);
				callback();
			});
		}
	};

	app.DAOs.stats = statsDAO;
})();
