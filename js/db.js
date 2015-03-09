(function() {
	'use strict';

	var DatabaseController = function() {};

	DatabaseController.prototype = {
		init: function() {
			// if(typeof window.sqlitePlugin !== 'undefined') {
			// 	// $('#main-stats-friends').empty().append(typeof window.sqlitePlugin);
			// 	// var db = window.sqlitePlugin.openDatabase({
			// 	// 	name: 'TradingLog',
			// 	// 	location: 2
			// 	// });
			// } else {
			// 	// $('#main-stats-friends').empty().append('WEB SQL<br />');
			// 	// var db = window.openDatabase('TradingLog', '1.0', 'TradingLog v1.0', 1024 * 1024);
			// }
		}
	};

	$('#main-stats-friends').append(typeof DatabaseController + '1<br />');
	app.db = new DatabaseController();
	$('#main-stats-friends').append(typeof app.db + '2<br />');
})();
