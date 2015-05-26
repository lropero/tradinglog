(function() {
	'use strict';

	var tradeDAO = function() {
		this.db = app.databaseController.getDB();
	};

	tradeDAO.prototype = {
		create: function(model, callback) {
			var fields = ['account_id', 'instrument_id', 'type', 'profit', 'loss', 'commission', 'edit_commission', 'variation', 'comments', 'closed_at'];
			this.db.transaction(function(tx) {
				var insert = app.databaseController.buildInsert('trade', fields, model);
				tx.executeSql(insert.sql, insert.parameters, function(tx, results) {
					callback(results.insertId);
				});
			});
		},

		destroy: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'DELETE FROM comment WHERE trade_id = "' + model.id + '";';
				tx.executeSql(sql);
				var sql = 'DELETE FROM position WHERE trade_id = "' + model.id + '";';
				tx.executeSql(sql);
				var sql = 'DELETE FROM trade WHERE id = "' + model.id + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		},

		find: function(model, callback) {
			if(model.id) {
				this.db.transaction(function(tx) {
					var sql = 'SELECT * FROM trade WHERE id = "' + model.id + '";';
					tx.executeSql(sql, [], function(tx, results) {
						if(results.rows.length === 1) {
							var trade = results.rows.item(0);
							callback(trade);
						}
					});
				});
			}
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM trade WHERE account_id = "' + model.account_id + '" AND closed_at == "0" ORDER BY id DESC;';
				tx.executeSql(sql, [], function(tx, results) {
					var trades = [];
					for(var i = 0; i < results.rows.length; i++) {
						trades.push(results.rows.item(i));
					}
					var sql = 'SELECT * FROM trade WHERE account_id = "' + model.account_id + '" AND closed_at > "0" ORDER BY closed_at DESC;';
					tx.executeSql(sql, [], function(tx, results) {
						for(var i = 0; i < results.rows.length; i++) {
							trades.push(results.rows.item(i));
						}
						callback(trades);
					});
				});
			});
		},

		setVariations: function(model, callback) {
			var sqls = [];
			for(var i = 0; i < model.affected.length; i++) {
				var sql = 'UPDATE trade SET variation = "' + model.affected[i].variation + '" WHERE id = "' + model.affected[i].id + '";';
				sqls.push(sql);
			}
			this.db.transaction(function(tx) {
				$.each(sqls, function(index, sql) {
					tx.executeSql(sql);
				});
			});
		},

		update: function(model, callback) {
			model = model.toJSON();
			this.db.transaction(function(tx) {
				var sql = 'UPDATE trade SET account_id = ?, instrument_id = ?, type = ?, profit = ?, loss = ?, commission = ?, edit_commission = ?, variation = ?, comments = ?, closed_at = ? WHERE id = "' + model.id + '";';
				tx.executeSql(sql, [model.account_id, model.instrument_id, model.type, model.profit, model.loss, model.commission, model.edit_commission, model.variation, model.comments, model.closed_at]);
			}, null, function(tx) {
				callback();
			});
		}
	};

	app.DAOs.trade = tradeDAO;
})();
