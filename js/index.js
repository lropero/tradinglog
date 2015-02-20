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

	window.init = function() {
		if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
			// var script = document.createElement('script');
			// script.setAttribute('type', 'text/javascript');
			// script.setAttribute('src', 'phonegap.js');
			// document.getElementsByTagName('head')[0].appendChild(script);
			document.addEventListener('deviceready', app.deviceReady, false);
		} else {
			app.deviceReady();
		}
	}
})();
