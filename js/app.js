(function() {
	'use strict';

	window.app = {
		Collections: {},
		DAOs: {},
		Models: {},
		Templates: {},
		Views: {},

		init: function() {

			/** A few settings needed when running mobile */
			this.mobile();

			/** We start by calling the layout view which is in charge of rendering
				the header and footer (both of them separate views); all of these
				happens asynchronously using deferreds/promises */
			var layout = new app.Views.layout();

			$.when(

				/** DB becomes ready while layout loads; init() returns a promise */
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

			/** A cache is used to hold the HTML rendered in app.Views.main so we
			don't have to fetch all trades upon simple navigation. We then provide
			a way to clear it triggering an event */
			app.listenTo(app, 'clear', function(view) {
				delete app.cache;
				this.loadView(view);
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

		},

		mobile: function() {
			if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
				$('#main-stats-friends').html('1');
				StatusBar.styleLightContent();
				$('#main-stats-friends').append('2');
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				$('#main-stats-friends').append('3');
				FastClick.attach(document.body);
				$('#main-stats-friends').append('4');
				// window.addEventListener('native.keyboardshow', function() {
				// 	StatusBar.hide();
				// });
				// window.addEventListener('native.keyboardhide', function() {
				// 	StatusBar.show();
				// });
			}
		}
	};

	_.extend(app, Backbone.Events);

	window.start = function() {
		if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
			document.addEventListener('deviceready', app.init, false);
		} else {
			app.init();
		}
	}
})();
