(function() {
	'use strict';

	var positionDAO = function() {
		this.db = app.databaseController.getDB();
	};

	positionDAO.prototype = {
		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM position WHERE trade_id = "' + model.trade_id + '";';
				tx.executeSql(sql, [], function(tx, results) {
					var positions = [];
					for(var i = 0; i < results.rows.length; i++) {
						positions[i] = results.rows.item(i);
					}
					callback(positions);
				});
			});
		}
	};

	app.DAOs.position = positionDAO;
})();
