(function() {
	'use strict';

	window.app = {
		Views: {},
		init: function() {
			this.bindEvents();
		},
		bindEvents: function() {
			document.addEventListener('deviceready', this.deviceReady, false);
		},
		deviceReady: function() {
			FastClick.attach(document.body);
			Backbone.history.start();
			this.trigger('started');
		}
	};

	_.extend(app, Backbone.Events);
})();
