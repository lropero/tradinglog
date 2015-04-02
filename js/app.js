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
			app.mobile();

			/** We start by calling the layout view which is in charge of rendering
				the header and footer (both of them separate views); all of these
				happens asynchronously using deferreds/promises */
			var layout = new app.Views.layout();

			$.when(

				/** DB becomes ready while layout loads; init() returns a promise */
				app.databaseController.init(),

				layout.deferred.promise()
			).done(function() {

				/** Get active account */
				app.account = new app.Models.account({
					id: 1
				});

				app.account.fetch({
					success: function() {

						/** DB and layout view are ready; we load the main view */
						app.view = new app.Views.main();

						/** We hide the initial splash screen once the main view is ready
							(i.e. all objects within are correctly loaded) */
						app.view.deferred.done(function() {
							if(navigator.splashscreen) {
								navigator.splashscreen.hide();
							}
						});

					}
				});
			});

			/** A cache is used to hold the HTML rendered in app.Views.main so we
			don't have to fetch all trades upon simple navigation. We then provide
			a way to clear it triggering an event */
			app.listenTo(app, 'clear', function(view) {
				delete app.cache;
				if(view) {
					this.loadView(view);
				}
			});

		},

		loadView: function(view, attrs) {

			/** Some views require to undelegate events, e.g. those with
				control segments (i.e. <ul><li>submenus</li></ul>) */
			if(typeof this.view.destroy === 'function') {
				this.view.destroy();
			}

			/** View is loaded */
			this.view = new app.Views[view](attrs);

		},

		mobile: function() {
			if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
				cordova.plugins.Keyboard.disableScroll(true);
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}

			app.disableScroll = function() {
				$('section#content').css('-webkit-overflow-scrolling', 'auto');
				$('section#content').css('overflow-y', 'hidden');
			}

			app.enableScroll = function() {
				$('section#content').css('-webkit-overflow-scrolling', 'touch');
				$('section#content').css('overflow-y', 'scroll');
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
