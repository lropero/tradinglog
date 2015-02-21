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
			this.trigger('started');
			Backbone.history.start();
			$('#content').html('ready');
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
