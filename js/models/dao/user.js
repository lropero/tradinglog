(function() {
	'use strict';

	var userDAO = function() {
		this.db = app.databaseController.getDB();
	};

	userDAO.prototype = {
		create: function(model, callback) {
			var self = this;
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM user WHERE ';
				if(model.me) {
					sql += 'me = "1"';
				} else {
					sql += 'alias = "' + model.alias + '"';
				}
				sql += ';';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 0) {
						var fields = ['alias', 'avatar', 'name', 'me'];
						var insert = app.databaseController.buildInsert('user', fields, model);
						tx.executeSql(insert.sql, insert.parameters, function(tx, results) {
							callback();
						});
					} else {
						self.update(model, callback);
					}
				});
			});
		},

		find: function(model, callback) {
			if(model.me) {
				this.db.transaction(function(tx) {
					var sql = 'SELECT * FROM user WHERE me = "1";';
					tx.executeSql(sql, [], function(tx, results) {
						if(results.rows.length === 1) {
							var user = results.rows.item(0);
							callback(user);
						}
					});
				});
			}
		},

		update: function(model, callback) {
			model = model.toJSON();
			this.db.transaction(function(tx) {
				var sql = 'UPDATE user SET alias = ?, avatar = ?, name = ?, me = ? WHERE ';
				if(model.me) {
					sql += 'me = "1"';
				} else {
					sql += 'alias = "' + model.alias + '"';
				}
				sql += ';';
				tx.executeSql(sql, [model.html, model.extra, model.is_obsolete]);
				callback();
			});
		}
	};

	app.DAOs.user = userDAO;
})();
