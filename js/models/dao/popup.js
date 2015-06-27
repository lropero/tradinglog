(function() {
	'use strict';

	var popupDAO = function() {
		this.db = app.databaseController.getDB();
	};

	popupDAO.prototype = {
		create: function(model, callback) {
			var fields = ['name'];
			this.db.transaction(function(tx) {
				var insert = app.databaseController.buildInsert('popup', fields, model);
				tx.executeSql(insert.sql, insert.parameters, function(tx, results) {
					callback();
				});
			});
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM popup WHERE name = "' + model.name + '";';
				tx.executeSql(sql, [], function(tx, results) {
					if(!results.rows.length) {
						callback();
					}
				});
			});
		}
	};

	app.DAOs.popup = popupDAO;
})();
