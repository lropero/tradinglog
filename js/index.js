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
			$('#content').html('ready');
			FastClick.attach(document.body);
			Backbone.history.start();
			this.trigger('started');
		}
	};

	_.extend(app, Backbone.Events);
})();
