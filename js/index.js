(function() {
	'use strict';

	window.app = {
		currentView: '',
		router: '',
		Helpers: {},
		Templates: {},
		Views: {},
		init: function() {
			this.bindEvents();
		},
		bindEvents: function() {
			document.addEventListener('deviceready', this.deviceReady, false);
		},
		deviceReady: function() {
			$('#main-stats-friends').append(typeof this.router + ' ROUTER<br />');
			$('#main-stats-friends').append(typeof this.db + '3<br />');
			$('#main-stats-friends').append(typeof this.db.init);
			this.db.init();
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
			app.init();
		} else {
			app.deviceReady();
		}
	}
})();
