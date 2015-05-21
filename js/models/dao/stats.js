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
						var fields = ['name', 'data', 'is_obsolete'];
						var insert = app.databaseController.buildInsert('stats', fields, model);
						tx.executeSql(insert.sql, insert.parameters, function(tx, results) {
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
				var sql = 'UPDATE stats SET is_obsolete = "1" WHERE name = "' + model.get('name') + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM stats WHERE name = "' + model.name + '" AND is_obsolete = "0";';
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

		update: function(model, callback) {
			model = model.toJSON();
			this.db.transaction(function(tx) {
				var sql = 'UPDATE stats SET data = ?, is_obsolete = ? WHERE name = "' + model.name + '";';
				tx.executeSql(sql, [model.data, model.is_obsolete]);
				callback();
			});
		}
	};

	app.DAOs.stats = statsDAO;
})();
