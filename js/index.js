(function() {
	'use strict';

	window.app = {
		deviceReady: function() {
			window.addEventListener('load', function() {
				new FastClick(document.body);
			}, false);
			Backbone.history.start();
	        this.trigger('started');
		}
	};

	_.extend(app, Backbone.Events);

	window.load = function() {
		if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
			console.log('iphone');
			document.addEventListener('deviceready', app.deviceReady, false);
		} else {
			console.log('local');
			app.deviceReady();
		}
	}
})();
