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
						var fields = ['name', 'html', 'extra', 'is_obsolete'];
						var insert = app.databaseController.buildInsert('view', fields, model);
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
				var sql = 'UPDATE view SET is_obsolete = "1" WHERE name = "' + model.get('name') + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM view WHERE name = "' + model.name + '" AND is_obsolete = "0";';
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
				var sql = 'UPDATE view SET html = ?, extra = ?, is_obsolete = ? WHERE name = "' + model.name + '";';
				tx.executeSql(sql, [model.html, model.extra, model.is_obsolete]);
				callback();
			});
		}
	};

	app.DAOs.view = viewDAO;
})();
