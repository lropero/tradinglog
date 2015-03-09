(function() {
	'use strict';

	window.app = {
		currentView: '',
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
		},
		loadView: function(view, subview) {
			$(this.currentView).trigger('destroy');
			if(typeof subview === 'undefined') {
				this.currentView = new this.Views[view]();
			} else {
				this.currentView = new this.Views[view](subview);
			}
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
