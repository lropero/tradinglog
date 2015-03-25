(function() {
	'use strict';

	var operationDAO = function() {
		this.db = app.databaseController.getDB();
	};

	operationDAO.prototype = {
		create: function(model, callback) {
			var fields = ['account_id', 'amount', 'description', 'variation', 'created_at'];
			this.db.transaction(function(tx) {
				var sql = app.databaseController.buildInsert('operation', fields, model);
				tx.executeSql(sql, [], function(tx, results) {
					callback(results.insertId);
				});
			});
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM operation WHERE account_id = "' + model.account_id + '" ORDER BY created_at DESC;';
				tx.executeSql(sql, [], function(tx, results) {
					var operations = [];
					for(var i = 0; i < results.rows.length; i++) {
						operations[i] = results.rows.item(i);
					}
					callback(operations);
				});
			});
		}
	};

	app.DAOs.operation = operationDAO;
})();
