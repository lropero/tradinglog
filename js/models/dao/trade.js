(function() {
	'use strict';

	var tradeDAO = function() {
		this.db = app.databaseController.getDB();
	};

	tradeDAO.prototype = {
		findAll: function(callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM trade ORDER BY closed_at, id DESC;';
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
