(function() {
	'use strict';

	var commentDAO = function() {
		this.db = app.databaseController.getDB();
	};

	commentDAO.prototype = {
		create: function(model, callback) {
			var fields = ['trade_id', 'body', 'created_at'];
			this.db.transaction(function(tx) {
				var sql = app.databaseController.buildInsert('comment', fields, model);
				tx.executeSql(sql, [], function(tx, results) {
					callback(results.insertId);
				});
			});
		},

		destroy: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'DELETE FROM comment WHERE id = "' + model.id + '";';
				tx.executeSql(sql);
			}, null, function(tx) {
				callback();
			});
		},

		find: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM comment WHERE id = "' + model.id + '";';
				tx.executeSql(sql, [], function(tx, results) {
					if(results.rows.length === 1) {
						var comment = results.rows.item(0);
						callback(comment);
					}
				});
			});
		},

		findSet: function(model, callback) {
			this.db.transaction(function(tx) {
				var sql = 'SELECT * FROM comment WHERE trade_id = "' + model.trade_id + '" ORDER BY created_at;';
				tx.executeSql(sql, [], function(tx, results) {
					var comments = [];
					for(var i = 0; i < results.rows.length; i++) {
						comments.push(results.rows.item(i));
					}
					callback(comments);
				});
			});
		}
	};

	app.DAOs.comment = commentDAO;
})();
