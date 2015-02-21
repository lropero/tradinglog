(function() {
	'use strict';

	window.app = {
		shake: new Shake({
			frequency: 300,
			waitBetweenShakes: 1000,
			threshold: 12,
			success: function(magnitude, accelerationDelta, timestamp) {
				app.router.navigate('friends', {trigger: true});
			},
			failure: function() {}
		}),
		Views: {},
		initialize: function() {
			this.bindEvents();
		},
		bindEvents: function() {
			document.addEventListener('deviceready', this.deviceReady, false);
		},
		deviceReady: function() {
			this.shake.startWatch();
			Backbone.history.start();
		}
	};

	_.extend(app, Backbone.Events);

	window.init = function() {
		if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
			FastClick.attach(document.body);
			app.initialize();
		} else {
			app.deviceReady();
		}
	}
})();
