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
				'INSERT INTO instrument VALUES (null, 2, "Apple Inc.", 1, 0, 1, 1, 0);',
				'INSERT INTO instrument VALUES (null, 2, "Google Inc.", 1, 0, 1, 1, 0);',
				'INSERT INTO instrument VALUES (null, 2, "Microsoft Corporation", 1, 0, 1, 2, 0);',

				'INSERT INTO trade VALUES (null, 1, 1, 1, 225, 0, 4.32, 0, 2.21, 0, 1424869200000);',
				'INSERT INTO position VALUES (null, 1, 1, 1000, 1424869200000);',
				'INSERT INTO position VALUES (null, 1, -1, 1000, 1424869200000);',

				'INSERT INTO trade VALUES (null, 1, 2, 1, 0, 100, 4.88, 0, -1.03, 0, 1425042000000);',
				'INSERT INTO position VALUES (null, 2, 1, 1000, 1425042000000);',
				'INSERT INTO position VALUES (null, 2, -1, 1000, 1425042000000);',

				'INSERT INTO trade VALUES (null, 1, 2, 2, 170, 0, 4.88, 0, 1.63, 0, 1425387600000);',
				'INSERT INTO position VALUES (null, 3, 1, 1000, 1425387600000);',
				'INSERT INTO position VALUES (null, 3, -1, 1000, 1425387600000);',

				'INSERT INTO trade VALUES (null, 1, 4, 1, 102.34, 0, 5, 0, 0.95, 0, 1425474000000);',
				'INSERT INTO position VALUES (null, 4, 1, 1000, 1425474000000);',
				'INSERT INTO position VALUES (null, 4, -1, 1000, 1425474000000);',

				'INSERT INTO trade VALUES (null, 1, 1, 2, 0, 187.5, 4.32, 0, -1.85, 0, 1425906000000);',
				'INSERT INTO position VALUES (null, 5, 1, 1000, 1425906000000);',
				'INSERT INTO position VALUES (null, 5, -1, 1000, 1425906000000);',

				'INSERT INTO trade VALUES (null, 1, 1, 1, 312.5, 0, 4.32, 0, 3.03, 0, 1426165200000);',
				'INSERT INTO position VALUES (null, 6, 1, 1000, 1426165200000);',
				'INSERT INTO position VALUES (null, 6, -1, 1000, 1426165200000);',

				'INSERT INTO trade VALUES (null, 1, 5, 1, 0, 119.89, 5, 0, -1.19, 0, 1426251600000);',
				'INSERT INTO position VALUES (null, 7, 1, 1000, 1426251600000);',
				'INSERT INTO position VALUES (null, 7, -1, 1000, 1426251600000);',

				'INSERT INTO trade VALUES (null, 1, 2, 2, 0, 140, 4.88, 0, -1.40, 0, 1426597200000);',
				'INSERT INTO position VALUES (null, 8, 1, 1000, 1426597200000);',
				'INSERT INTO position VALUES (null, 8, -1, 1000, 1426597200000);',

				'INSERT INTO trade VALUES (null, 1, 1, 2, 275, 0, 4.32, 0, 2.65, 0, 1426770000000);',
				'INSERT INTO position VALUES (null, 9, 1, 1000, 1426770000000);',
				'INSERT INTO position VALUES (null, 9, -1, 1000, 1426770000000);',

				'INSERT INTO trade VALUES (null, 1, 3, 1, 220.42, 0, 5, 0, 2.05, 0, 1427288400000);',
				'INSERT INTO position VALUES (null, 10, 1, 1000, 1427288400000);',
				'INSERT INTO position VALUES (null, 10, -1, 1000, 1427288400000);',

				'INSERT INTO trade VALUES (null, 1, 4, 1, 0, 181.56, 5, 0, -1.74, 0, 1427292000000);',
				'INSERT INTO position VALUES (null, 11, 1, 1000, 1427292000000);',
				'INSERT INTO position VALUES (null, 11, -1, 1000, 1427292000000);',

				'INSERT INTO trade VALUES (null, 1, 2, 1, 0, 100, 4.88, 0, -1.00, 0, 1427461200000);',
				'INSERT INTO position VALUES (null, 12, 1, 1000, 1427461200000);',
				'INSERT INTO position VALUES (null, 12, -1, 1000, 1427461200000);',

				'INSERT INTO operation VALUES (null, 1, 300, "", 2.88, 1427979600000);',

				'INSERT INTO trade VALUES (null, 1, 1, 1, 250, 0, 4.32, 0, 2.29, 0, 1428411600000);',
				'INSERT INTO position VALUES (null, 13, 1, 1000, 1428411600000);',
				'INSERT INTO position VALUES (null, 13, -1, 1000, 1428411600000);',

				'INSERT INTO trade VALUES (null, 1, 1, 2, 0, 175, 8.64, 0, -1.67, 0, 1428498000000);',
				'INSERT INTO position VALUES (null, 14, 1, 1000, 1428498000000);',
				'INSERT INTO position VALUES (null, 14, -1, 1000, 1428498000000);',

				'INSERT INTO trade VALUES (null, 1, 4, 1, 122.57, 0, 5, 0, 1.09, 0, 1428930000000);',
				'INSERT INTO position VALUES (null, 15, 1, 1000, 1428930000000);',
				'INSERT INTO position VALUES (null, 15, -1, 1000, 1428930000000);',

				'INSERT INTO trade VALUES (null, 1, 5, 1, 0, 88, 5, 0, -0.85, 0, 1429102800000);',
				'INSERT INTO position VALUES (null, 16, 1, 1000, 1429102800000);',
				'INSERT INTO position VALUES (null, 16, -1, 1000, 1429102800000);',

				'INSERT INTO trade VALUES (null, 1, 2, 2, 270, 0, 9.76, 0, 2.41, 0, 1429106400000);',
				'INSERT INTO position VALUES (null, 17, 1, 1000, 1429106400000);',
				'INSERT INTO position VALUES (null, 17, -1, 1000, 1429106400000);',

				'INSERT INTO trade VALUES (null, 1, 2, 2, 0, 120, 4.88, 0, -1.13, 0, 1429275600000);',
				'INSERT INTO position VALUES (null, 18, 1, 1000, 1429275600000);',
				'INSERT INTO position VALUES (null, 18, -1, 1000, 1429275600000);',

				'INSERT INTO trade VALUES (null, 1, 1, 1, 112.5, 0, 4.32, 0, 0.99, 1, 1429627260000);',
				'INSERT INTO position VALUES (null, 19, 1, 2103.25, 1429621380000);',
				'INSERT INTO position VALUES (null, 19, -1, 2105.5, 1429627260000);',

				'INSERT INTO comment VALUES (null, 19, "Higher volume with no progress to the upside.", 1429627440000);',

				'INSERT INTO trade VALUES (null, 1, 3, 1, 199.97, 0, 5, 0, 1.76, 0, 1429707600000);',
				'INSERT INTO position VALUES (null, 20, 1, 1000, 1429707600000);',
				'INSERT INTO position VALUES (null, 20, -1, 1000, 1429707600000);',

				'UPDATE account SET balance = "11244.63";',
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
