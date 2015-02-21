(function() {
	'use strict';

	window.app = {
		Views: {},
		initialize: function() {
			this.bindEvents();
		},
		bindEvents: function() {
			document.addEventListener('deviceready', this.deviceReady, false);
		},
		deviceReady: function() {
			var self = this;
			this.shake = new Shake({
				frequency: 300,
				waitBetweenShakes: 1000,
				threshold: 12,
				success: function(magnitude, accelerationDelta, timestamp) {
					self.router.navigate('friends', {trigger: true});
				},
				failure: function() {}
			});
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
