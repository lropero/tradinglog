(function() {
	'use strict';

	app.databaseController = {
		init: function() {
			this.deferred = $.Deferred();
			if(window.sqlitePlugin) {
				this.db = window.sqlitePlugin.openDatabase({
					name: 'TradingLog',
					location: 2
				});
			} else {
				this.db = window.openDatabase('TradingLog', '1.0', 'TradingLog v1.0', 1024 * 1024);
			}
			// this.reset();
			this.createTables();

			// Remove
			// for(var i = 0; i < 30; i++) {
			// 	this.addRandomTrade();
			// }

			return this.deferred.promise();
		},

		buildInsert: function(table, fields, model) {
			model = model.toJSON();
			var sql = 'INSERT INTO ' + table + ' VALUES (null, ';
			for(var i = 0; i < fields.length; i++) {
				if(model.hasOwnProperty(fields[i])) {
					sql += '"' + model[fields[i]] + '"';
					if(i < fields.length - 1) {
						sql += ', ';
					}
				}
			}
			sql += ');';
			return sql;
		},

		createTables: function() {
			var self = this;
			var sqls = [
				'CREATE TABLE IF NOT EXISTS account (' +
					'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
					'name TEXT,' +
					'balance NUMERIC,' +
					'is_active INTEGER' +
				');',
				'CREATE TABLE IF NOT EXISTS comment (' +
					'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
					'trade_id INTEGER,' +
					'body TEXT,' +
					'created_at INTEGER' +
				');',
				'CREATE TABLE IF NOT EXISTS configuration (' +
					'language TEXT,' +
					'numeric_format INTEGER' +
				');',
				'CREATE TABLE IF NOT EXISTS instrument (' +
					'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
					'type INTEGER,' +
					'name TEXT,' +
					'point_value NUMERIC,' +
					'commission NUMERIC,' +
					'alert INTEGER,' +
					'group_id INTEGER,' +
					'is_deleted INTEGER' +
				');',
				'CREATE TABLE IF NOT EXISTS operation (' +
					'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
					'account_id INTEGER,' +
					'amount NUMERIC,' +
					'description TEXT,' +
					'variation NUMERIC,' +
					'created_at INTEGER' +
				');',
				'CREATE TABLE IF NOT EXISTS position (' +
					'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
					'trade_id INTEGER,' +
					'size INTEGER,' +
					'price NUMERIC,' +
					'created_at INTEGER' +
				');',
				'CREATE TABLE IF NOT EXISTS trade (' +
					'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
					'account_id INTEGER,' +
					'instrument_id INTEGER,' +
					'type INTEGER,' +
					'profit NUMERIC,' +
					'loss NUMERIC,' +
					'commission NUMERIC,' +
					'edit_commission INTEGER,' +
					'variation NUMERIC,' +
					'comments INTEGER,' +
					'closed_at INTEGER' +
				');'
			];
			this.db.transaction(function(tx) {
				$.each(sqls, function(index, sql) {
					tx.executeSql(sql);
				});
			}, null, function() {
				self.deferred.resolve();
			});
		},

		getDB: function() {
			return this.db;
		},

		populateInstruments: function() {
			var sqls = [
				'INSERT INTO instrument VALUES (null, 1, "E-mini S&P 500", 50, 5, 0, 0, 0);',
				'INSERT INTO instrument VALUES (null, 1, "Light Sweet Crude Oil", 1000, 5, 0, 0, 0);',
			];
			this.db.transaction(function(tx) {
				$.each(sqls, function(index, sql) {
					tx.executeSql(sql);
				});
			});
		},

		// Remove
		addRandomTrade: function() {
			var instrument_id = 1;
			var type = Math.floor(Math.random() * 2) + 1;
			var size = Math.floor(Math.random() * 5) + 1;
			var price = Math.floor(Math.random() * 11) + 1000;
			var trades = new app.Collections.trades();

			if(type === 2) {
				size *= -1;
			}
			var trade = new app.Models.trade();
			trade.set({
				account_id: 1,
				instrument_id: instrument_id,
				type: type
			});
			trade.save(null, {
				success: function(model, insertId) {
					var position = new app.Models.position();
					position.set({
						trade_id: insertId,
						size: size,
						price: price,
						created_at: 1420081201000
					});
					var diff = (new Date()).getTime() - 1420081201000;
					position.save(null, {
						success: function() {
							var price2 = Math.floor(Math.random() * 11) + 1000;
							var position2 = new app.Models.position();
							position2.set({
								trade_id: insertId,
								size: (size * -1),
								price: price2,
								created_at: Math.floor(Math.random() * diff) + 1420081201000
							});
							position2.save(null, {
								success: function() {
									trades.setFetchId(insertId);
									trades.fetch({
										success: function () {
											var trade2 = trades.at(0);
											console.log(trade2);
											trade2.deferred.then(function() {
												trade2.setPnL(function() {
													app.objects[app.count.open].isNewest = false;
													app.count.closed++;
													app.objects.splice(app.count.open, 0, trade2.toJSON());
													app.objects[app.count.open].isNewest = true;
													app.cache.delete('main');
													app.cache.delete('mainMap');
													app.cache.delete('mainViewTrade' + app.objects[app.count.open + 1].id);
													app.loadView('main');
												});
											});
										}
									});
								}
							});
						}
					});
				}
			});
		},

		reset: function() {
			this.db.transaction(function(tx) {
				var sql = 'SELECT name FROM sqlite_master WHERE type = "table" AND name NOT LIKE "sqlite_%";';
				tx.executeSql(sql, [], function(tx, results) {
					for(var i = 0; i < results.rows.length; i++) {
						var name = results.rows.item(i).name;
						if(name === '__WebKitDatabaseInfoTable__') {
							continue;
						}
						tx.executeSql('DROP TABLE ' + name + ';');
					}
				});
			});
		}
	};
})();
