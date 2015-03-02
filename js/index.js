(function() {
	'use strict';

	window.app = {
		Helpers: {},
		Templates: {},
		Views: {},
		initialize: function() {
			this.bindEvents();
		},
		bindEvents: function() {
			document.addEventListener('deviceready', this.deviceReady, false);
		},
		deviceReady: function() {
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

	$(function() {
		$('.navigation').on('click', 'button', function(e) {
			var target = $(e.currentTarget);
			var view = target.data('view');
			app.router.view = new app.Views[view]();
		});
	});
})();
