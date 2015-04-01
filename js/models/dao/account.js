(function() {
	'use strict';

	var accountDAO = function() {
		this.db = app.databaseController.getDB();
	};

	accountDAO.prototype = {
		find: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM account WHERE id = "' + model.id + '";';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 1) {
						var account = results.rows.item(0);
						callback(account);
					}
				});
			});
		},

		findAll: function(callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM account ORDER BY id;';
				tx.executeSql(sql, [], function(tx, results) {
					var accounts = [];
					for(var i = 0; i < results.rows.length; i++) {
						accounts[i] = results.rows.item(i);
					}
					callback(accounts);
				});
			});
		},

		update: function(model, callback) {
			model = model.toJSON();
			this.db.transaction(function(tx) {
				var sql = 'UPDATE account SET name = "' + model.name + '", balance = "' + model.balance + '", is_active = "' + parseInt(model.is_active, 10) + '" WHERE id = "' + model.id + '";';
				tx.executeSql(sql);
				callback();
			});
		}
	};

	app.DAOs.account = accountDAO;
})();