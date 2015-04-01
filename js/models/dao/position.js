(function() {
	'use strict';

	var positionDAO = function() {
		this.db = app.databaseController.getDB();
	};

	positionDAO.prototype = {
		create: function(model, callback) {
			var fields = ['trade_id', 'size', 'price', 'created_at'];
			this.db.transaction(function(tx) {
				var sql = app.databaseController.buildInsert('position', fields, model);
				tx.executeSql(sql, [], function(tx, results) {
					callback(results.insertId);
				});
			});
		},

		destroy: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'DELETE FROM position WHERE id = "' + model.toJSON().id + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		},

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
