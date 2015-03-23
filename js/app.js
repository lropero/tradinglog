(function() {
	'use strict';

	window.app = {
		Collections: {},
		DAOs: {},
		Models: {},
		Templates: {},
		Views: {},

		init: function() {

			/** We start by calling the layout view which is in charge of rendering
				the header and footer (both of them separate views); all of these
				happens asynchronously, i.e. app.Views.layout() has a 'deferred'
				property which allow us to set a done() method to continue booting
				after both views are ready */
			var layout = new app.Views.layout();

			$.when(

				/** DB becomes ready while layout loads and returns a promise */
				app.databaseController.init(),

				layout.deferred.promise()
			).done(function() {

				/** DB and layout view are ready; we load the main view */
				app.view = new app.Views.main();

				/** We hide the initial splash screen once the main view is ready
					(i.e. all objects within are correctly loaded) */
				app.view.deferred.done(function() {
					if(navigator.splashscreen) {
						navigator.splashscreen.hide();
					}
				});

			});
		},

		loadView: function(view) {

			/** Some views require to undelegate events, specifically those with
				control segments (i.e. <ul><li>submenus</li></ul>) */
			if(typeof this.view.destroy === 'function') {
				this.view.destroy();
			}

			/** View is loaded */
			this.view = new app.Views[view];

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
