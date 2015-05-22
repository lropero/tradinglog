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

		findIds: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM trade WHERE ';
				for(var i = 0; i < model.ids.length; i++) {
					sql += 'id = "' + model.ids[i] + '"';
					if(i + 1 < model.ids.length) {
						sql += ' OR ';
					}
				}
				sql += ';';
				tx.executeSql(sql, [], function(tx, results) {
					var trades = [];
					for(var i = 0; i < results.rows.length; i++) {
						trades.push(results.rows.item(i));
					}
					callback(trades);
				});
			});
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				if(model.range) {
					var sql = 'SELECT * FROM trade WHERE account_id = "' + model.account_id + '" AND closed_at >= "' + model.from + '" AND closed_at <= "' + model.to + '" ORDER BY closed_at;';
					tx.executeSql(sql, [], function(tx, results) {
						var trades = [];
						var instruments = {};
						for(var i = 0; i < results.rows.length; i++) {
							if(model.groups) {
								var instrument_id = results.rows.item(i).instrument_id;
								if(!instruments[instrument_id]) {
									instruments[instrument_id] = [];
								}
								instruments[instrument_id].push(i);
							} else {
								trades.push(results.rows.item(i));
							}
						}
						var deferreds = [];
						var instrumentsCollection = new app.Collections.instruments();
						$.each(instruments, function(index, value) {
							var deferred = $.Deferred();
							instrumentsCollection.setFetchId(index);
							instrumentsCollection.fetch({
								success: function() {
									var instrument = instrumentsCollection.at(0);
									var group_id = instrument.get('group_id').toString();
									for(var i = 0; i < value.length; i++) {
										if($.inArray(group_id, model.groups) > -1) {
											trades.push(results.rows.item(value[i]));
										}
									}
									deferred.resolve();
								}
							});
							deferreds.push(deferred);
						});
						$.when.apply($, deferreds).done(function() {
							callback(trades);
						});
					});
				} else {
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
				}
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
