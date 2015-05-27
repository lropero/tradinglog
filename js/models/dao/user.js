(function() {
	'use strict';

	var userDAO = function() {
		this.db = app.databaseController.getDB();
	};

	userDAO.prototype = {
		create: function(model, callback) {
			var fields = ['mongo_id', 'name', 'screen_name', 'picture', 'location', 'device'];
			this.db.transaction(function(tx) {
				var insert = app.databaseController.buildInsert('tl_user', fields, model);
				console.log(insert);
				tx.executeSql(insert.sql, insert.parameters, function(tx, results) {
					callback(results.insertId);
				}, function (tx, error) {
					console.log('Oops. Error was ' + error.message + ' (Code ' + error.code + ')');
				});
			});
		},

		destroy: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'DELETE FROM tl_user WHERE id = "' + model.id + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		},

		find: function(model, callback) {
			if(model.id) {
				this.db.transaction(function(tx) {
					var sql = 'SELECT * FROM tl_user WHERE id = "' + model.id + '";';
					tx.executeSql(sql, [], function(tx, results) {
						if(results.rows.length === 1) {
							var user = results.rows.item(0);
							callback(user);
						}
					});
				});
			}
		},

		findAll: function(callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM tl_user ORDER BY id;';
				tx.executeSql(sql, [], function(tx, results) {
					var users = [];
					for(var i = 0; i < results.rows.length; i++) {
						users.push(results.rows.item(i));
					}
					callback(users);
				});
			});
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM tl_user WHERE';
				if(model.screen_name) {
					sql += 'lower(name) = "' + model.screen_name.toLowerCase() + '";';
				}
				tx.executeSql(sql, [], function(tx, results) {
					var users = [];
					for(var i = 0; i < results.rows.length; i++) {
						users.push(results.rows.item(i));
					}
					callback(accounts);
				});
			});
		},

		update: function(model, callback) {
			model = model.toJSON();
			this.db.transaction(function(tx) {
				var sql = 'UPDATE tl_user SET name = ?, screen_name = ?, picture = ?, location = ?, WHERE id = "' + model.id + '";';
				tx.executeSql(sql, [model.name, model.screen_name, model.picture, model.location]);
				callback();
			});
		}
	};

	app.DAOs.user = userDAO;
})();