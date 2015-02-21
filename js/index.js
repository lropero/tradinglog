(function() {
	'use strict';

	window.app = {
		Views: {},
		deviceReady: function() {
			Backbone.history.start();
			this.trigger('started');
		}
	};

	_.extend(app, Backbone.Events);

	window.init = function() {
		if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
			FastClick.attach(document.body);
			window.addEventListener('deviceready', app.deviceReady, false);
		} else {
			app.deviceReady();
		}
	}
})();
