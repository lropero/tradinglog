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
			return this.deferred;
		},

		buildInsert: function(table, fields, model) {
			model = model.toJSON();
			var sql = 'INSERT INTO ' + table + ' VALUES (null, ';
			var parameters = [];
			for(var i = 0; i < fields.length; i++) {
				if(model.hasOwnProperty(fields[i])) {
					sql += '?';
					if(i < fields.length - 1) {
						sql += ', ';
					}
					parameters.push(model[fields[i]]);
				}
			}
			sql += ');';
			return {
				sql: sql,
				parameters: parameters
			};
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
				'CREATE TABLE IF NOT EXISTS cache (' +
					'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
					'account_id INTEGER,' +
					'availables TEXT,' +
					'count TEXT,' +
					'dates TEXT,' +
					'objects TEXT' +
				');',
				'CREATE TABLE IF NOT EXISTS comment (' +
					'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
					'trade_id INTEGER,' +
					'body TEXT,' +
					'created_at INTEGER' +
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
				'CREATE TABLE IF NOT EXISTS stats (' +
					'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
					'account_id INTEGER,' +
					'name TEXT,' +
					'data TEXT,' +
					'is_obsolete INTEGER' +
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
				');',
				'CREATE TABLE IF NOT EXISTS view (' +
					'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
					'name TEXT,' +
					'html TEXT,' +
					'extra TEXT,' +
					'is_obsolete INTEGER' +
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
				'INSERT INTO instrument VALUES (null, 2, "Apple Inc.", 1, 0, 1, 0, 0);',
				'INSERT INTO instrument VALUES (null, 2, "Google Inc.", 1, 0, 1, 1, 0);',
				'INSERT INTO instrument VALUES (null, 2, "Microsoft Corporation", 1, 0, 1, 1, 0);',
				'INSERT INTO instrument VALUES (null, 3, "EUR/USD", 1, 0, 0, 2, 0);'
			];
			this.db.transaction(function(tx) {
				$.each(sqls, function(index, sql) {
					tx.executeSql(sql);
				});
			});
		},

		reset: function(callback) {
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
			}, null, function() {
				callback();
			});
		}
	};
})();
