(function() {
	'use strict';

	// window.app = {
	// 	Views: {},
	// 	deviceReady: function() {
	// 		Backbone.history.start();
	// 		this.trigger('started');
	// 	}
	// };

	// _.extend(app, Backbone.Events);

	window.say = function() {
		document.getElementById('content').innerHTML = 'jeje';
	}

	window.init = function() {
		if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
			FastClick.attach(document.body);
			document.addEventListener('deviceready', say, false);
		} else {
			// say();
		}
	}
})();
