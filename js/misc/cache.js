(function() {
	'use strict';

	app.cache = {
		HTMLs: {},

		delete: function(name) {
			var self = this;
			var views = new app.Collections.views();
			views.setName(name);
			views.fetch({
				success: function() {
					if(views.length) {
						var view = views.at(0);
						view.delete(function() {
							delete self.HTMLs[name];
							if(name === 'main') {
								new app.Views.main(true);
							} else if(name === 'mainAddTrade') {
								new app.Views.mainAddTrade(true);
							} else if(name === 'mainMap') {
								new app.Views.mainMap(true);
							}
						});
					}
				}
			});
		},

		get: function(name, method, options) {
			var self = this;
			var deferred = $.Deferred();
			if(this.HTMLs[name]) {
				var html = LZString.decompressFromBase64(this.HTMLs[name].html);
				deferred.resolve(html, this.HTMLs[name].extra);
			} else {
				var views = new app.Collections.views();
				views.setName(name);
				views.fetch({
					success: function() {
						if(views.length) {
							var view = views.at(0).toJSON();
							self.HTMLs[view.name] = {};
							self.HTMLs[view.name].html = view.html;
							self.HTMLs[view.name].extra = JSON.parse(view.extra.replace(/'/g, '"'));
							var html = LZString.decompressFromBase64(view.html);
							deferred.resolve(html, self.HTMLs[view.name].extra);
						} else {
							// var timer = app.debug.start(template + ' -> html');
							switch(name) {
								case 'main':
									app.ready.then(function() {
										var html = method({
											objects: app.objects
										});
										html = html.replace(/\t/g, '').replace(/(\r\n|\r|\n)/g, '');
										self.HTMLs[name] = {};
										self.HTMLs[name].html = LZString.compressToBase64(html);
										self.HTMLs[name].extra = {
											closed: app.count.closed
										};
										// timer.stop();
										var view = new app.Models.view();
										view.set({
											name: name,
											html: self.HTMLs[name].html,
											extra: JSON.stringify(self.HTMLs[name].extra).replace(/"/g, '\'')
										});
										view.save(null, {
											success: function() {
												deferred.resolve(html, self.HTMLs[name].extra);
											}
										});
									});
									break;
								case 'mainMap':
									app.ready.then(function() {
										var max = 0;
										var trades = [];
										for(var i = app.count.open; i < app.objects.length; i++) {
											if(app.objects[i].instrument_id) {
												var abs = Math.abs(app.objects[i].net);
												if(abs > max) {
													max = abs;
												}
												trades.push(app.objects[i]);
											}
										}
										if(max === 0) {
											max = 1;
										}
										var html = method({
											max: max,
											trades: trades
										});
										html = html.replace(/\t/g, '').replace(/(\r\n|\r|\n)/g, '');
										self.HTMLs[name] = {};
										self.HTMLs[name].html = LZString.compressToBase64(html);
										self.HTMLs[name].extra = {};
										// timer.stop();
										var view = new app.Models.view();
										view.set({
											name: name,
											html: self.HTMLs[name].html,
											extra: JSON.stringify(self.HTMLs[name].extra).replace(/"/g, '\'')
										});
										view.save(null, {
											success: function() {
												deferred.resolve(html, self.HTMLs[name].extra);
											}
										});
									});
									break;
								default:
									var html = method(options);
									html = html.replace(/\t/g, '').replace(/(\r\n|\r|\n)/g, '');
									self.HTMLs[name] = {};
									self.HTMLs[name].html = LZString.compressToBase64(html);
									self.HTMLs[name].extra = {};
									// timer.stop();
									var view = new app.Models.view();
									view.set({
										name: name,
										html: self.HTMLs[name].html,
										extra: JSON.stringify(self.HTMLs[name].extra).replace(/"/g, '\'')
									});
									view.save(null, {
										success: function() {
											deferred.resolve(html, self.HTMLs[name].extra);
										}
									});
							}
						}
					}
				});
			}
			return deferred;
		},

		reset: function() {
			this.HTMLs = {};
		}
	};
})();
