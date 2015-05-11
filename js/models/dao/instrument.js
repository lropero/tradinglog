(function() {
	'use strict';

	var instrumentDAO = function() {
		this.db = app.databaseController.getDB();
	};

	instrumentDAO.prototype = {
		create: function(model, callback) {
			var fields = ['type', 'name', 'point_value', 'commission', 'alert', 'group_id', 'is_deleted'];
			this.db.transaction(function(tx) {
				var sql = app.databaseController.buildInsert('instrument', fields, model);
				tx.executeSql(sql, [], function(tx, results) {
					callback(results.insertId);
				});
			});
		},

		destroy: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'UPDATE instrument SET is_deleted = "1" WHERE id = "' + model.id + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		},

		find: function(model, callback) {
			if(model.id) {
				this.db.transaction(function(tx) {
					var sql = 'SELECT * FROM instrument WHERE id = "' + model.id + '";';
					tx.executeSql(sql, [], function(tx, results) {
						if(results.rows.length === 1) {
							var instrument = results.rows.item(0);
							callback(instrument);
						}
					});
				});
			}
		},

		findAll: function(callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM instrument WHERE is_deleted = "0" ORDER BY name;';
				tx.executeSql(sql, [], function(tx, results) {
					var instruments = [];
					for(var i = 0; i < results.rows.length; i++) {
						instruments.push(results.rows.item(i));
					}
					callback(instruments);
				});
			});
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM instrument WHERE name = "' + model.name + '" AND is_deleted = "0";';
				tx.executeSql(sql, [], function(tx, results) {
					var instruments = [];
					for(var i = 0; i < results.rows.length; i++) {
						instruments.push(results.rows.item(i));
					}
					callback(instruments);
				});
			});
		},

		update: function(model, callback) {
			model = model.toJSON();
			this.db.transaction(function(tx) {
				var sql = 'UPDATE instrument SET type = "' + model.type + '", name = "' + model.name + '", point_value = "' + model.point_value + '", commission = "' + model.commission + '", alert = "' + model.alert + '", group_id = "' + model.group_id + '", is_deleted = "' + model.is_deleted + '" WHERE id = "' + model.id + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		}
	};

	app.DAOs.instrument = instrumentDAO;
})();
