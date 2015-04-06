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
						var instrument = results.rows.item(0);
						callback(instrument);
					}
				});
			});
		},

		findAll: function(callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM instrument ORDER BY id;';
				tx.executeSql(sql, [], function(tx, results) {
					var instruments = [];
					for(var i = 0; i < results.rows.length; i++) {
						instruments.push(results.rows.item(i));
					}
					callback(instruments);
				});
			});
		}
	};

	app.DAOs.instrument = instrumentDAO;
})();
