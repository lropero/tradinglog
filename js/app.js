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

							/** Load welcome screen */
							app.view = new app.Views.welcome();

							/** We hide the initial splash screen once the welcome view is ready */
							app.hideSplash();

						} else {

							/** Get active account */
							app.account = accounts.models[0];

							/** We instantiate the layout view which is in charge of rendering the
								header and footer views */
							var layout = new app.Views.layout();

							$.when(
								layout.deferred,

								/** Fetch operations & trades */
								app.fetchObjects()

							).done(function() {

								/** Generate stats */
								if(app.stats.availables.monthly[0]) {
									app.stats.get(app.stats.availables.monthly[0]);
								};
								if(app.stats.availables.weekly[0]) {
									app.stats.get(app.stats.availables.weekly[0]);
								};

								/** Preload some templates to smoothen navigation */
								app.cache.reset();
								new app.Views.mainAddOperation(true);
								new app.Views.mainAddTrade(true);
								new app.Views.mainMap(true);
								for(var i = 0; i < app.count.open; i++) {
									new app.Views.mainViewTrade(i.toString(), true);
								}
								new app.Views.settingsAddAccount(' ', true);
								new app.Views.settingsAddInstrument(' ', true);

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

		fetchObjects: function() {
			var deferred = $.Deferred();
			app.operations = [];
			app.trades = [];
			$.when(
				app.fetchOperations(),
				app.fetchTrades()
			).done(function() {
				app.count = {
					open: 0,
					closed: 0,
					operations: 0
				};
				app.objects = [];
				app.prepareObjects();
				deferred.resolve();
			});
			return deferred;
		},

		fetchOperations: function() {
			var deferred = $.Deferred();
			var operations = new app.Collections.operations();
			operations.setAccountId(app.account.get('id'));
			operations.fetch({
				success: function() {
					operations = operations.toJSON();
					for(var i = 0; i < operations.length; i++) {
						app.operations.push(operations[i]);
					}
					deferred.resolve();
				}
			});
			return deferred;
		},

		fetchTrades: function() {
			var deferred = $.Deferred();
			var trades = new app.Collections.trades();
			trades.setAccountId(app.account.get('id'));
			trades.deferreds = [];
			trades.fetch({
				success: function() {
					$.when.apply($, trades.deferreds).done(function() {
						trades = trades.toJSON();
						for(var i = 0; i < trades.length; i++) {
							app.trades.push(trades[i]);

							/** Feed stats.availables */
							if(!trades[i].isOpen) {
								var date = new Date(trades[i].closed_at);
								var monthly = date.getFullYear() + '-' + date.getMonth();
								date.setDate(date.getDate() - date.getDay());
								var weekly = date.getFullYear() + '-' + date.getMonth() + '-' + (date.getDate());
								if(app.stats.availables.monthly[app.stats.availables.monthly.length - 1] !== monthly) {
									app.stats.availables.monthly.push(monthly);
								}
								if(app.stats.availables.weekly[app.stats.availables.weekly.length - 1] !== weekly) {
									app.stats.availables.weekly.push(weekly);
								}
							}

						}

						if(!app.stats.availables.monthly.length) {
							var date = new Date();
							var monthly = date.getFullYear() + '-' + date.getMonth();
							date.setDate(date.getDate() - date.getDay());
							var weekly = date.getFullYear() + '-' + date.getMonth() + '-' + (date.getDate());
							if(app.stats.availables.monthly[app.stats.availables.monthly.length - 1] !== monthly) {
								app.stats.availables.monthly.push(monthly);
							}
							if(app.stats.availables.weekly[app.stats.availables.weekly.length - 1] !== weekly) {
								app.stats.availables.weekly.push(weekly);
							}
						}

						deferred.resolve();
					});
				}
			});
			return deferred;
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

			/** Some views require to undelegate events */
			if(typeof this.view.destroy === 'function') {
				this.view.destroy();
			}

			$('div#drag').css('display', 'none');
			setTimeout(function() {
				self.disableScroll();
				self.view = new app.Views[view](attrs);
			}, 50);
		},

		prepareObjects: function() {
			while(app.trades.length && app.trades[0].closed_at === 0) {
				app.objects.push(app.trades.shift());
				app.count.open++;
			}
			while(app.operations.length && app.trades.length) {
				if(app.operations[0].created_at > app.trades[0].closed_at) {
					app.objects.push(app.operations.shift());
					app.count.operations++;
				} else {
					app.objects.push(app.trades.shift());
					app.count.closed++;
				}
			}
			while(app.operations.length) {
				app.objects.push(app.operations.shift());
				app.count.operations++;
			}
			while(app.trades.length) {
				app.objects.push(app.trades.shift());
				app.count.closed++;
			}
			if(!(!app.count.closed && app.count.operations === 1)) {
				app.objects[app.count.open].isFirst = true;
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

	$(function() {
		var welcome = new Image();
		welcome.src = 'img/welcome.gif';
	});
})();
