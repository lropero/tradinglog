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
			this.reset();
			this.createTables();
			this.populateDemo();
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
					'created_at INTEGER,' +
					'image TEXT' +
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

		populateDemo: function() {
			var sqls = [
				'INSERT INTO account VALUES (null, "Demo", 5000, 1);',
				'INSERT INTO instrument VALUES (null, 0, "E-mini S&P 500", 50, 4.24, 0, 0);',
				'INSERT INTO instrument VALUES (null, 0, "Light Sweet Crude Oil", 1000, 4.84, 0, 0);',
				'INSERT INTO operation VALUES (null, 1, 5000, "Initial deposit.", 0, 1427228655168);',
				// 'INSERT INTO trade VALUES (null, 1, 1, 0, 500, 200, 8.48, 5.83, 3, 1426273045);',
				// 'INSERT INTO trade VALUES (null, 1, 1, 0, 0, 112.5, 4.24, -2, 0, 1426283045);',
				// 'INSERT INTO trade VALUES (null, 1, 2, 1, 300, 0, 4.84, 3, 1, 1426293045);',
				// 'INSERT INTO trade VALUES (null, 1, 1, 1, 500, 200, 8.48, 5.83, 3, 0);',
				// 'INSERT INTO trade VALUES (null, 1, 1, 1, 0, 100, 4.24, -2, 0, 1426303045);',
				// 'INSERT INTO trade VALUES (null, 1, 2, 0, 300, 0, 4.84, 3, 1, 0);',
				// 'INSERT INTO position VALUES (null, 1, 2, 250, 1426283045);',
				// 'INSERT INTO position VALUES (null, 1, -1, 250, 1426293045);',
				// 'INSERT INTO position VALUES (null, 2, 2, 250, 1426283045);',
				// 'INSERT INTO position VALUES (null, 2, -1, 250, 1426293045);',
				// 'INSERT INTO position VALUES (null, 4, 2, 250, 1426283045);',
				// 'INSERT INTO position VALUES (null, 4, -1, 250, 1426293045);',
				// 'INSERT INTO position VALUES (null, 4, -1, 250, 1426293045);'
				'INSERT INTO trade VALUES (null, 1, 1, 1, 500, 200, 8.48, 5.83, 3, 0);',
				'INSERT INTO trade VALUES (null, 1, 2, 2, 0, 0, 0, 0, 0, 0);',
				'INSERT INTO trade VALUES (null, 1, 1, 1, 0, 0, 0, 0, 0, 0);',
				'INSERT INTO position VALUES (null, 1, 5, 1000, 1427228155168);',
				'INSERT INTO position VALUES (null, 2, -1, 1200, 1427228255168);',
				'INSERT INTO position VALUES (null, 2, -2, 800, 1427228355168);',
				'INSERT INTO position VALUES (null, 3, 2, 700, 1427228455168);',
				'INSERT INTO position VALUES (null, 1, -1, 1500, 1427228555168);'
			];
			this.db.transaction(function(tx) {
				$.each(sqls, function(index, sql) {
					tx.executeSql(sql);
				});
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
