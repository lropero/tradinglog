(function() {
	'use strict';

	var DatabaseController = function() {};

	DatabaseController.prototype = {
		init: function() {
			if(typeof window.sqlitePlugin !== 'undefined') {
				$('#main-stats-friends').empty().append('SQLITE<br />');
				// var db = window.sqlitePlugin.openDatabase({
				// 	name: 'TradingLog',
				// 	location: 2
				// });
			} else {
				$('#main-stats-friends').empty().append('WEB SQL<br />');
				// var db = window.openDatabase('TradingLog', '1.0', 'TradingLog v1.0', 1024 * 1024);
			}
		}
	};

	app.db = new DatabaseController();
})();
