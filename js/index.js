(function() {
	'use strict';

	window.app = {
		Views: {},
		deviceReady: function() {
			window.addEventListener('load', function() {
				new FastClick(document.body);
			}, false);
			Backbone.history.start();
			this.trigger('started');
		}
	};

	_.extend(app, Backbone.Events);

	window.init = function() {
		document.addEventListener('deviceready', app.deviceReady, false);
		// if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
		// 	document.addEventListener('deviceready', app.deviceReady, false);
		// } else {
		// 	app.deviceReady();
		// }
	}
})();
