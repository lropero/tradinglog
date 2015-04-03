(function() {
	'use strict';

	var tradeDAO = function() {
		this.db = app.databaseController.getDB();
	};

	tradeDAO.prototype = {
		create: function(model, callback) {
			var fields = ['account_id', 'instrument_id', 'type', 'profit', 'loss', 'commission', 'variation', 'comments', 'closed_at'];
			this.db.transaction(function(tx) {
				var sql = app.databaseController.buildInsert('trade', fields, model);
				tx.executeSql(sql, [], function(tx, results) {
					callback(results.insertId);
				});
			});
		},

		destroy: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'DELETE FROM trade WHERE id = "' + model.toJSON().id + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		},

		find: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM trade WHERE id = "' + model.id + '";';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 1) {
						var trade = results.rows.item(0);
						callback(trade);
					}
				});
			});
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM trade WHERE account_id = "' + model.account_id + '" ORDER BY closed_at, id DESC;';
				tx.executeSql(sql, [], function(tx, results) {
					var trades = [];
					for(var i = 0; i < results.rows.length; i++) {
						trades[i] = results.rows.item(i);
					}
					callback(trades);
				});
			});
		}
	};

	app.DAOs.trade = tradeDAO;
})();
