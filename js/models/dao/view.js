(function() {
	'use strict';

	var viewDAO = function() {
		this.db = app.databaseController.getDB();
	};

	viewDAO.prototype = {
		create: function(model, callback) {
			var self = this;
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM view WHERE name = "' + model.get('name') + '";';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 0) {
						var fields = ['name', 'html', 'extra'];
						sql = app.databaseController.buildInsert('view', fields, model);
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
				var sql = 'DELETE FROM view WHERE name = "' + model.get('name') + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM view WHERE name = "' + model.name + '";';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 1) {
						var view = results.rows.item(0);
						callback(view);
					} else {
						callback();
					}
				});
			});
		},

		update: function(model, callback) {
			model = model.toJSON();
			this.db.transaction(function(tx) {
				var sql = 'UPDATE view SET html = "' + model.html + '", extra = "' + model.extra + '" WHERE name = "' + model.name + '";';
				tx.executeSql(sql);
				callback();
			});
		}
	};

	app.DAOs.view = viewDAO;
})();
