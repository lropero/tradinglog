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
			$('#content').html('1');
			this.trigger('started');
			$('#content').html('2');
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
