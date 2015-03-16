(function() {
	'use strict';

	window.app = {
		Collections: {},
		DAOs: {},
		Models: {},
		Templates: {},
		Views: {},
		init: function() {
			var self = this;
			var layout = new app.Views.layout();
			$.when(
				// app.databaseController.init(),
				layout.deferred.promise()
			).done(function() {
				self.view = new app.Views.friends();
			});
		},
		loadView: function(view) {
			$('section#main-stats-friends').html(typeof this.view.destroy);
			if(typeof this.view.destroy !== 'undefined') {
				// this.view.destroy();
			}
			$('section#main-stats-friends').append('<br />pasamo');
			// this.view = new app.Views[view];
		}
	};

	_.extend(app, Backbone.Events);

	window.start = function() {
		if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
			FastClick.attach(document.body);
			document.addEventListener('deviceready', app.init, false);
		} else {
			app.init();
		}
	}
})();
