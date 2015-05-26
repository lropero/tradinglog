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
				app.templateLoader.load(function() {
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
								app.account = accounts.at(0);

								/** We instantiate the layout view which is in charge of rendering the
									header and footer views */
								var layout = new app.Views.layout();

								layout.deferred.done(function() {
									app.dates = {};
									app.fetchObjects().done(function() {

										// Remove
										var timestamp = 0;
										for(var i = 0; i < app.objects.length; i++) {
											if(app.objects[i].objects) {
												for(var j = 0; j < app.objects[i].objects.length; j++) {
													if(app.objects[i].objects[j].created_at > timestamp) {
														timestamp = app.objects[i].objects[j].created_at;
													}
												}
											} else {
												if(app.objects[i].created_at > timestamp) {
													timestamp = app.objects[i].created_at;
												}
											}
										}
										app.timestamp = timestamp;

										/** Load main view */
										app.view = new app.Views.main({});

										/** We hide the initial splash screen once the main view is ready */
										app.hideSplash();

										/** Preload some templates to smoothen navigation */
										new app.Views.mainAddOperation(true);
										new app.Views.mainAddTrade(true);
										new app.Views.mainMap(true);
										new app.Views.mainViewTrade({
											cache: true
										});
										new app.Views.settingsAddAccount({
											cache: true
										});
										new app.Views.settingsAddInstrument({
											cache: true
										});

									});
								});
							}
						}
					});
				});
			});
		},

		disableScroll: function() {
			var $content = $('section#content');
			$content.css('-webkit-overflow-scrolling', 'auto');
			$content.css('overflow-y', 'hidden');
		},

		fetchObjects: function() {
			var deferred = $.Deferred();
			var caches = new app.Collections.caches();
			caches.setAccountId(app.account.id);
			caches.fetch({
				success: function() {
					if(caches.length) {
						var cache = caches.at(0).toJSON();
						app.stats.availables = JSON.parse(LZString.decompressFromBase64(cache.availables));
						app.count = JSON.parse(LZString.decompressFromBase64(cache.count));
						app.dates = JSON.parse(LZString.decompressFromBase64(cache.dates));
						app.objects = JSON.parse(LZString.decompressFromBase64(cache.objects));
						deferred.resolve();
					} else {
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
							app.storeCache().done(function() {
								deferred.resolve();
							});
						});
					}
				}
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
						trades = trades.toJSON(true);
						for(var i = 0; i < trades.length; i++) {
							app.trades.push(trades[i]);

							/** Feed stats.availables */
							if(!trades[i].isOpen) {
								var date = new Date(trades[i].closed_at);
								app.dates.firstDate = date.getTime();
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
						deferred.resolve();
					});
				}
			});
			return deferred;
		},

		enableScroll: function() {
			var $content = $('section#content');
			$content.css('-webkit-overflow-scrolling', 'touch');
			$content.css('overflow-y', 'scroll');
		},

		hideSplash: function() {
			app.view.deferred.done(function() {
				if(navigator.splashscreen) {
					navigator.splashscreen.hide();
				}
			});
		},

		loadView: function(view, attrs, callback) {
			var self = this;

			/** Some views require to undelegate events */
			if(typeof this.view.destroy === 'function') {
				this.view.destroy();
			}

			if($('div#drag').is(':hidden')) {
				this.view = new app.Views[view](attrs);
			} else {
				$('div#drag').css('display', 'none');
				setTimeout(function() {
					self.view = new app.Views[view](attrs);
				}, 30);
			}

			if(typeof callback === 'function') {
				callback();
			}
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
				app.objects[app.count.open].isNewest = true;
			}
			delete app.operations;
			delete app.trades;
		},

		storeCache: function() {
			var deferred = new $.Deferred();
			var availables = LZString.compressToBase64(JSON.stringify(app.stats.availables));
			var count = LZString.compressToBase64(JSON.stringify(app.count));
			var dates = LZString.compressToBase64(JSON.stringify(app.dates));
			var objects = LZString.compressToBase64(JSON.stringify(app.objects));
			var cache = new app.Models.cache();
			cache.set({
				account_id: app.account.id,
				availables: availables,
				count: count,
				dates: dates,
				objects: objects
			});
			cache.save(null, {
				success: function() {
					deferred.resolve();
				}
			});
			return deferred;
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
