(function(app) {
	'use strict';

	var Router = Backbone.Router.extend({
		routes: {
			''        : 'main',
			'/'       : 'main',
			'main'    : 'main',
			'stats'   : 'stats',
			'friends' : 'friends',
			'settings': 'settings'
		},
		main: function() {
			console.log('main');
		},
		stats: function() {
			console.log('stats');
		},
		friends: function() {
			console.log('friends');
		},
		settings: function() {
			console.log('settings');
		}
	});

	app.router = new Router();
})(app);
