(function() {
	'use strict';

	window.app = {
		Collections: {},
		DAOs: {},
		Models: {},
		Templates: {},
		Views: {},

		init: function() {

			/** Mobile setting to avoid a visual glitch that occurs when keyboard is
				shown */
			if(typeof cordova !== 'undefined') {
				cordova.plugins.Keyboard.disableScroll(true);
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}

			app.databaseController.init().done(function() {
				var accounts = new app.Collections.accounts();
				accounts.setActive();
				accounts.fetch({
					success: function() {
						if(!accounts.length) {

							/** No active account, load welcome screen */
							app.view = new app.Views.welcome();

							/** We hide the initial splash screen once the welcome view is ready */
							app.hideSplash();

						} else {

							/** Get active account */
							app.account = accounts.models[0];

							/** We instantiate the layout view which is in charge of rendering the
								header and footer views */
							var layout = new app.Views.layout();

							layout.deferred.done(function() {

								/** Preload some templates to smoothen navigation */
								app.cache.reset();
								var trades = new app.Collections.trades();
								trades.setAccountId(app.account.get('id'));
								trades.setOpen();
								trades.deferreds = [];
								trades.fetch({
									success: function() {
										$.when.apply($, trades.deferreds).done(function() {
											trades = trades.toJSON();
											for(var i = 0; i < trades.length; i++) {
												new app.Views.mainViewTrade({
													trade: trades[i]
												}, true);
											}
										});
									}
								});
								new app.Views.mainAddOperation(true);
								new app.Views.mainAddTrade(true);
								new app.Views.mainMap(true);
								new app.Views.settingsAddAccount(true);
								new app.Views.settingsAddInstrument(true);

								/** Load main view */
								app.view = new app.Views.main();

								/** We hide the initial splash screen once the main view is ready */
								app.hideSplash();

							});
						}
					}
				});
			});
		},

		disableScroll: function() {
			$('section#content').css('-webkit-overflow-scrolling', 'auto');
			$('section#content').css('overflow-y', 'hidden');
		},

		enableScroll: function() {
			$('section#content').css('-webkit-overflow-scrolling', 'touch');
			$('section#content').css('overflow-y', 'scroll');
		},

		hideSplash: function() {
			app.view.deferred.done(function() {
				if(navigator.splashscreen) {
					navigator.splashscreen.hide();
				}
			});
		},

		loadView: function(view, attrs) {
			var self = this;

			/** Some views require to undelegate events, e.g. those with control
				segments (i.e. <ul><li>submenus</li></ul>) */
			if(typeof this.view.destroy === 'function') {
				this.view.destroy();
			}

			/** Load view */
			setTimeout(function() {
				self.view = new app.Views[view](attrs);
			}, 10);

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

	$(function() {
		var welcome = new Image();
		welcome.src = 'img/welcome.gif';
	});
})();
