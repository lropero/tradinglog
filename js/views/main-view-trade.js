(function() {
	'use strict';

	app.Views.mainViewTrade = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap li.button-swipe.delete': 'buttonDelete',
			'tap ul.wrapper-button-default li': 'add'
		},

		initialize: function(key, cache) {
			this.key = key;
			this.trade = app.objects[key];
			this.template = Handlebars.compile(app.templateLoader.get('main-view-trade'));
			this.render(cache);
		},

		destroy: function() {
			this.undelegateEvents();
		},

		render: function(cache) {
			var self = this;
			var deferred = app.cache.get('mainViewTrade' + this.trade.id, this.template, {
				trade: this.trade
			});
			deferred.then(function(html) {
				if(typeof cache !== 'boolean') {
					app.trigger('change', 'main-view-trade');
					self.$el.html(html);
					app.swipe.init('.swipe');
					setTimeout(function() {
						app.enableScroll();
					}, 10);
				} else {
					setTimeout(function() {
						self.undelegateEvents();
					}, 10);
				}
			});
			return this;
		},

		add: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var view = $target.data('view');
			app.loadView(view, this.key);
		},

		buttonDelete: function(e) {
			var self = this;
			e.preventDefault();
			var id = $(e.currentTarget).data('id');
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			alertify.set({
				buttonFocus: 'none',
				buttonReverse: true,
				labels: {
					cancel: 'No',
					ok: 'Yes'
				}
			});
			alertify.confirm('Are you sure?', function(e) {
				var $alertify = $('section#alertify');
				$alertify.hide();
				setTimeout(function() {
					if($('div#alertify-cover').is(':hidden')) {
						$alertify.show();
					}
				}, 100);
				if(e) {
					$wrapper.hide();
					var $label = $wrapper.children('div');
					var object = $label.hasClass('comment') ? 'comment' : ($label.hasClass('position') ? 'position' : '');
					switch(object) {
						case 'comment':
							var comments = new app.Collections.comments();
							comments.setFetchId(id);
							comments.fetch({
								success: function() {
									var comment = comments.at(0);
									comment.delete(function() {
										var trades = new app.Collections.trades();
										trades.setFetchId(self.trade.id);
										trades.fetch({
											success: function() {
												var trade = trades.at(0);
												trade.deferred.then(function() {
													trade.addToComments(-1, function() {
														app.objects[self.key] = trade.toJSON();
														app.cache.delete('main');
														app.cache.delete('mainViewTrade' + self.trade.id);
														app.loadView('mainViewTrade', self.key);
													});
												});
											}
										});
									});
								}
							});
							break;
						case 'position':
							$('div#top').hide();
							$('div#loading').show();
							var positions = new app.Collections.positions();
							positions.setFetchId(id);
							positions.fetch({
								success: function() {
									var position = positions.at(0);
									position.delete(function(size) {
										var trades = new app.Collections.trades();
										trades.setFetchId(self.trade.id);
										trades.fetch({
											success: function() {
												var trade = trades.at(0);
												trade.deferred.then(function() {
													if((self.trade.type === 1 && size < 0) || (self.trade.type === 2 && size > 0)) {
														if(trade.get('closed_at')) {
															trade.setPnL(function() {
																var key = 0;
																for(var i = 0; i < app.count.open; i++) {
																	if(app.objects[i].id > self.trade.id) {
																		key++;
																	} else {
																		break;
																	}
																}
																app.objects[app.count.open].isNewest = false;
																app.count.open++;
																app.objects.splice(self.key, 1);
																app.count.closed--;
																app.objects.splice(key, 0, trade.toJSON());
																if(!(!app.count.closed && app.count.operations === 1)) {
																	app.objects[app.count.open].isNewest = true;
																}
																app.cache.delete('main');
																app.cache.delete('mainMap');
																app.cache.delete('mainViewTrade' + app.objects[app.count.open].id);
																app.cache.delete('mainViewTrade' + self.trade.id);
																app.loadView('mainViewTrade', key.toString());
															});
														} else {
															trade.setPnL(function() {
																app.objects[self.key] = trade.toJSON();
																app.cache.delete('main');
																app.cache.delete('mainViewTrade' + self.trade.id);
																app.loadView('mainViewTrade', self.key);
															});
														}
													} else {
														app.objects[self.key] = trade.toJSON();
														app.cache.delete('main');
														app.cache.delete('mainViewTrade' + self.trade.id);
														app.loadView('mainViewTrade', self.key);
													}
												});
											}
										});
									});
								}
							});
							break;
					}
				}
			});
		}
	});
})();
