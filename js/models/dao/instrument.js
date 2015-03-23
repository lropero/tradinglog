(function() {
	'use strict';

	var instrumentDAO = function() {
		this.db = app.databaseController.getDB();
	};

	instrumentDAO.prototype = {
		find: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM instrument WHERE id = "' + model.id + '";';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 1) {
						var trade = results.rows.item(0);
						callback(trade);
					}
				});
			});
		},

		findAll: function(callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM instrument ORDER BY id;';
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

	app.DAOs.instrument = instrumentDAO;
})();
