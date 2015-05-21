(function() {
	'use strict';

	var operationDAO = function() {
		this.db = app.databaseController.getDB();
	};

	operationDAO.prototype = {
		create: function(model, callback) {
			var fields = ['account_id', 'amount', 'description', 'variation', 'created_at'];
			this.db.transaction(function(tx) {
				var insert = app.databaseController.buildInsert('operation', fields, model);
				tx.executeSql(insert.sql, insert.parameters, function(tx, results) {
					callback(results.insertId);
				});
			});
		},

		destroy: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'DELETE FROM operation WHERE id = "' + model.id + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		},

		find: function(model, callback) {
			if(model.id) {
				this.db.transaction(function(tx) {
					var sql = 'SELECT * FROM operation WHERE id = "' + model.id + '";';
					tx.executeSql(sql, [], function(tx, results) {
						if(results.rows.length === 1) {
							var operation = results.rows.item(0);
							callback(operation);
						}
					});
				});
			}
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM operation WHERE account_id = "' + model.account_id + '" ORDER BY created_at DESC;';
				tx.executeSql(sql, [], function(tx, results) {
					var operations = [];
					for(var i = 0; i < results.rows.length; i++) {
						operations.push(results.rows.item(i));
					}
					callback(operations);
				});
			});
		}
	};

	app.DAOs.operation = operationDAO;
})();
