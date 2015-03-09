(function() {
	'use strict';

	var DatabaseController = function() {};

	DatabaseController.prototype = {
		init: function() {
			if(typeof window.sqlitePlugin !== 'undefined') {
				var db = window.sqlitePlugin.openDatabase({
					name: 'TradingLog',
					location: 2
				});
			} else {
				var db = window.openDatabase('TradingLog', '1.0', 'TradingLog v1.0', 1024 * 1024);
			}
		}
	};

	app.db = new DatabaseController();
})();
